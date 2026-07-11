// Function to fetch data from our Node.js Server
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        document.getElementById('total-plastic').innerText = data.totalPlastic;
        
        const log = document.getElementById('history-log');
        log.innerHTML = ''; // Clear log
        
        data.collections.slice(-5).reverse().forEach(entry => {
            const p = document.createElement('p');
            p.innerText = `> ${entry.timestamp}: Collected ${entry.amount} pieces at ${entry.location}`;
            log.appendChild(p);
        });
    } catch (err) {
        console.error("Server not running?", err);
    }
}

// Function to send data to the server
async function sendData() {
    const amount = parseInt(document.getElementById('plastic-input').value);
    if (!amount) return alert("Enter a number!");

    try {
        const response = await fetch('/api/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: amount, 
                location: "Sector 7G - Riverbed" 
            })
        });
        
        const result = await response.json();
        alert(result.message);
        loadStats(); // Refresh data
    } catch (err) {
        alert("Server Error!");
    }
}

// Refresh data every 5 seconds
setInterval(loadStats, 5000);
window.onload = loadStats;
