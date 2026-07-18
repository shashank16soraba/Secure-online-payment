// Shared functions for all pages

const secretKey = 'mySecureKey123'; // Demo key; in real apps, generate securely server-side

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Fake OTP verification
    const otp = prompt('Enter OTP: (For demo, enter 1234)');
    if (otp === '1234') {
        alert('OTP verified successfully!');
        // Store dummy user data
        localStorage.setItem('user', JSON.stringify({ name: 'User', balance: 5000 }));
        localStorage.setItem('transactions', JSON.stringify([]));
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid OTP!');
    }
}

function loadDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.name}!`;
    document.getElementById('balance').textContent = user.balance;
}

function addMoney() {
    const amount = parseFloat(prompt('Enter amount to add:'));
    if (isNaN(amount) || amount <= 0) {
        alert('Invalid amount!');
        return;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    user.balance += amount;
    localStorage.setItem('user', JSON.stringify(user));
    loadDashboard();
    alert('Money added successfully!');
}

function handlePayment(event) {
    event.preventDefault();
    const receiver = document.getElementById('receiver').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const method = document.getElementById('method').value;
    
    if (!receiver || isNaN(amount) || amount <= 0 || !method) {
        alert('Please fill all fields correctly!');
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (amount > user.balance) {
        alert('Insufficient balance!');
        return;
    }
    
    // Fraud detection simulation
    if (amount > 50000) {
        alert('Suspicious transaction flagged! AI fraud detection activated.');
        // In real systems, this would trigger review; here, we proceed for demo
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    
    // Simulate encryption
    const paymentData = JSON.stringify({ receiver, amount, method });
    const encrypted = CryptoJS.AES.encrypt(paymentData, secretKey).toString();
    console.log('Encrypted Data (sent to server):', encrypted);
    
    // Simulate decryption (for demo only; in reality, done server-side)
    const decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);
    console.log('Decrypted Data (at server):', decrypted);
    
    // Simulate backend API call with delay
    setTimeout(() => {
        const txnId = 'TXN' + Math.floor(Math.random() * 100000);
        const timestamp = new Date().toLocaleString();
        
        // Update balance
        user.balance -= amount;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Add to transactions
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        transactions.push({ date: timestamp, receiver, amount, status: 'Success' });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Store for success page
        localStorage.setItem('lastTxn', JSON.stringify({ receiver, amount, method, txnId, timestamp }));
        
        alert('Payment confirmed! Email/SMS sent.'); // Fake notification
        
        window.location.href = 'success.html';
    }, 3000);
}

function loadSuccess() {
    const txn = JSON.parse(localStorage.getItem('lastTxn'));
    if (!txn) {
        window.location.href = 'dashboard.html';
        return;
    }
    document.getElementById('txnDetails').innerHTML = `
        Receiver: ${txn.receiver}<br>
        Amount: ₹${txn.amount}<br>
        Method: ${txn.method}<br>
        Transaction ID: ${txn.txnId}<br>
        Time: ${txn.timestamp}
    `;
}

function loadHistory() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const tableBody = document.getElementById('historyTable');
    tableBody.innerHTML = '';
    transactions.forEach(txn => {
        const row = `<tr>
            <td>${txn.date}</td>
            <td>${txn.receiver}</td>
            <td>${txn.amount}</td>
            <td>${txn.status}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function resetData() {
    localStorage.clear();
    alert('Data reset!');
    window.location.href = 'index.html';
}