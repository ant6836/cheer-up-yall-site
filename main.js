// Cheer messages
const cheerMessages = [
    "You're doing amazing! Keep going! 💪",
    "Today is your day to shine! ✨",
    "Believe in yourself, you've got this! 🌟",
    "Every step forward is progress! 🚀",
    "You are stronger than you think! 💖",
    "Good things are coming your way! 🌈",
    "Your potential is limitless! 🔥",
    "Take a deep breath, you're doing great! 🌸",
    "Challenges make you stronger! 💎",
    "You are worthy of all good things! 🌻",
    "Keep smiling, it suits you! 😊",
    "The best is yet to come! 🎉",
    "You make the world a better place! 🌍",
    "Trust the process, trust yourself! 🦋",
    "You are loved and appreciated! ❤️"
];

function getRandomCheer() {
    const randomIndex = Math.floor(Math.random() * cheerMessages.length);
    return cheerMessages[randomIndex];
}

// Display initial cheer message
const cheerMessageEl = document.getElementById('cheer-message');
cheerMessageEl.textContent = getRandomCheer();

// New cheer button
document.getElementById('new-cheer-btn').addEventListener('click', () => {
    cheerMessageEl.style.opacity = '0';
    setTimeout(() => {
        cheerMessageEl.textContent = getRandomCheer();
        cheerMessageEl.style.opacity = '1';
    }, 300);
});

// Lotto Ball Component
class LottoBall extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['number'];
    }

    attributeChangedCallback() {
        if (this.shadowRoot) {
            this.render();
        }
    }

    render() {
        const number = this.getAttribute('number');
        const color = this.getColor(number);

        this.shadowRoot.innerHTML = `
            <style>
                .ball {
                    background-color: ${color};
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-size: 1.5em;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    font-family: 'Arial', sans-serif;
                }
            </style>
            <div class="ball">${number}</div>
        `;
    }

    getColor(number) {
        const num = parseInt(number);
        if (num <= 10) return '#f44336';
        if (num <= 20) return '#ff9800';
        if (num <= 30) return '#ffc107';
        if (num <= 40) return '#4caf50';
        return '#2196f3';
    }
}

customElements.define('lotto-ball', LottoBall);

// Generate lotto numbers
document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoNumbersContainer = document.getElementById('lotto-numbers');
    lottoNumbersContainer.innerHTML = '';
    const numbers = new Set();

    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        lottoNumbersContainer.appendChild(lottoBall);
    });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeText = themeToggle.querySelector('.theme-text');
const body = document.body;

function updateThemeButton(isDark) {
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    updateThemeButton(true);
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    updateThemeButton(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
