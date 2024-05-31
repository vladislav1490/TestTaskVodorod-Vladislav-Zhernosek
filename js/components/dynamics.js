export function fetchAndDisplayDynamics(curId, startDate, endDate) {
    return fetch(`https://api.nbrb.by/exrates/rates/dynamics/${curId}?startdate=${startDate}&enddate=${endDate}`)
        .then(response => response.json())
        .then(data => createDynamicsMarkup(data))
        .catch(error => {
            console.error('Error fetching exchange rate dynamics:', error);
            return createErrorMarkup(error);
        });
}

export function createDynamicsMarkup(data) {
    const container = document.createElement('div');
    container.className = 'dynamics-results';
    if (data.length === 0) {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'No data available for the selected period.';
        container.appendChild(noDataMessage);
        return container;
    }
    data.forEach(rate => {
        const rateCard = document.createElement('div');
        rateCard.className = 'dynamics-rate-card';

        const rateDate = document.createElement('h2');
        rateDate.textContent = new Date(rate.Date).toLocaleDateString();

        const rateValue = document.createElement('p');
        rateValue.textContent = `Rate: ${rate.Cur_OfficialRate}`;

        rateCard.appendChild(rateDate);
        rateCard.appendChild(rateValue);

        container.appendChild(rateCard);
    });
    return container;
}

function createErrorMarkup(error) {
    const container = document.createElement('div');
    container.className = 'error';
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Error: ${error.message}`;
    container.appendChild(errorMessage);
    return container;
}
