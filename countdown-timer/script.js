const setupView = document.getElementById('setup-view');
const timerView = document.getElementById('timer-view');
const alarmView = document.getElementById('alarm-view');
const timerDisplay = document.getElementById('timer-display');
const minutesInput = document.getElementById('minutes-input');
const startBtn = document.getElementById('start-btn');
const app = document.getElementById('app');

let countdownInterval;
let remainingSeconds = 0;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playAlarmSound() {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const duration = 0.5;
    const interval = 1.0;

    function beep() {
        if (!alarmView.classList.contains('active')) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);

        setTimeout(beep, interval * 1000);
    }

    beep();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function switchView(viewId) {
    [setupView, timerView, alarmView].forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
    
    // Manage flashing class on app container
    if (viewId === 'alarm-view') {
        app.classList.add('flashing');
        playAlarmSound();
    } else {
        app.classList.remove('flashing');
    }
}

function startTimer() {
    initAudio(); // Initialize on user click
    const minutes = parseInt(minutesInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        alert('請輸入有效的分鐘數');
        return;
    }

    remainingSeconds = minutes * 60;
    timerDisplay.textContent = formatTime(remainingSeconds);
    switchView('timer-view');

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        remainingSeconds--;
        timerDisplay.textContent = formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
            stopTimer();
            switchView('alarm-view');
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownInterval);
}

function reset() {
    stopTimer();
    switchView('setup-view');
}

startBtn.addEventListener('click', startTimer);

// Click anywhere to reset when in timer or alarm view
app.addEventListener('click', (e) => {
    if (timerView.classList.contains('active') || alarmView.classList.contains('active')) {
        // Prevent reset if clicking a button (though there aren't any in these views yet)
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            reset();
        }
    }
});

// Allow Enter key to start timer
minutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startTimer();
    }
});
