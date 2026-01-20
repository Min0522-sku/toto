async function loadHTML(selector, url) {
    const container = document.querySelector(selector);
    if (!container) return; // 로드가 안됐다면 실패

    const response = await fetch(url); // html 가져옴
    const html = await response.text(); // html을 문자열로 바꿈
    container.innerHTML = html;   
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML("#header", "/html/common/header.html");
    loadHTML("#footer", "/html/common/footer.html");
});