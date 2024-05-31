import { fetchAndDisplayRates } from '/js/components/rates.js';
import { displayBrowserInfo } from '/js/components/browserInfo.js';
import { fetchAndDisplayDynamics } from '/js/components/dynamics.js';
import { fetchRatesForConversion, convertCurrency, populateCurrencyOptions } from '/js/components/converter.js';

document.addEventListener('DOMContentLoaded', () => {
    const showRatesCheckbox = document.getElementById('show-rates');
    const showBrowserInfoCheckbox = document.getElementById('show-browser-info');
    const showDynamicsCheckbox = document.getElementById('show-dynamics');
    const showConverterCheckbox = document.getElementById('show-converter');
    const shareButton = document.getElementById('share');

    const exchangeRatesContainer = document.getElementById('exchange-rates');
    const browserInfoContainer = document.getElementById('browser-info');
    const exchangeDynamicsContainer = document.getElementById('exchange-dynamics');
    const currencyConverterContainer = document.getElementById('currency-converter');
    const dynamicsResultsContainer = document.getElementById('dynamics-results');

    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const currencySelect = document.getElementById('currency');
    const fetchDynamicsButton = document.getElementById('fetch-dynamics');

    const currencyASelect = document.getElementById('currency-a');
    const currencyBSelect = document.getElementById('currency-b');
    const amountAInput = document.getElementById('amount-a');
    const amountBInput = document.getElementById('amount-b');

    let rates = {};

    function updateContent() {
        const params = new URLSearchParams(window.location.search);

        exchangeRatesContainer.style.display = params.get('showRates') === 'true' ? 'block' : 'none';
        browserInfoContainer.style.display = params.get('showBrowserInfo') === 'true' ? 'flex' : 'none';
        exchangeDynamicsContainer.style.display = params.get('showDynamics') === 'true' ? 'flex' : 'none';
        currencyConverterContainer.style.display = params.get('showConverter') === 'true' ? 'block' : 'none';

        if (params.get('showRates') === 'true') {
            const date = new Date().toISOString().split('T')[0];
            fetchAndDisplayRates(date).then(container => {
                exchangeRatesContainer.innerHTML = '';
                exchangeRatesContainer.appendChild(container);
            });
        }

        if (params.get('showBrowserInfo') === 'true') {
            browserInfoContainer.innerHTML = '';
            browserInfoContainer.appendChild(displayBrowserInfo());
        }

        if (params.get('showDynamics') === 'true') {
            populateCurrencyOptionsForDynamics();
        }

        if (params.get('showConverter') === 'true') {
            fetchRatesForConversion().then(data => {
                if (data.length === 0) {
                    console.error('No exchange rates data available.');
                    return;
                }
                rates = data.reduce((acc, rate) => {
                    acc[rate.Cur_Abbreviation] = rate;
                    return acc;
                }, {});
                populateCurrencyOptions(data, currencyASelect);
                populateCurrencyOptions(data, currencyBSelect);
            });
        }
    }

    function populateCurrencyOptionsForDynamics() {
        fetch('https://api.nbrb.by/exrates/currencies')
            .then(response => response.json())
            .then(currencies => {
                currencySelect.innerHTML = '';
                currencies.forEach(currency => {
                    const option = document.createElement('option');
                    option.value = currency.Cur_ID;
                    option.textContent = currency.Cur_Name;
                    currencySelect.appendChild(option);
                });
            })
        }

    function handleAmountInputChange() {
        const amountA = parseFloat(amountAInput.value);
        const amountB = parseFloat(amountBInput.value);
        const rateA = rates[currencyASelect.value]?.Cur_OfficialRate;
        const scaleA = rates[currencyASelect.value]?.Cur_Scale;
        const rateB = rates[currencyBSelect.value]?.Cur_OfficialRate;
        const scaleB = rates[currencyBSelect.value]?.Cur_Scale;

        if (!rateA || !rateB || !scaleA || !scaleB) {
            console.error('Unable to fetch rates or scales for conversion');
            return;
        }

        if (isNaN(amountA) && isNaN(amountB)) {
            console.error('Invalid input values');
            return;
        }

        if (this.id === 'amount-a' && !isNaN(amountA)) {
            const convertedValue = convertCurrency(amountA, rateA, scaleA, rateB, scaleB);
            if (!isNaN(convertedValue)) {
                amountBInput.value = convertedValue.toFixed(2);
            }
        } else if (this.id === 'amount-b' && !isNaN(amountB)) {
            const convertedValue = convertCurrency(amountB, rateB, scaleB, rateA, scaleA);
            if (!isNaN(convertedValue)) {
                amountAInput.value = convertedValue.toFixed(2);
            }
        }
    }

    function updateCheckboxState() {
        const params = new URLSearchParams(window.location.search);

        showRatesCheckbox.checked = params.get('showRates') === 'true';
        showBrowserInfoCheckbox.checked = params.get('showBrowserInfo') === 'true';
        showDynamicsCheckbox.checked = params.get('showDynamics') === 'true';
        showConverterCheckbox.checked = params.get('showConverter') === 'true';
    }

    function updateURL() {
        const params = new URLSearchParams();
        params.set('showRates', showRatesCheckbox.checked);
        params.set('showBrowserInfo', showBrowserInfoCheckbox.checked);
        params.set('showDynamics', showDynamicsCheckbox.checked);
        params.set('showConverter', showConverterCheckbox.checked);
        history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }

    function handleCheckboxChange() {
        updateURL();
        updateContent();
    }

    showRatesCheckbox.addEventListener('change', handleCheckboxChange);
    showBrowserInfoCheckbox.addEventListener('change', handleCheckboxChange);
    showDynamicsCheckbox.addEventListener('change', handleCheckboxChange);
    showConverterCheckbox.addEventListener('change', handleCheckboxChange);

    fetchDynamicsButton.addEventListener('click', () => {
        const curId = currencySelect.value;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        if (curId && startDate && endDate) {
            fetchAndDisplayDynamics(curId, startDate, endDate).then(container => {
                dynamicsResultsContainer.innerHTML = '';
                dynamicsResultsContainer.appendChild(container);
            }).catch(error => {
                console.error('Error fetching dynamics:', error);
            });
        } else {
            alert('Please select a currency and specify both start and end dates.');
        }
    });

    amountAInput.addEventListener('input', handleAmountInputChange);
    amountBInput.addEventListener('input', handleAmountInputChange);
    currencyASelect.addEventListener('change', handleAmountInputChange);
    currencyBSelect.addEventListener('change', handleAmountInputChange);

    shareButton.addEventListener('click', () => {
        const url = new URL(window.location);
        url.searchParams.set('showRates', showRatesCheckbox.checked);
        url.searchParams.set('showBrowserInfo', showBrowserInfoCheckbox.checked);
        url.searchParams.set('showDynamics', showDynamicsCheckbox.checked);
        url.searchParams.set('showConverter', showConverterCheckbox.checked);
        navigator.clipboard.writeText(url.toString()).then(() => {
            alert('Link copied to clipboard!');
        });
    });

    window.addEventListener('popstate', () => {
        updateCheckboxState();
        updateContent();
    });

    updateCheckboxState();
    updateContent();
});
