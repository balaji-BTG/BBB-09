// Alpha Vantage API Key
const API_KEY = "67bde1a707b905.96657127";  // Correct API Token
const STOCK_SYMBOLS = ["RELIANCE.BSE", "TCS.BSE", "INFY.BSE"]; // Example stocks

async function fetchStockData(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data["Global Quote"]) throw new Error("Invalid API response");

        return {
            name: symbol,
            price: data["Global Quote"]["05. price"] || "N/A",
            change: data["Global Quote"]["10. change percent"] || "N/A",
        };
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return { name: symbol, price: "N/A", change: "N/A" };
    }
}

async function displayLiveStocks() {
    const stockDiv = document.getElementById("stocks");
    stockDiv.innerHTML = "<p>Loading stock data...</p>";

    let stockDataArray = await Promise.all(STOCK_SYMBOLS.map(fetchStockData));

    stockDiv.innerHTML = ""; // Clear loading message
    stockDataArray.forEach(stock => {
        const stockItem = document.createElement("p");
        stockItem.innerHTML = `<strong>${stock.name}</strong>: ₹${stock.price} (${stock.change})`;
        stockDiv.appendChild(stockItem);
    });
}

async function fetchCryptoData() {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const price = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];

        document.getElementById("crypto-price").innerHTML = `BTC Price: $${parseFloat(price).toFixed(2)}`;
    } catch (error) {
        console.error("Error fetching crypto data:", error);
    }
}

// Refresh stock & crypto data
setInterval(displayLiveStocks, 60000);
setInterval(fetchCryptoData, 30000);
displayLiveStocks();
fetchCryptoData();

// Login System
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    
    if (username && password.length >= 6) {
        window.location.href = "stocks.html";
    } else {
        document.getElementById("error-message").textContent = "Invalid login!";
    }
});
