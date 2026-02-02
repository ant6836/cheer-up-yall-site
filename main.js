// Global state
let cheerData = null;
let cheerDataKo = null;
let translations = null;
let currentLang = 'en';
let selectedEmotion = null;

// Load all data
async function loadAllData() {
    try {
        const [cheersResponse, cheersKoResponse, translationsResponse] = await Promise.all([
            fetch('data/cheers.json'),
            fetch('data/cheers-ko.json'),
            fetch('data/translations.json')
        ]);

        cheerData = await cheersResponse.json();
        cheerDataKo = await cheersKoResponse.json();
        translations = await translationsResponse.json();

        // Load saved language preference
        const savedLang = localStorage.getItem('language') || 'en';
        currentLang = savedLang;

        initializeApp();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback
        cheerData = {
            general: { messages: ["You're doing amazing! Keep going! 💪"] },
            emotions: {}
        };
        cheerDataKo = {
            general: { messages: ["정말 잘하고 있어요! 계속 가요! 💪"] },
            emotions: {}
        };
        initializeApp();
    }
}

// Initialize app after data is loaded
function initializeApp() {
    initializeEmotionButtons();
    displayGeneralCheer();
    applyLanguage(currentLang);
    updateLangButton();
}

// Get current cheer data based on language
function getCurrentCheerData() {
    return currentLang === 'ko' ? cheerDataKo : cheerData;
}

// Get random message from array
function getRandomMessage(messages) {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Display general cheer message on home tab
function displayGeneralCheer() {
    const cheerMessageEl = document.getElementById('cheer-message');
    const data = getCurrentCheerData();
    if (data && data.general) {
        cheerMessageEl.textContent = getRandomMessage(data.general.messages);
    }
}

// Initialize emotion buttons
function initializeEmotionButtons() {
    const emotionButtonsContainer = document.getElementById('emotion-buttons');
    const data = getCurrentCheerData();
    if (!data || !data.emotions) return;

    emotionButtonsContainer.innerHTML = '';

    Object.entries(data.emotions).forEach(([key, emotion]) => {
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

    // Re-select emotion if one was selected
    if (selectedEmotion) {
        const btn = document.querySelector(`.emotion-btn[data-emotion="${selectedEmotion}"]`);
        if (btn) {
            btn.classList.add('selected');
        }
    }
}

// Select emotion
function selectEmotion(emotionKey) {
    selectedEmotion = emotionKey;

    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.emotion === emotionKey) {
            btn.classList.add('selected');
        }
    });

    showEmotionResult(emotionKey);
}

// Show emotion result
function showEmotionResult(emotionKey) {
    const data = getCurrentCheerData();
    const emotion = data.emotions[emotionKey];
    const resultContainer = document.getElementById('emotion-result');
    const resultIcon = document.getElementById('result-icon');
    const resultMessage = document.getElementById('result-message');

    resultIcon.textContent = emotion.icon;
    resultMessage.textContent = getRandomMessage(emotion.messages);

    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Apply translations to page
function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    if (!translations) return;

    const t = translations[lang];
    if (!t) return;

    // Site title
    document.querySelector('.site-title').textContent = t.siteTitle;

    // Navigation
    document.querySelector('[data-tab="home"]').textContent = t.nav.home;
    document.querySelector('[data-tab="emotion"]').textContent = t.nav.emotion;
    document.querySelector('[data-tab="wellness"]').textContent = t.nav.wellness;
    document.querySelector('[data-tab="about"]').textContent = t.nav.about;
    document.querySelector('[data-tab="contact"]').textContent = t.nav.contact;

    // Theme toggle text
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelector('.theme-text').textContent = isDark ? t.theme.light : t.theme.dark;

    // Home tab
    document.querySelector('.quote-text').textContent = t.home.quote;
    document.querySelector('.quote-author').textContent = t.home.quoteAuthor;
    document.querySelector('.welcome-message h2').textContent = t.home.welcomeTitle;
    document.querySelector('.welcome-message p').textContent = t.home.welcomeText;
    document.querySelector('.daily-cheer h3').innerHTML = `✨ ${t.home.todaysCheer} ✨`;
    document.getElementById('new-cheer-btn').textContent = t.home.newCheerBtn;
    document.querySelector('.features-preview h3').textContent = t.home.whatWeOffer;

    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards[0]) {
        featureCards[0].querySelector('h4').textContent = t.home.feature1Title;
        featureCards[0].querySelector('p').textContent = t.home.feature1Text;
    }
    if (featureCards[1]) {
        featureCards[1].querySelector('h4').textContent = t.home.feature2Title;
        featureCards[1].querySelector('p').textContent = t.home.feature2Text;
    }
    if (featureCards[2]) {
        featureCards[2].querySelector('h4').textContent = t.home.feature3Title;
        featureCards[2].querySelector('p').textContent = t.home.feature3Text;
    }

    // Emotion tab
    document.querySelector('.emotion-section h2').textContent = t.emotion.title;
    document.querySelector('.emotion-section .section-description').textContent = t.emotion.description;
    document.querySelector('.emotion-selector > label').textContent = t.emotion.howFeeling;
    document.getElementById('another-cheer-btn').textContent = t.emotion.anotherCheer;
    document.querySelector('.emotion-info h3').textContent = t.emotion.whyMattersTitle;
    document.querySelector('.emotion-info p').textContent = t.emotion.whyMattersText;

    // About tab
    document.querySelector('.about-section h2').textContent = t.about.title;
    const aboutBlocks = document.querySelectorAll('.about-block');
    if (aboutBlocks[0]) {
        aboutBlocks[0].querySelector('h3').innerHTML = `🌟 ${t.about.missionTitle}`;
        aboutBlocks[0].querySelector('p').textContent = t.about.missionText;
    }
    if (aboutBlocks[1]) {
        aboutBlocks[1].querySelector('h3').innerHTML = `💡 ${t.about.differentTitle}`;
        aboutBlocks[1].querySelector('p').textContent = t.about.differentText;
    }
    if (aboutBlocks[2]) {
        aboutBlocks[2].querySelector('h3').innerHTML = `🎯 ${t.about.howToTitle}`;
        const listItems = aboutBlocks[2].querySelectorAll('li');
        if (listItems[0]) listItems[0].innerHTML = `<strong>${t.about.howTo1}</strong> ${t.about.howTo1Text}`;
        if (listItems[1]) listItems[1].innerHTML = `<strong>${t.about.howTo2}</strong> ${t.about.howTo2Text}`;
        if (listItems[2]) listItems[2].innerHTML = `<strong>${t.about.howTo3}</strong> ${t.about.howTo3Text}`;
        if (listItems[3]) listItems[3].innerHTML = `<strong>${t.about.howTo4}</strong> ${t.about.howTo4Text}`;
    }
    if (aboutBlocks[3]) {
        aboutBlocks[3].querySelector('h3').innerHTML = `❤️ ${t.about.promiseTitle}`;
        aboutBlocks[3].querySelector('p').textContent = t.about.promiseText;
    }
    if (aboutBlocks[4]) {
        aboutBlocks[4].querySelector('h3').innerHTML = `📊 ${t.about.contentTitle}`;
        const statLabels = aboutBlocks[4].querySelectorAll('.stat-label');
        if (statLabels[0]) statLabels[0].textContent = t.about.stat1;
        if (statLabels[1]) statLabels[1].textContent = t.about.stat2;
        if (statLabels[2]) statLabels[2].textContent = t.about.stat3;
        if (statLabels[3]) statLabels[3].textContent = t.about.stat4;
    }

    // Contact tab
    document.querySelector('.contact-section h2').textContent = t.contact.title;
    document.querySelector('.contact-section .section-description').textContent = t.contact.description;
    document.querySelector('label[for="name"]').textContent = t.contact.nameLabel;
    document.getElementById('name').placeholder = t.contact.namePlaceholder;
    document.querySelector('label[for="email"]').textContent = t.contact.emailLabel;
    document.getElementById('email').placeholder = t.contact.emailPlaceholder;
    document.querySelector('label[for="subject"]').textContent = t.contact.subjectLabel;
    const subjectSelect = document.getElementById('subject');
    subjectSelect.options[0].textContent = t.contact.subjectPlaceholder;
    subjectSelect.options[1].textContent = t.contact.subjectFeedback;
    subjectSelect.options[2].textContent = t.contact.subjectSuggestion;
    subjectSelect.options[3].textContent = t.contact.subjectBug;
    subjectSelect.options[4].textContent = t.contact.subjectPartnership;
    subjectSelect.options[5].textContent = t.contact.subjectOther;
    document.querySelector('label[for="message"]').textContent = t.contact.messageLabel;
    document.getElementById('message').placeholder = t.contact.messagePlaceholder;
    document.querySelector('.btn-submit').textContent = t.contact.submitBtn;
    document.querySelector('.contact-info-card h3').innerHTML = `💬 ${t.contact.valueTitle}`;
    document.querySelector('.contact-info-card p').textContent = t.contact.valueText;

    // Footer
    document.querySelector('.footer-tagline').textContent = t.footer.tagline;
    document.querySelector('.footer-copyright').innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${t.footer.copyright}`;
    const footerLinks = document.querySelectorAll('.footer-links a');
    if (footerLinks[0]) footerLinks[0].textContent = t.footer.privacy;
    if (footerLinks[1]) footerLinks[1].textContent = t.footer.terms;

    // Update Wellness section
    updateWellnessSection(t);

    // Reinitialize emotion buttons with new language
    initializeEmotionButtons();

    // Update displayed cheer message
    displayGeneralCheer();

    // Update emotion result if visible
    if (selectedEmotion) {
        const resultContainer = document.getElementById('emotion-result');
        if (!resultContainer.classList.contains('hidden')) {
            showEmotionResult(selectedEmotion);
        }
    }
}

// Update Wellness section translations
function updateWellnessSection(t) {
    document.querySelector('.wellness-section h2').textContent = t.wellness.title;
    document.querySelector('.wellness-section .section-description').textContent = t.wellness.description;

    const wellnessCards = document.querySelectorAll('.wellness-card');
    const emotions = ['sad', 'anxious', 'tired', 'angry', 'lonely', 'stressed', 'unmotivated', 'happy', 'grateful'];

    wellnessCards.forEach((card, index) => {
        const emotion = emotions[index];
        if (!emotion) return;

        const header = card.querySelector('.wellness-card-header h3');
        const intro = card.querySelector('.wellness-card-content > p:first-child');
        const h4 = card.querySelector('h4');
        const tips = card.querySelectorAll('li');
        const note = card.querySelector('.wellness-note');

        if (header) header.textContent = t.wellness[`${emotion}Title`];
        if (intro) intro.textContent = t.wellness[`${emotion}Intro`];

        if (h4) {
            if (emotion === 'happy') {
                h4.textContent = t.wellness.strategiesTo;
            } else if (emotion === 'grateful') {
                h4.textContent = t.wellness.gratitudePractices;
            } else {
                h4.textContent = t.wellness.copingStrategies;
            }
        }

        tips.forEach((tip, tipIndex) => {
            const tipNum = tipIndex + 1;
            const tipKey = `${emotion}Tip${tipNum}`;
            const tipTextKey = `${emotion}Tip${tipNum}Text`;
            if (t.wellness[tipKey] && t.wellness[tipTextKey]) {
                tip.innerHTML = `<strong>${t.wellness[tipKey]}</strong> ${t.wellness[tipTextKey]}`;
            }
        });

        if (note) note.textContent = t.wellness[`${emotion}Note`];
    });
}

// Update language toggle button
function updateLangButton() {
    const langText = document.querySelector('.lang-text');
    if (currentLang === 'en') {
        langText.textContent = '한국어';
    } else {
        langText.textContent = 'English';
    }
}

// Tab navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

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
            const data = getCurrentCheerData();
            const emotion = data.emotions[selectedEmotion];
            resultMessage.textContent = getRandomMessage(emotion.messages);
            resultMessage.style.opacity = '1';
        }, 300);
    }
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeText = themeToggle.querySelector('.theme-text');
const body = document.body;

function updateThemeButton(isDark) {
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    if (translations && translations[currentLang]) {
        themeText.textContent = isDark ? translations[currentLang].theme.light : translations[currentLang].theme.dark;
    } else {
        themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
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

// Language toggle
const langToggle = document.getElementById('lang-toggle');

langToggle.addEventListener('click', () => {
    const newLang = currentLang === 'en' ? 'ko' : 'en';
    currentLang = newLang;
    localStorage.setItem('language', newLang);
    applyLanguage(newLang);
    updateLangButton();
});

// Dynamic year in footer
function updateYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Initialize app
loadAllData();
