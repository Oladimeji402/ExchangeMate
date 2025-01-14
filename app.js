window.onload = function () {
    setTimeout(function () {
        document.querySelector('.loader').style.display = 'none';
    }, 3000); // Delay of 3 seconds before hiding
     // Hide loader after 3 seconds
     setTimeout(function() {
        document.querySelector('.loader-container').style.display = 'none';
    }, 3000);
};

class ExchangeMate {
    constructor() {
        this.apiKey = '9f26a9cddf8201f8d4011fc6'; 
        this.baseUrl = 'https://v6.exchangerate-api.com/v6';
        this.currencies = [];
        this.initializeApp();
    }

    async initializeApp() {
        try {
            await this.loadCurrencies();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.displayError('Failed to load the application. Please try again later.');
        }
    }

    async loadCurrencies() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.apiKey}/codes`);
            const data = await response.json();

            if (data.result === 'success') {
                this.currencies = data.supported_codes;
                this.populateCurrencyDropdowns();
            } else {
                throw new Error('Unable to fetch currency codes.');
            }
        } catch (error) {
            console.error('Failed to load currencies:', error);
            this.displayError('Failed to load currencies. Please try again later.');
        }
    }

    populateCurrencyDropdowns() {
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');

        this.currencies.forEach(([code, name]) => {
            fromSelect.add(new Option(`${code} - ${name}`, code));
            toSelect.add(new Option(`${code} - ${name}`, code));
        });
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
            );
            const data = await response.json();

            if (data.result === 'success') {
                return data.conversion_result;
            } else {
                throw new Error('Conversion failed.');
            }
        } catch (error) {
            console.error('Conversion failed:', error);
            throw error;
        }
    }

    setupEventListeners() {
        const form = document.getElementById('converterForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const amount = document.getElementById('amount').value;
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;

            if (!amount || amount <= 0) {
                this.displayError('Please enter a valid amount.');
                return;
            }

            try {
                const result = await this.convertCurrency(amount, fromCurrency, toCurrency);
                this.displayResult(amount, fromCurrency, toCurrency, result);
            } catch (error) {
                this.displayError('Conversion failed. Please try again.');
            }
        });
    }

    displayResult(amount, fromCurrency, toCurrency, result) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3 class="mb-3">Conversion Result</h3>
            <p class="lead">
                ${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}
            </p>
        `;
    }

    displayError(message) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new ExchangeMate();
});
