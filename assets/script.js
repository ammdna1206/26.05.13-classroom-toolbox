// Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('教學工具箱已就緒');
    
    const shareBtn = document.getElementById('share-btn');
    const toast = document.getElementById('toast');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
                showToast();
            } catch (err) {
                console.error('無法複製連結:', err);
                // 備案：手動複製
                const textArea = document.createElement("textarea");
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast();
                } catch (copyErr) {
                    alert('請手動複製網址分享：' + url);
                }
                document.body.removeChild(textArea);
            }
        });
    }

    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
