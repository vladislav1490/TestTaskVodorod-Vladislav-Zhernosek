export function fetchRatesForConversion() {
    return fetch('https://api.nbrb.by/exrates/rates?periodicity=0')
        .then(response => response.json())
}

export function convertCurrency(amount, rateA, scaleA, rateB, scaleB) {
    return (amount * (rateA / scaleA)) / (rateB / scaleB);
}

export function populateCurrencyOptions(currencies, selectElement) {
    selectElement.innerHTML = '';
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency.Cur_Abbreviation;
        option.textContent = `${currency.Cur_Abbreviation} - ${currency.Cur_Name}`;
        option.dataset.scale = currency.Cur_Scale;
        selectElement.appendChild(option);
    });
}
