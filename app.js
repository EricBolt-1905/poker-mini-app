const tg = window.Telegram.WebApp;
tg.ready();

// Состояние
let state = {
    players: null,      // количество игроков
    position: null,     // выбранная позиция
    card1: { suit: null, rank: null },
    card2: { suit: null, rank: null }
};

const screens = {
    players: document.getElementById('screen-players'),
    position: document.getElementById('screen-position'),
    cards: document.getElementById('screen-cards'),
    result: document.getElementById('screen-result')
};

function showScreen(id) {
    Object.values(screens).forEach(el => el.classList.remove('active'));
    screens[id].classList.add('active');
}

// --- Экран выбора игроков ---
document.querySelectorAll('#screen-players .btn').forEach(btn => {
    btn.addEventListener('click', () => {
        state.players = parseInt(btn.dataset.players);
        buildPositionButtons();
        showScreen('position');
    });
});

// --- Экран выбора позиции ---
function buildPositionButtons() {
    const cont = document.getElementById('positions-container');
    cont.innerHTML = '';
    let positions;
    if (state.players === 2) {
        positions = ['BTN/SB','BB'];  // heads-up: кнопка/малый блайнд и большой
    } else if (state.players === 6) {
        positions = ['UTG','MP','CO','BTN','SB','BB'];
    } else if (state.players === 9) {
        positions = ['UTG','UTG+1','MP','HJ','CO','BTN','SB','BB'];
    }
    positions.forEach(pos => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = pos;
        btn.addEventListener('click', () => {
            state.position = pos;
            resetCardSelection();
            showScreen('cards');
        });
        cont.appendChild(btn);
    });
}

// --- Экран выбора карт ---
function resetCardSelection() {
    state.card1 = { suit: null, rank: null };
    state.card2 = { suit: null, rank: null };
    document.querySelectorAll('.suits button, .ranks button').forEach(b => b.classList.remove('selected'));
    document.getElementById('get-advice').disabled = true;
}

function attachCardListeners(cardNum) {
    const container = document.getElementById(`card${cardNum}`);
    const suits = container.querySelectorAll('.suits button');
    const ranks = container.querySelectorAll('.ranks button');

    suits.forEach(btn => {
        btn.addEventListener('click', () => {
            suits.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state[`card${cardNum}`].suit = btn.dataset.suit;
            checkCardsReady();
        });
    });

    ranks.forEach(btn => {
        btn.addEventListener('click', () => {
            ranks.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state[`card${cardNum}`].rank = btn.dataset.rank;
            checkCardsReady();
        });
    });
}

function checkCardsReady() {
    const c1 = state.card1.suit && state.card1.rank;
    const c2 = state.card2.suit && state.card2.rank;
    const btn = document.getElementById('get-advice');
    btn.disabled = !(c1 && c2);
}

attachCardListeners(1);
attachCardListeners(2);

// --- Обработка кнопки "Узнать действие" ---
document.getElementById('get-advice').addEventListener('click', () => {
    const hand = getHandNotation(state.card1, state.card2);
    const advice = getAdvice(state.players, state.position, hand);
    displayResult(advice);
});

function getHandNotation(c1, c2) {
    const r1 = c1.rank, s1 = c1.suit;
    const r2 = c2.rank, s2 = c2.suit;
    // Упорядочим ранги: старшая карта первая
    const ranksOrder = 'AKQJT98765432';
    const idx1 = ranksOrder.indexOf(r1);
    const idx2 = ranksOrder.indexOf(r2);
    let high, low, highSuit, lowSuit;
    if (idx1 < idx2) { // r1 старше
        high = r1; low = r2; highSuit = s1; lowSuit = s2;
    } else {
        high = r2; low = r1; highSuit = s2; lowSuit = s1;
    }
    if (r1 === r2) {
        return r1 + r2;  // пара
    } else if (s1 === s2) {
        return high + low + 's';
    } else {
        return high + low + 'o';
    }
}

function getAdvice(players, pos, hand) {
    // Если позиция BB, предположим, чек (или защита, упростим)
    if (pos === 'BB') return 'Check / Free play';
    // Для 2 игроков используем чарты BTN
    let chartKey = players;
    let posKey = pos;
    if (players === 2) {
        if (pos === 'BTN/SB') posKey = 'BTN'; // используем BTN чарты
        else return 'Check / Free play'; // BB
    }
    if (!CHARTS[chartKey] || !CHARTS[chartKey][posKey]) {
        return 'Данные не найдены';
    }
    const range = CHARTS[chartKey][posKey];
    // Некоторые руки записаны с "+", например "ATo+" – упростим, пока проверяем точное совпадение.
    // Для "+" надо раскрывать, но чтобы не усложнять, в наших чартах я старался избегать "+" в 6-max,
    // а в 9-max для простоты записал все комбинации явно. Оставим точное сравнение.
    if (range.includes(hand)) {
        return 'Raise';
    } else {
        return 'Fold';
    }
}

function displayResult(advice) {
    const div = document.getElementById('result-text');
    div.textContent = advice;
    // При желании можно отправить результат в бота
    // tg.sendData(advice); 
    showScreen('result');
}

// --- Кнопки "Назад" ---
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen('players');
    });
});

// Стартовый экран
showScreen('players');
