/**
 * rock-paper-scissors/script.js
 * 遊戲邏輯與手勢辨識
 */

const videoElement = document.getElementById('video-element');
const canvasElement = document.getElementById('canvas-element');
const canvasCtx = canvasElement.getContext('2d');
const countdownOverlay = document.getElementById('countdown-overlay');
const statusDisplay = document.getElementById('status-display');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl = document.getElementById('ai-score');
const roundDisplay = document.getElementById('round-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

// 遊戲狀態
let gameState = {
    playerScore: 0,
    aiScore: 0,
    currentRound: 1,
    totalRounds: 5,
    isCountingDown: false,
    playerHistory: [],
    lastDetectedGesture: 'none'
};

// 手勢定義
const GESTURES = {
    ROCK: '石頭 ✊',
    PAPER: '布 ✋',
    SCISSORS: '剪刀 ✌️',
    NONE: '無 ❓'
};

/**
 * 初始化 MediaPipe Hands
 */
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

/**
 * 處理辨識結果
 */
function onResults(results) {
    // 繪製畫布
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // 繪製手部關鍵點
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#6366f1', lineWidth: 5});
        drawLandmarks(canvasCtx, landmarks, {color: '#ffffff', lineWidth: 2, radius: 3});
        
        // 辨識手勢
        gameState.lastDetectedGesture = classifyGesture(landmarks);
    } else {
        gameState.lastDetectedGesture = 'none';
    }
    canvasCtx.restore();
}

/**
 * 手勢分類邏輯
 */
function classifyGesture(landmarks) {
    // 判斷手指是否張開 (y 座標越小代表越高)
    const isFingerOpen = (tipIdx, pipIdx) => landmarks[tipIdx].y < landmarks[pipIdx].y;
    
    const thumbOpen = landmarks[4].x < landmarks[3].x; // 簡單判斷拇指
    const indexOpen = isFingerOpen(8, 6);
    const middleOpen = isFingerOpen(12, 10);
    const ringOpen = isFingerOpen(16, 14);
    const pinkyOpen = isFingerOpen(20, 18);

    // 剪刀：食指、中指張開
    if (indexOpen && middleOpen && !ringOpen && !pinkyOpen) return 'scissors';
    // 布：五指全張開 (或至少四指)
    if (indexOpen && middleOpen && ringOpen && pinkyOpen) return 'paper';
    // 石頭：五指全閉
    if (!indexOpen && !middleOpen && !ringOpen && !pinkyOpen) return 'rock';
    
    return 'none';
}

/**
 * 啟動相機
 */
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 640,
    height: 480
});
camera.start();

// 畫布尺寸同步
function resizeCanvas() {
    canvasElement.width = videoElement.clientWidth;
    canvasElement.height = videoElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
videoElement.addEventListener('loadedmetadata', resizeCanvas);

/**
 * 遊戲邏輯：開始回合
 */
async function startRound() {
    if (gameState.isCountingDown) return;
    if (gameState.playerScore >= 3 || gameState.aiScore >= 3) {
        statusDisplay.textContent = "遊戲已結束，請重置！";
        return;
    }

    gameState.isCountingDown = true;
    startBtn.disabled = true;
    countdownOverlay.classList.add('active');
    
    // 3, 2, 1 倒數
    for (let i = 3; i > 0; i--) {
        countdownOverlay.textContent = i;
        statusDisplay.textContent = `準備... ${i}`;
        await new Promise(r => setTimeout(r, 1000));
    }
    
    countdownOverlay.textContent = "GO!";
    await new Promise(r => setTimeout(r, 500));
    countdownOverlay.classList.remove('active');
    
    // 判定勝負
    judge();
}

/**
 * 判定勝負
 */
function judge() {
    const playerGesture = gameState.lastDetectedGesture;
    const aiGesture = getAiGesture();
    
    console.log(`Player: ${playerGesture}, AI: ${aiGesture}`);
    
    if (playerGesture === 'none') {
        statusDisplay.textContent = "未偵測到手勢！AI 獲勝";
        gameState.aiScore++;
    } else if (playerGesture === aiGesture) {
        statusDisplay.textContent = `平手！雙方都出 ${GESTURES[playerGesture.toUpperCase()]}`;
        // 平手不計分，回合數不增加
    } else {
        const winMap = { 'rock': 'scissors', 'paper': 'rock', 'scissors': 'paper' };
        if (winMap[playerGesture] === aiGesture) {
            statusDisplay.textContent = `你贏了！ ${GESTURES[playerGesture.toUpperCase()]} 勝 ${GESTURES[aiGesture.toUpperCase()]}`;
            gameState.playerScore++;
            gameState.playerHistory.push(playerGesture);
        } else {
            statusDisplay.textContent = `AI 贏了！ ${GESTURES[aiGesture.toUpperCase()]} 勝 ${GESTURES[playerGesture.toUpperCase()]}`;
            gameState.aiScore++;
            gameState.playerHistory.push(playerGesture);
        }
        gameState.currentRound++;
    }
    
    updateUI();
    gameState.isCountingDown = false;
    startBtn.disabled = false;
    
    checkGameOver();
}

/**
 * AI 策略：學習玩家模式
 */
function getAiGesture() {
    if (gameState.playerHistory.length < 2) {
        return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    }
    
    // 簡單頻率分析
    const counts = gameState.playerHistory.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, {});
    
    const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    
    // 反制玩家最常出的手勢
    const counterMap = { 'rock': 'paper', 'paper': 'scissors', 'scissors': 'rock' };
    
    // 70% 機率出反制，30% 隨機
    return Math.random() < 0.7 ? counterMap[mostFrequent] : ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
}

function updateUI() {
    playerScoreEl.textContent = gameState.playerScore;
    aiScoreEl.textContent = gameState.aiScore;
    roundDisplay.textContent = `第 ${gameState.currentRound} / ${gameState.totalRounds} 回合`;
}

function checkGameOver() {
    if (gameState.playerScore >= 3) {
        statusDisplay.textContent = "🎉 恭喜你獲得最終勝利！";
        startBtn.style.display = 'none';
    } else if (gameState.aiScore >= 3) {
        statusDisplay.textContent = "😢 很遺憾，AI 獲得最終勝利！";
        startBtn.style.display = 'none';
    } else if (gameState.currentRound > gameState.totalRounds) {
        statusDisplay.textContent = gameState.playerScore > gameState.aiScore ? "🎉 遊戲結束，你贏了！" : "🤝 遊戲結束，平手！";
        startBtn.style.display = 'none';
    }
}

function resetGame() {
    gameState = {
        playerScore: 0,
        aiScore: 0,
        currentRound: 1,
        totalRounds: 5,
        isCountingDown: false,
        playerHistory: [],
        lastDetectedGesture: 'none'
    };
    updateUI();
    statusDisplay.textContent = "等待開始...";
    startBtn.style.display = 'block';
    startBtn.disabled = false;
}

// 事件監聽
startBtn.addEventListener('click', startRound);
resetBtn.addEventListener('click', resetGame);

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        startRound();
    }
    if (e.code === 'KeyR') {
        resetGame();
    }
});
