import db from './common/database.js'; 

// ============================================================
// [1] DB(로컬스토리지)에서 데이터 조회
// ============================================================
const userLogs = JSON.parse(localStorage.getItem("userLog")) || [];
const matches = JSON.parse(localStorage.getItem("match")) || db.match; 
const teams = JSON.parse(localStorage.getItem("team")) || db.team;     
const users = JSON.parse(localStorage.getItem("user")) || db.user;

const me = JSON.parse(localStorage.getItem("me"));
const currentUserId = me ? me.id : 1;
// 내 최신 배팅 내역 가져오기
let myLogs = [];
// 1. userLogs 전체를 돌면서 내 아이디랑 같은 것만 myLogs에 담기
for (let i = 0; i < userLogs.length; i++) {
    if (userLogs[i].user_id === currentUserId) {
        myLogs.push(userLogs[i]);
    }
}

// 2. 담긴 게 있으면 맨 마지막꺼 가져오기
let currentBetLog = null;
if (myLogs.length > 0) {
    currentBetLog = myLogs[myLogs.length - 1];
    
    // [수정 2] ★ 친구 데이터 번역기 (Parsing) ★
    // 친구가 "HOME승: 1.55"로 저장한 걸 내 코드("home")에 맞게 변환
    
    // 1. 변수명 통일 (친구: betContent, 나: bet_content)
    let rawContent = currentBetLog.betContent || currentBetLog.bet_content;
    let fixedContent = rawContent;
    let extractedOdds = 1.0;

    // 2. 승무패(1번)일 때 텍스트 변환 & 배당률 추출
    if (currentBetLog.bet_id == 1) { // 문자열일 수도 있어서 == 사용
        if (rawContent.includes("HOME")) fixedContent = "home";
        else if (rawContent.includes("AWAY")) fixedContent = "away";
        else if (rawContent.includes("무승부")) fixedContent = "draw";

        // 배당률 숫자 뽑기 (예: "HOME승: 1.55" -> 1.55)
        if (rawContent.includes(":")) {
            let parts = rawContent.split(":");
            extractedOdds = parseFloat(parts[1].trim());
        }
    }
    
    // 변환된 값을 내 로직이 사용하는 변수에 넣어줌
    currentBetLog.bet_content = fixedContent; 
    currentBetLog.odds = extractedOdds;
    
    console.log("번역된 배팅 정보:", currentBetLog);
}
// ★ 테스트 데이터 생성 (bet_content 추가)
let currentUser = null;
if (!currentBetLog) {
    console.warn("⚠️ 배팅 내역이 없어 테스트 모드로 실행합니다.");
    currentBetLog = { 
        id: 999, user_id: 1, match_id: 16, 
        bet_id: 1,          // 1: 승무패, 2: 선제골, 3: 스코어
        bet_content: "home", // "home"/"draw"/"away" or "3:1"
        betAmount: 50000, odds: 1.8, isSuccess: null 
    };
    currentUser = { id: 1, name: "박지훈", money: 100000 };
} else {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === currentBetLog.user_id) {
            currentUser = users[i];
            break; // 찾았으면 반복문 종료
        }
    }
}

// 경기 정보 찾기
let targetMatch = null;
// 1. 로컬스토리지 matches에서 찾기
for (let i = 0; i < matches.length; i++) {
    if (matches[i].id === currentBetLog.match_id) {
        targetMatch = matches[i];
        break;
    }
}

let matchInfo = targetMatch;
// 2. 만약 없으면 db.match(원본)에서 찾기
if (!matchInfo) {
    for (let i = 0; i < db.match.length; i++) {
        if (db.match[i].id === currentBetLog.match_id) {
            matchInfo = db.match[i];
            break;
        }
    }
}

// ------------------------------------------------------------
//  팀 정보 찾기
// ------------------------------------------------------------
let homeTeam = null;
let awayTeam = null;

for (let i = 0; i < teams.length; i++) {
    // 홈팀 찾기
    if (teams[i].id === matchInfo.home_team_id) {
        homeTeam = teams[i];
    }
    // 원정팀 찾기
    if (teams[i].id === matchInfo.away_team_id) {
        awayTeam = teams[i];
    }
}

// ============================================================
// [2] 시뮬레이션 상태 변수
// ============================================================
let currentTime = 0;
const totalTime = 90; 
let currentScore = { home: 0, away: 0 };
let firstGoalTeam = null; // "home", "away", or null
let gameLogBuffer = [];
// ============================================================
// [3] 화면 초기화
// ============================================================
function initGameInfo() {
    // 홈팀
    document.querySelector("#homeTeamName").innerText = homeTeam.name;
    document.querySelector("#homeTeamLogo").src = homeTeam.imageUrl;
    document.querySelector("#homeTeamStats").innerHTML = `
        <tr>
            <td>${homeTeam.leagueRank}위</td> 
            <td>${homeTeam.wins}승</td>
            <td>${homeTeam.draws}무</td>
            <td>${homeTeam.losses}패</td>
            <td>${homeTeam.avgScored}</td>
            <td>${homeTeam.avgConceded}</td>
        </tr>`;

    // 원정팀
    document.querySelector("#awayTeamName").innerText = awayTeam.name;
    document.querySelector("#awayTeamLogo").src = awayTeam.imageUrl;
    document.querySelector("#awayTeamStats").innerHTML = `
        <tr>
            <td>${awayTeam.leagueRank}위</td> 
            <td>${awayTeam.wins}승</td>
            <td>${awayTeam.draws}무</td>
            <td>${awayTeam.losses}패</td>
            <td>${awayTeam.avgScored}</td>
            <td>${awayTeam.avgConceded}</td>
        </tr>`;

    // 결과창 로고
    document.querySelector("#resultHomeLogo").src = homeTeam.imageUrl;
    document.querySelector("#resultAwayLogo").src = awayTeam.imageUrl;
}

// ============================================================
// [4] 엔진
// ============================================================
function generateEvent() {
    if (Math.random() > 0.12) return null;

    const homePower = (homeTeam.offense * 0.6) + (homeTeam.defense * 0.4) + (Math.random() * 30);
    const awayPower = (awayTeam.offense * 0.6) + (awayTeam.defense * 0.4) + (Math.random() * 30);
    const attacker = homePower > awayPower ? homeTeam : awayTeam;  
    const defender = homePower > awayPower ? awayTeam : homeTeam;
    const teamType = homePower > awayPower ? "home" : "away";

    if (Math.random() > 0.2 + (attacker.offense / 100 * 0.4)) return null;

    const goalProb = attacker.offense / (attacker.offense + defender.defense);
    
    if (Math.random() < goalProb) {
        return { type: "GOAL", team: teamType };
    } else {
        return { type: "SAVE", team: teamType === "home" ? "away" : "home" };
    }
}

// ============================================================
// [5] 시뮬레이션 실행
// ============================================================
function startSimulation() {
    initGameInfo();

    const timerElement = document.querySelector("#time p");
    const logTable = document.querySelector("#logList");

    const interval = setInterval(() => {
        currentTime++;
        const randomSeconds = Math.floor(Math.random() * 60);
        timerElement.innerText = `${String(currentTime).padStart(2, '0')} : ${String(randomSeconds).padStart(2, '0')}`;

        const currentEvent = generateEvent();

        if (currentEvent) {
            if (currentEvent.type === "GOAL") {
                if (currentEvent.team === "home") currentScore.home++;
                else currentScore.away++;
                if (firstGoalTeam === null) firstGoalTeam = currentEvent.team;
                document.querySelector("#realTimeScore").innerText = `${currentScore.home} : ${currentScore.away}`;
            }

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${String(currentTime).padStart(2, '0')} : ${String(randomSeconds).padStart(2, '0')}</td>
                <td class="team">${currentEvent.team === "home" ? homeTeam.name : awayTeam.name}</td>
                <td>${currentEvent.type === "GOAL" ? "득점" : "선방"}</td>
            `;
            logTable.appendChild(newRow);
            
            gameLogBuffer.push({
                match_id: targetMatch.id,
                time: String(currentTime).padStart(2, '0') + " : " + String(randomSeconds).padStart(2, '0'),
                team_name: currentEvent.team === "home" ? homeTeam.name : awayTeam.name,
                event_type: currentEvent.type, // "GOAL" or "SAVE"
                description: currentEvent.type === "GOAL" ? "득점" : "선방" 
            });

            document.querySelector("#matchLog").scrollTop = document.querySelector("#matchLog").scrollHeight;
        }

        if (currentTime >= totalTime) {
            clearInterval(interval);
            timerElement.innerText = `90 : 00`; 
            setTimeout(() => {
                calculateAndSaveResult(); // 결과 계산
                showMatchResult();        // 화면 표시
            }, 1000); 
        }
    }, 100); // 0.1초 단위
}

// ============================================================
// [6] ★ 결과 정산 
// ============================================================
let finalProfit = 0; 

function calculateAndSaveResult() {
    // 1. 경기 결과 승패 판별
    let actualWinner = "draw"; 
    if (currentScore.home > currentScore.away) actualWinner = "home";
    else if (currentScore.home < currentScore.away) actualWinner = "away";

    const actualScoreString = `${currentScore.home}:${currentScore.away}`;
    
    // 2. 배팅 성공 여부 판별
    let isSuccess = false;
    const betId = Number(currentBetLog.bet_id);
    const userPick = currentBetLog.bet_content; 

    // 배팅 타입별 조건
    if (betId === 1) {
        isSuccess = (userPick === actualWinner);
    } 
    else if (betId === 2) {
        isSuccess = (firstGoalTeam && userPick === firstGoalTeam);
    } 
    else if (betId === 3) {
        isSuccess = (userPick === actualScoreString);
    }

    // 3. 돈 계산
    let odds = currentBetLog.odds || 1.0; 
    if (betId === 2) {
        odds = 10.0;
    } else if (betId === 3) {
        odds = 20.0;
    }

    const payout = isSuccess ? Math.floor(currentBetLog.betAmount * odds) : 0;
    
    finalProfit = isSuccess ? payout : 0;

    // 4. [날짜 생성] 오늘 날짜 구하기 (YYYY-MM-DD 형식)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작이라 +1
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`; // 예: "2026-01-21"

    // 5. DB 업데이트 (메모리)

    // (1) 매치 정보 업데이트 (결과, 상태, 날짜 추가)
    if (targetMatch) {
        targetMatch.status = "경기 종료";
        targetMatch.result = actualScoreString;
        targetMatch.match_date = todayDate; // 경기 치른 날짜 저장
    }

    // (2) 배팅 로그 업데이트
    if (currentBetLog) {
        currentBetLog.isSuccess = isSuccess;
        currentBetLog.payout = payout;
    }

    // (3) 유저 돈 업데이트
    if (currentUser && isSuccess) {
        currentUser.money += payout;
    }

    // 6. DB 저장 (로컬스토리지 Commit)
    if (userLogs.length > 0) {
        localStorage.setItem("match", JSON.stringify(matches));
        localStorage.setItem("userLog", JSON.stringify(userLogs));
        localStorage.setItem("user", JSON.stringify(users));
        console.log(currentUser);
        localStorage.setItem("me", JSON.stringify(currentUser) );

        const existingLogs = JSON.parse(localStorage.getItem("log")) || [];
        
        // gameLogBuffer(이번 경기 로그들)를 하나씩 꺼내서 기존 로그에 추가
        for (let i = 0; i < gameLogBuffer.length; i++) {
            existingLogs.push(gameLogBuffer[i]);
        }

        // 합쳐진 로그 저장
        localStorage.setItem("log", JSON.stringify(existingLogs));

        console.log(`✅ 정산 완료. 날짜: ${todayDate}, 로그 ${gameLogBuffer.length}개 저장됨.`);
    }
}

// ============================================================
// [7] 결과 화면 표시
// ============================================================
function showMatchResult() {
    const resultDiv = document.querySelector("#matchResult");
    const resultText = document.querySelector("#resultText p");
    const resultTableBody = document.querySelector("#resultTableBody");
    
    resultDiv.style.display = "flex";
    resultText.innerText = `${currentScore.home} : ${currentScore.away}`;

    // 승패 판별
    let actualWinner = "draw"; 
    if (currentScore.home > currentScore.away) actualWinner = "home";
    else if (currentScore.home < currentScore.away) actualWinner = "away";

    // 결과 텍스트 HTML
    let resultRowHtml = "";
    if (actualWinner === "draw") {
        resultRowHtml = `<td colspan="2" class="text-center draw-text">무승부</td>`;
    } else {
        const winnerName = actualWinner === "home" ? homeTeam.name : awayTeam.name;
        const loserName = actualWinner === "home" ? awayTeam.name : homeTeam.name;
        resultRowHtml = `
            <td class="text-center"><span class="winner-text">승: ${winnerName}</span></td>
            <td class="text-center"><span class="loser-text">패: ${loserName}</span></td>
        `;
    }

    // 선제골 팀 이름
    let firstGoalName = "-";
    if (firstGoalTeam === "home") firstGoalName = homeTeam.name;
    else if (firstGoalTeam === "away") firstGoalName = awayTeam.name;

    // 배팅 내용 표시 텍스트 만들기
    const betId = Number(currentBetLog.bet_id);
    const userPick = currentBetLog.bet_content;
    let betDisplayCheck = "";

    if (betId === 1) {
        if(userPick === 'home') betDisplayCheck = '승무패 (홈팀 승)';
        else if(userPick === 'away') betDisplayCheck = '승무패 (원정 승)';
        else betDisplayCheck = '승무패 (무승부)';
    } 
    else if (betId === 2) {
        if(userPick === 'home') betDisplayCheck = '선제골 (홈팀)';
        else betDisplayCheck = '선제골 (원정팀)';
    } 
    else if (betId === 3) {
        betDisplayCheck = `스코어 (${userPick})`;
    }

    // 금액 및 스타일
    const isSuccess = currentBetLog.isSuccess; // 위에서 계산됨
    const displayAmount = isSuccess ? Math.floor(currentBetLog.betAmount * currentBetLog.odds) : -currentBetLog.betAmount;
    const profitClass = isSuccess ? "profit-win" : "profit-lose";
    const profitSign = isSuccess ? "+" : "";

    resultTableBody.innerHTML = `
        <tr>
            <td width="20%">경기 결과</td>
            ${resultRowHtml}
        </tr>
        <tr>
            <td>선제골</td>
            <td colspan="2" class="text-center">${firstGoalName}</td>
        </tr>
        <tr>
            <td>최종 점수</td>
            <td colspan="2" class="text-center text-bold">${currentScore.home} : ${currentScore.away}</td>
        </tr>
        <tr class="betting-row">
            <td>나의 배팅</td>
            <td class="text-center">
                ${betDisplayCheck}
            </td>
            <td class="text-right ${profitClass}">
                ${profitSign}${displayAmount.toLocaleString()}원
            </td>
        </tr>
    `;
    
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 시작!
startSimulation();