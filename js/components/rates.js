export function fetchAndDisplayRates(date) {
    return fetch(`https://api.nbrb.by/exrates/rates?ondate=${date}&periodicity=0`)
        .then(response => response.json())
        .then(data => createRatesMarkup(data))
}

function createRatesMarkup(data) {
    const container = document.createElement('div');
    container.className = 'exchange-rates';
    data.forEach(rate => {
        const rateCard = document.createElement('div');
        rateCard.className = 'exchange-rate-card';

        const rateName = document.createElement('h2');
        rateName.textContent = rate.Cur_Name;

        const rateValue = document.createElement('p');
        rateValue.textContent = `Rate: ${rate.Cur_OfficialRate}`;

        const rateScale = document.createElement('p');
        rateScale.textContent = `Scale: ${rate.Cur_Scale}`;

        rateCard.appendChild(rateName);
        rateCard.appendChild(rateValue);
        rateCard.appendChild(rateScale);

        container.appendChild(rateCard);
    });
    return container;
}
