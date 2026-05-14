const quotes = [
    { text: "不論現在多辛苦，都要相信未來的你一定會感謝現在拼命的自己。", source: "網路語錄" },
    { text: "學習不是為了給別人看，而是為了給自己一個更寬廣的未來。", source: "《你的努力，要配得上你的野心》" },
    { text: "每一次的努力，都是在為未來的驚喜埋下伏筆。", source: "泰戈爾" },
    { text: "即使慢，也要走，只要不停下腳步，終會抵達目的地。", source: "荀子" },
    { text: "每一朵花都有自己的花期，你也一樣，請耐心等待綻放的那天。", source: "《不生氣的心》" },
    { text: "你的優秀，不需要別人來定義。", source: "艾瑪·華森" },
    { text: "夢想之所以偉大，是因為在追求的過程中，你變得更強大了。", source: "網路語錄" },
    { text: "現在的努力，是為了以後有更多的選擇權。", source: "龍應台" },
    { text: "所謂的天才，不過是把別人喝咖啡的時間都用在工作上。", source: "魯迅" },
    { text: "成功的秘訣在於永不改變既定的目標。", source: "盧梭" },
    { text: "不要讓昨天的淚水，打濕今天的陽光。", source: "網路語錄" },
    { text: "你要安靜的努力，然後驚艷所有人。", source: "網路語錄" },
    { text: "生活明朗，萬物可愛，人間值得，未來可期。", source: "汪曾祺" },
    { text: "星光不問趕路人，時光不負有心人。", source: "《不問》" },
    { text: "你若盛開，清風自來；你若努力，天自安排。", source: "穆斯塔法·凱末爾" }
];

function displayRandomQuote() {
    const quoteElement = document.getElementById('quote-text');
    const sourceElement = document.getElementById('quote-source');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Smooth transition
    const card = document.querySelector('.quote-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        quoteElement.textContent = randomQuote.text;
        sourceElement.textContent = `—— ${randomQuote.source}`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 300);
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayRandomQuote();

    // Click anywhere to change quote (except for the back link)
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            displayRandomQuote();
        }
    });
});
