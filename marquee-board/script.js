document.addEventListener('DOMContentLoaded', () => {
    const marqueeText = document.getElementById('marqueeText');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const contentInput = document.getElementById('contentInput');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Default content
    const defaultContent = '今日重點：AI 協作實務、Python 環境安裝、檔案自動化處理';

    // Load content from localStorage
    let savedContent = localStorage.getItem('marquee_content') || defaultContent;

    function updateMarquee(text) {
        // We repeat the text twice to create a seamless loop
        const content = `${text} &nbsp;&nbsp;&nbsp;&nbsp; ${text} &nbsp;&nbsp;&nbsp;&nbsp;`;
        marqueeText.innerHTML = content;
        
        // Adjust animation speed based on text length
        const charCount = text.length;
        const duration = Math.max(10, charCount * 0.5); // At least 10s
        marqueeText.style.animationDuration = `${duration}s`;
    }

    // Initialize
    updateMarquee(savedContent);

    // Open Modal
    settingsBtn.addEventListener('click', () => {
        contentInput.value = savedContent;
        settingsModal.classList.add('active');
    });

    // Close Modal
    cancelBtn.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    // Save content
    saveBtn.addEventListener('click', () => {
        const newContent = contentInput.value.trim();
        if (newContent) {
            savedContent = newContent;
            localStorage.setItem('marquee_content', savedContent);
            updateMarquee(savedContent);
            settingsModal.classList.remove('active');
        }
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
});
