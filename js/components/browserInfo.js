export function displayBrowserInfo() {
    const container = document.createElement('div');
    container.className = 'browser-info-card';

    const browserName = document.createElement('h2');
    browserName.textContent = `Browser: ${navigator.appName}`;

    const browserVersion = document.createElement('p');
    browserVersion.textContent = `Version: ${navigator.appVersion}`;

    const userAgent = document.createElement('p');
    userAgent.textContent = `User Agent: ${navigator.userAgent}`;

    container.appendChild(browserName);
    container.appendChild(browserVersion);
    container.appendChild(userAgent);

    return container;
}
