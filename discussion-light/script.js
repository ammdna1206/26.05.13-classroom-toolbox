document.addEventListener('DOMContentLoaded', () => {
    const statusLight = document.getElementById('status-light');
    const statusText = document.getElementById('status-text');
    const buttons = document.querySelectorAll('.control-btn');

    const states = {
        green: {
            text: '請保持討論',
            class: 'green'
        },
        yellow: {
            text: '注意音量',
            class: 'yellow'
        },
        red: {
            text: '請安靜',
            class: 'red'
        }
    };

    function updateState(stateKey) {
        const state = states[stateKey];
        if (!state) return;

        // Update classes
        statusLight.classList.remove('green', 'yellow', 'red');
        statusLight.classList.add(state.class);

        // Update text with a small fade animation
        statusText.style.opacity = '0';
        setTimeout(() => {
            statusText.textContent = state.text;
            statusText.style.opacity = '1';
        }, 200);

        // Update active button
        buttons.forEach(btn => {
            if (btn.dataset.state === stateKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const stateKey = btn.dataset.state;
            updateState(stateKey);
        });
    });
});
