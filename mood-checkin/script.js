const moodButtons = document.querySelectorAll('.mood-btn');
const feedbackArea = document.getElementById('feedback-area');
const encouragementMsg = document.getElementById('encouragement-msg');
const resetBtn = document.getElementById('reset-btn');
const moodSelector = document.querySelector('.mood-selector');
const subtitle = document.querySelector('.subtitle');

const messages = {
    happy: "太棒了！保持這份好心情，讓今天充滿陽光！✨",
    neutral: "平靜也是一種力量。深呼吸，今天也會是穩定發揮的一天！🌱",
    sad: "沒關係的，給自己一個擁抱。明天一定會更好的，加油！💪"
};

// Audio Context for sound effect
let audioCtx;

async function playMoodSound(mood) {
    console.log('Attempting to play sound for mood:', mood);
    
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Standard timing offset for smoother playback
        const startTime = audioCtx.currentTime + 0.05;
        oscillator.type = 'sine';

        switch (mood) {
            case 'happy':
                oscillator.frequency.setValueAtTime(523.25, startTime); // C5
                oscillator.frequency.linearRampToValueAtTime(880, startTime + 0.2); // A5
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.linearRampToValueAtTime(0, startTime + 0.4);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.4);
                break;
            case 'neutral':
                oscillator.frequency.setValueAtTime(440, startTime); // A4
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.linearRampToValueAtTime(0, startTime + 0.3);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
                break;
            case 'sad':
                oscillator.frequency.setValueAtTime(330, startTime); // E4
                oscillator.frequency.linearRampToValueAtTime(165, startTime + 0.5); // E3
                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.linearRampToValueAtTime(0, startTime + 0.6);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.6);
                break;
            default:
                oscillator.frequency.setValueAtTime(440, startTime);
                gainNode.gain.setValueAtTime(0.1, startTime);
                gainNode.gain.linearRampToValueAtTime(0, startTime + 0.1);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.1);
                break;
        }
    } catch (e) {
        console.error('Error playing sound:', e);
    }
}

moodButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const mood = button.getAttribute('data-mood');
        
        // Play mood-specific sound
        await playMoodSound(mood);

        // Show feedback
        encouragementMsg.textContent = messages[mood];
        feedbackArea.classList.remove('hidden');
        
        // Hide selector
        moodSelector.style.display = 'none';
        subtitle.style.display = 'none';
        
        button.style.transform = 'scale(1.2)';
    });
});

resetBtn.addEventListener('click', async () => {
    await playMoodSound('reset'); // Use default sound
    feedbackArea.classList.add('hidden');
    moodSelector.style.display = 'flex';
    subtitle.style.display = 'block';
    
    // Reset buttons scale
    moodButtons.forEach(btn => btn.style.transform = '');
});
