class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');
        const color = this.getColor(number);

        const circle = document.createElement('div');
        circle.style.backgroundColor = color;
        circle.style.width = '60px';
        circle.style.height = '60px';
        circle.style.borderRadius = '50%';
        circle.style.display = 'flex';
        circle.style.justifyContent = 'center';
        circle.style.alignItems = 'center';
        circle.style.color = 'white';
        circle.style.fontSize = '1.5em';
        circle.style.fontWeight = 'bold';
        circle.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        circle.textContent = number;

        shadow.appendChild(circle);
    }

    getColor(number) {
        const num = parseInt(number);
        if (num <= 10) return '#f44336'; // Red
        if (num <= 20) return '#ff9800'; // Orange
        if (num <= 30) return '#ffc107'; // Amber
        if (num <= 40) return '#4caf50'; // Green
        return '#2196f3'; // Blue
    }
}

customElements.define('lotto-ball', LottoBall);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    numbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});
