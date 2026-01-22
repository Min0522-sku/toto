import db from "./common/database.js";

let me = JSON.parse(localStorage.getItem("me"));
document.querySelector(".username").innerHTML = `${me.name} 님`;

// initMockLog(); // 테스트용
initAssetChart(); // 자산 흐름 그래프 띄우기
printBettingHistory(); // 최근 5회 베팅 기록 띄우기

function initMockLog(){ // 테스트용
    localStorage.removeItem("userLog");
    localStorage.setItem("userLog",JSON.stringify(db.userLog));
}

function initAssetChart() {
    const canvas = document.querySelector("#assetChart");
    if (!canvas) return;

    const userLogs = getUserLogs(me.id);
    // const userLogs = getUserLogs(1); // 테스트용으로 일단 1번 유저의 데이터를 불러옴. 나중에는 윗줄 코드로 대체.
    const matches = getMatches();
    const teams = getTeams();
    const { series, labels } = buildAssetSeries(userLogs, matches, teams);
    drawAssetChart(canvas, series, labels);
}

function getUserLogs(userId) {
    const raw = localStorage.getItem("userLog");
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((item) => Number(item.user_id) === Number(userId));
}

function getMatches() {
    const raw = localStorage.getItem("match");
    return raw ? JSON.parse(raw) : db.match;
}

function getTeams() {
    const raw = localStorage.getItem("team");
    return raw ? JSON.parse(raw) : db.team;
}

function getBets(){
    const raw = localStorage.getItem("bet");
    return raw ? JSON.parse(raw) : db.bet;
}
function buildAssetSeries(logs, matches, teams) {
    const sorted = logs
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const teamMap = new Map(
        teams.map((team) => [Number(team.id), team])
    );
    const matchMap = new Map(
        matches.map((match) => [Number(match.id), match])
    );

    let total = 0;
    const series = [];
    const labels = [];

    for (const log of sorted) {
        const betAmount = Number(log.betAmount) || 0;
        const payout = Number(log.payout) || 0;
        const isSuccess = log.isSuccess === true || log.isSuccess === "true";
        const profit = isSuccess ? payout - betAmount : -betAmount;
        total += profit;
        series.push(total);

        const match = matchMap.get(Number(log.match_id));
        if (match) {
            const homeTeam = teamMap.get(Number(match.home_team_id));
            const awayTeam = teamMap.get(Number(match.away_team_id));
            const homeName = homeTeam ? homeTeam.name : "홈팀";
            const awayName = awayTeam ? awayTeam.name : "원정팀";
            labels.push(`${homeName} vs ${awayName}`);
        } else {
            labels.push("경기 정보 없음");
        }
    }

    if (series.length === 0) {
        return { series: [0], labels: ["데이터 없음"] };
    }

    return { series, labels };
}

function drawAssetChart(canvas, series, labels) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 560;
    const height = rect.height || 260;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { left: 60, right: 16, top: 16, bottom: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // axes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;

    // y-axis labels
    ctx.fillStyle = "#111827";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const mid = min + range / 2;
    const yTop = padding.top;
    const yMid = padding.top + chartHeight / 2;
    const yBottom = padding.top + chartHeight;

    ctx.fillText(formatAmount(max), padding.left - 12, yTop);
    ctx.fillText(formatAmount(mid), padding.left - 12, yMid);
    ctx.fillText(formatAmount(min), padding.left - 12, yBottom);

    // line
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.beginPath();
    series.forEach((value, index) => {
        const x =
            padding.left +
            (chartWidth * index) / Math.max(series.length - 1, 1);
        const y =
            padding.top +
            chartHeight * (1 - (value - min) / range);
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // x-axis labels
    ctx.fillStyle = "#111827";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    labels.forEach((label, index) => {
        const x =
            padding.left +
            (chartWidth * index) / Math.max(series.length - 1, 1);
        const y = height - padding.bottom + 4;
        drawMatchLabel(ctx, label, x, y, 12);
    });
}

function formatAmount(value) {
    return `${Math.round(value).toLocaleString("ko-KR")}`;
}

function drawMatchLabel(ctx, label, x, y, lineHeight) {
    if (!label) return;
    const parts = label.split(" vs ");
    if (parts.length === 2) {
        ctx.fillText(parts[0], x, y);
        ctx.fillText("vs", x, y + lineHeight);
        ctx.fillText(parts[1], x, y + lineHeight * 2);
        return;
    }
    ctx.fillText(label, x, y);
}


function printBettingHistory(){
    // [1] .box-list, .stat-list dom 가져오기
    let boxlistDom = document.querySelector(".box-list");
    let statlistDom = document.querySelector(".stat-list");

    // [2] localStorage에서 필요한 데이터 가져옴
    // 홈팀이름, 원정팀이름, 베팅종목, 베팅내용, 베팅금액, 수익금
    let userLogs = getUserLogs(me.id);
        console.log(userLogs);
    let matches = getMatches();
    let teams = getTeams();
    let bets = getBets();

    let recent5Logs = userLogs.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(-5);
        console.log(recent5Logs);
    
    let boxlistHtml = ``;
    for(let i = 0; i < 5; i++){
        let log = recent5Logs[i];

        let match = getObjById(matches, log.match_id); // i 번째 매치
        let homeTeam = getObjById(teams, match.home_team_id);
        let awayTeam = getObjById(teams, match.away_team_id);
        let bet = getObjById(bets, log.bet_id);

        let homeTeamName = homeTeam.name;
        let awayTeamName = awayTeam.name;
        let betType = bet.type.slice(0,3);
        let betContentRaw = log.betContent; // "home", "away", "3:1", ...
        let betContent;
        let betAmount = log.betAmount;
        let payout = log.payout;
        let isSuccess = log.isSuccess;
        let valueRaw = isSuccess ? payout - betAmount : -betAmount;
        let value = addSignAndLocaleString(valueRaw);

        switch(betType){
            case "승무패" :
                if(betContentRaw == "home") betContent = "홈팀 승";
                else if(betContentRaw == "away") betContent = "원정팀 승";
                else betContent = "배팅 내용 오류";
                break;

            case "선제골" : 
                if(betContentRaw == "home") betContent = homeTeam.name;
                else if(betContentRaw == "away") betContent = awayTeam.name;
                else betContent = "오류";
                break;
                
            case "스코어" : 
                betContent = betContentRaw;
                break;
            default :
                betContent = "베팅 타입 오류";
                break;
        }

        boxlistHtml += `<div class="box">
                    <span class="box-title">${homeTeamName} vs ${awayTeamName}</span>
                    <span class="box-meta">${betType} / ${betContent}</span>
                    <span class="box-value">${value}</span>
                </div>`;

    }
        console.log(boxlistHtml);
    
    // [3] box-list에 html 주입
    boxlistDom.innerHTML = boxlistHtml;

    // [4] statList에 필요한 총 베팅 금액, 수익률, 최고 수익금
    let allBetAmountsRaw = 0; // 총 베팅 금액
    for(let i = 0; i < userLogs.length; i++){
        allBetAmountsRaw += userLogs[i].betAmount;
    }

    let RTPRaw; // 수익률 (충전한 금액 대비 총 수익금)
    let chargedMoney = 100000; // 나중에 '돈 충전' 기능이 생기면 충전한 내역만큼 여기에 추가해야 함.
    let withdrawnMoney = 0; // 나중에 '돈 출금' 기능이 생기면 그 내역만큼 여기에 추가해야 함
    let earnedMoney = me.money + withdrawnMoney - chargedMoney; // 수익금
    RTPRaw = ((earnedMoney / chargedMoney) * 100).toFixed(1); // ex: 55.3
    
    let maxReturnRaw = 0; // 최고 수익금
    for(let i = 0; i < userLogs.length; i++){
        if(maxReturnRaw < userLogs[i].payout) maxReturnRaw = userLogs[i].payout;
    }

    let allBetAmounts, RTP, maxReturn;
    
    allBetAmounts = allBetAmountsRaw.toLocaleString();
    RTP = addSignAndLocaleString(RTPRaw);
    maxReturn = addSignAndLocaleString(maxReturnRaw);

    let statlistHtml = `<div class="stat">
                            <span class="stat-label">총 베팅 금액</span>
                            <span class="stat-value">${allBetAmounts}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">수익률</span>
                            <span class="stat-value positive">${RTP}%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">최고 수익금</span>
                            <span class="stat-value">${maxReturn}</span>
                        </div>`;

    statlistDom.innerHTML = statlistHtml;
    
}

function addSignAndLocaleString(rawNumber){ // 음양수 기호 붙이고 3자리수마다 콤마 붙임
    let isPositive = rawNumber >= 0;
    return isPositive ? "+" + rawNumber.toLocaleString() : rawNumber.toLocaleString();
}