const matchData = {
    homeTeam: { name: "맨체스터 유나이티드", score: 0 },
    awayTeam: { name: "맨체스터 시티", score: 0 },
    events: [
        { time: 8, team: "home", type: "GOAL", msg: "맨유의 선제골!" },
        { time: 20, team: "away", type: "GOAL", msg: "맨시티의 동점골!" },
        { time: 31, team: "home", type: "SAVE", msg: "맨유 키퍼의 선방!" },
        { time: 42, team: "home", type: "GOAL", msg: "맨유의 쐐기골!" },
        { time: 55, team: "home", type: "SAVE", msg: "맨유 키퍼의 선방!" },
        { time: 67, team: "home", type: "GOAL", msg: "맨유의 쐐기골!" }, 
        { time: 72, team: "home", type: "SAVE", msg: "맨유 키퍼의 선방!" },
        { time: 88, team: "home", type: "GOAL", msg: "맨유의 쐐기골!" }  
    ]
};

let currentTime = 0;
const totalTime = 90; // 실제로는 90초 (1초 = 1분)

function startSimulation() {
    const timerElement = document.querySelector("#time p");
    const logTable = document.querySelector("#matchLog table tbody") || document.querySelector("#matchLog table"); 

    const interval = setInterval(() => {
        currentTime++;
        
        // [수정된 부분] 1. 타이머 업데이트 (난수 초 적용)
        // 0부터 59 사이의 랜덤한 정수 생성
        const randomSeconds = Math.floor(Math.random() * 60);
        
        // 00 : 분 : 랜덤초 형식으로 조합
        const displayTime = `00 : ${String(currentTime).padStart(2, '0')} : ${String(randomSeconds).padStart(2, '0')}`;
        timerElement.innerText = displayTime;

        // 2. 이벤트 발생 체크 (이벤트는 '분' 기준이므로 그대로 currentTime 사용)
        const currentEvent = matchData.events.find(e => e.time === currentTime);

        if (currentEvent) {
            // 2-1. 로그 추가
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>00:${String(currentEvent.time).padStart(2, '0')}:00</td>
                <td class="team">${currentEvent.team === "home" ? matchData.homeTeam.name : matchData.awayTeam.name}</td>
                <td>${currentEvent.type === "GOAL" ? "득점" : "선방"}</td>
            `;
            logTable.appendChild(newRow);
            const logContainer = document.querySelector("#matchLog");

            // 2-2. 득점 시 점수판 업데이트
            if (currentEvent.type === "GOAL") {
                updateScore(currentEvent.team);
            }
        }

        // 3. 경기 종료 체크
        if (currentTime >= totalTime) {
            clearInterval(interval);
            
            // [추가 팁] 경기가 끝나면 초 단위를 00으로 깔끔하게 맞추거나 '종료' 표시
            timerElement.innerText = `00 : 90 : 00`; 
            
            setTimeout(showMatchResult, 1000); 
        }
    }, 1000); // 1초마다 실행
}

// 누락되었던 점수 업데이트 함수
function updateScore(team) {
    // 1. 데이터 상의 점수 올리기
    if (team === "home") matchData.homeTeam.score++;
    else matchData.awayTeam.score++;

    // 2. (선택사항) 만약 상단에 점수판(1:1 같은거)이 있다면 여기서 innerText를 바꿔줘야 함
    // console.log(`현재 스코어 - 홈: ${matchData.homeTeam.score}, 원정: ${matchData.awayTeam.score}`);
}

function showMatchResult() {
    const resultDiv = document.querySelector("#matchResult");
    const resultText = document.querySelector("#resultText p");
    
    // 1. 결과창 보이기
    resultDiv.style.display = "flex";
    
    // 2. 최종 스코어 반영
    resultText.innerText = `${matchData.homeTeam.score} : ${matchData.awayTeam.score}`;
    
    // 3. 스크롤을 맨 아래로 내려서 결과 보여주기
    resultDiv.scrollIntoView({ behavior: 'smooth' });

    // 4. 정산 함수 호출 (아직 안 짰으면 주석 처리)
    // calculateBetting(); 
}

// 시뮬레이션 시작!
startSimulation();