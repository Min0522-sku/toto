// header와 footer를 각 div에 print

async function loadHTML(selector, url) {
    const container = document.querySelector(selector);
    if (!container) return; // 로드가 안됐다면 실패

    const response = await fetch(url); // html 가져옴
    const html = await response.text(); // html을 문자열로 바꿈
    container.innerHTML = html;   
}

document.addEventListener("DOMContentLoaded", async() => {
    await loadHTML("#header", "/html/common/header.html");
    await loadHTML("#footer", "/html/common/footer.html");

    let userName = JSON.parse(localStorage.getItem("me")).name || "홍길동";
    document.querySelector(".meta-name").innerHTML = `${userName} 님 환영합니다.`;
});

// 사용자의 이름과 자본금을 헤더에 print

// 예상 승률 계산 함수 (홈 공격력, 홈 수비력, 원정 공격력, 원정 수비력)
function getWinrate(home_offense, home_defense, away_offense, away_defense){
    let diff = (home_offense - away_defense) + (home_defense - away_offense);
    let home_adventage = 0.05; // 홈 어드벤티지 값 (수정 가능)
    let responsiveness = 0.005; // 민감도 (수정 가능) (diff가 20이면 +0.1 ; 이 값이 커지면 공격력/수비력 차에 따른 승률이 급격히 차이남)

    let home_win_prob = 0.5 + diff * responsiveness + home_adventage; 

    // 승률을 5% ~ 95% 사이로 고정
    if(home_win_prob < 0.05) home_win_prob = 0.05;
    else if(home_win_prob > 0.95) home_win_prob = 0.95;

    return home_win_prob;
}

// id로 배열 속 객체 찾는 함수 (array : 찾을 객체가 속한 배열, id : 그 객체에서 찾을 아이디)
function getObjById(array, id){
    for(let i = 0; i < array.length; i++){
        if(array[i].id == id){
            return array[i];
        }
    }
    return null;
}