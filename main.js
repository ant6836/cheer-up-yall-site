// Cheer data
let cheerData = null;

// Load cheer data from JSON file
async function loadCheerData() {
    try {
        const response = await fetch('data/cheers.json');
        cheerData = await response.json();
        initializeEmotionButtons();
        displayGeneralCheer();
    } catch (error) {
        console.error('Error loading cheer data:', error);
        // Fallback messages if JSON fails to load
        cheerData = {
            general: {
                messages: [
                    "You're doing amazing! Keep going! 💪",
                    "Today is your day to shine! ✨",
                    "Believe in yourself, you've got this! 🌟"
                ]
            },
            emotions: {}
        };
        displayGeneralCheer();
    }
}

// Get random message from array
function getRandomMessage(messages) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Display general cheer message on home tab
function displayGeneralCheer() {
    const cheerMessageEl = document.getElementById('cheer-message');
    if (cheerData && cheerData.general) {
        cheerMessageEl.textContent = getRandomMessage(cheerData.general.messages);
    }
}

// Initialize emotion buttons
function initializeEmotionButtons() {
    const emotionButtonsContainer = document.getElementById('emotion-buttons');
    if (!cheerData || !cheerData.emotions) return;

    emotionButtonsContainer.innerHTML = '';

    Object.entries(cheerData.emotions).forEach(([key, emotion]) => {
        const button = document.createElement('button');
        button.className = 'emotion-btn';
        button.dataset.emotion = key;
        button.innerHTML = `
            <span class="emotion-icon">${emotion.icon}</span>
            <span class="emotion-label">${emotion.label}</span>
        `;
        button.addEventListener('click', () => selectEmotion(key));
        emotionButtonsContainer.appendChild(button);
    });
}

// Selected emotion
let selectedEmotion = null;

// Select emotion
function selectEmotion(emotionKey) {
    selectedEmotion = emotionKey;

    // Update button states
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.emotion === emotionKey) {
            btn.classList.add('selected');
        }
    });

    // Show result
    showEmotionResult(emotionKey);
}

// Show emotion result
function showEmotionResult(emotionKey) {
    const emotion = cheerData.emotions[emotionKey];
    const resultContainer = document.getElementById('emotion-result');
    const resultIcon = document.getElementById('result-icon');
    const resultMessage = document.getElementById('result-message');

    resultIcon.textContent = emotion.icon;
    resultMessage.textContent = getRandomMessage(emotion.messages);

    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Tab navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        // Update button states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update content visibility
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// New cheer button (home tab)
document.getElementById('new-cheer-btn').addEventListener('click', () => {
    const cheerMessageEl = document.getElementById('cheer-message');
    cheerMessageEl.style.opacity = '0';
    setTimeout(() => {
        displayGeneralCheer();
        cheerMessageEl.style.opacity = '1';
    }, 300);
});

// Another cheer button (emotion tab)
document.getElementById('another-cheer-btn').addEventListener('click', () => {
    if (selectedEmotion) {
        const resultMessage = document.getElementById('result-message');
        resultMessage.style.opacity = '0';
        setTimeout(() => {
            const emotion = cheerData.emotions[selectedEmotion];
            resultMessage.textContent = getRandomMessage(emotion.messages);
            resultMessage.style.opacity = '1';
        }, 300);
    }
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

// Initialize app
loadCheerData();
