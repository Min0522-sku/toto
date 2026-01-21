import db from "./common/database.js";

// db에서 값 가져오는 방법(예시 코드)
// console.log(db.league[1].id);

// __개발용__ 
// 로컬스토리지 초기화가 필요할 때 아래 코드 주석 해제 후 실행
localStorage.clear(); 

// [1] 로컬스토리지에 초기 데이터 삽입 
// 사전 정의 item : league, team, match, event
// 껍데기만 정의 : user, log, userLog

const predefinedItems = ["league", "team", "match", "event"];
const undefinedItems = ["user", "log", "userLog"];

// [1-1] 사전정의 데이터 로컬스토리지에 set and initialize
for(let i = 0; i < predefinedItems.length; i++){
    if(localStorage.getItem(predefinedItems[i]) == null){
        localStorage.setItem(predefinedItems[i], JSON.stringify(db[predefinedItems[i]]));
    }
    else{
        console.log(`${predefinedItems[i]} 데이터가 localStorage에 이미 존재함.`);
    }
}

// [1-2] 정의되지 않은 데이터를 localStorage에 set and initialize
for(let i = 0; i < undefinedItems.length; i++){
    if(localStorage.getItem(undefinedItems[i]) == null){
        localStorage.setItem(undefinedItems[i], "[]");
    }
    else{
        console.log(`${predefinedItems[i]} 데이터가 localStorage에 이미 존재함. `);
    }
}

// [2] 오늘의 경기를 todayTable div에 print
printTodayMatch();

// [3] 지난 경기를 pastTable div에 print
printPastMatch();


// ------------- FUNCTIONS -------------

function printTodayMatch() {
    // [1] 로컬스토리지에서 매치 정보 가져옴
    const matches = JSON.parse(localStorage.getItem("match"));
    // [2] status : "경기 전", "경기 종료"에 따라 데이터 객체 분리
    const todayMatches = [];
    for(let i = 0; i < matches.length; i++){
        if(matches[i].status == "경기 전")
            todayMatches.push(matches[i]);
    }
        console.log("today : ", todayMatches);
    
    // [3] id=todayTable div (오늘의 경기) 에 html 주입
    let todayTable = document.querySelector("#todayTable");
    let html = `<ul class="table-row">
                    <li class="table-item">스포츠명</li>
                    <li class="table-item">리그</li>
                    <li class="table-item">홈팀</li>
                    <li class="table-item">원정팀</li>
                    <li class="table-item betBtnContainer">베팅하기</li>
                </ul>`;
    
    for(let i = 0; i < todayMatches.length; i++){
        // [3-1] 스포츠이미지, 리그이미지, 리그명, 홈팀이미지, 홈팀이름, 원정팀이미지, 원정팀이름, 홈팀승률(계산), 원정팀승률(계산) 가져오기
        let match = todayMatches[i];

        let sportImgUrl = "/assets/images/sports/Football.svg"; // 스포츠는 우선 축구만 지원하므로 하드코딩

        let league = getObjById(db.league, match.league_id); // match 객체에 있는 league_id 외래키로 해당 리그 객체를 찾음
        let leagueImgUrl = league.imageUrl;
        let leagueName = league.name;

        let homeTeam = getObjById(db.team, match.home_team_id);
        let homeTeamImg = homeTeam.imageUrl;
        let homeTeamName = homeTeam.name;

        let awayTeam = getObjById(db.team, match.away_team_id);
        let awayTeamImg = awayTeam.imageUrl;
        let awayTeamName = awayTeam.name;

        let homeWinrate = getWinrate(homeTeam.offense, homeTeam.defense, awayTeam.offense, awayTeam.defense); //예 : 0.58 (58%)
        let homePercent = Math.round(homeWinrate * 100);
        let awayWinrate = 1 - homeWinrate;
        let awayPercent = Math.round(awayWinrate * 100);

        // [3-2] html에 주입 후 innerHTML

        if(i == 0) html += `<ul class="table-row" style="margin-top: 24px;">`; // 첫 번째 매치아이템은 헤더로부터 24px margin
        else html += `<ul class="table-row">`; // 나머지 매치아이템은 위 아이템과 붙여서

        html += `<li class="table-item">
                    <img class="sports-img center" src="${sportImgUrl}">
                </li>
                <li class="table-item">
                    <img class="league-img" src="${leagueImgUrl}">
                    <div class="league-name">${leagueName}</div>
                </li>
                <li class="table-item">
                    <img class="team-img" src="${homeTeamImg}">
                    <div class="team-name">${homeTeamName}</div>
                    <div class="team-winrate">${homePercent}%</div>
                </li>
                <li class="table-item">
                    <img class="team-img" src="${awayTeamImg}">
                    <div class="team-name">${awayTeamName}</div>
                    <div class="team-winrate">${awayPercent}%</div>
                </li>
                <li class="table-item betBtnContainer">
                    <button onclick="location.href='/html/betDetail.html?id=${match.id}'" class="betBtn">베팅하기</button>
                </li>`;
        html += `</ul>`;
    }
    todayTable.innerHTML = html;
}

function printPastMatch() {
    // [1] 로컬스토리지에서 매치 정보 가져옴
    const matches = JSON.parse(localStorage.getItem("match"));
    // [2] status : "경기 전", "경기 종료"에 따라 데이터 객체 분리
    const pastMatches = [];
    for(let i = 0; i < matches.length; i++){
        if(matches[i].status == "경기 종료")
            pastMatches.push(matches[i]);
    }
        console.log("past : ", pastMatches);
    
    // [3] id=todayTable div (오늘의 경기) 에 html 주입
    let pastTable = document.querySelector("#pastTable");
    let html = `<ul class="table-row">
                    <li class="table-item">스포츠명</li>
                    <li class="table-item">리그</li>
                    <li class="table-item">홈팀</li>
                    <li class="table-item">결과</li>
                    <li class="table-item">원정팀</li>
                    <li class="table-item bettorsContainer">베팅 참여자 수</li>
                </ul>`;

    for(let i = 0; i < pastMatches.length; i++){
        // [3-1] 스포츠이미지, 리그이미지, 리그명, 홈팀이미지, 홈팀이름, 원정팀이미지, 원정팀이름, 경기 결과, 홈팀승률(계산), 원정팀승률(계산) 가져오기
        let match = pastMatches[i];

        let sportImgUrl = "/assets/images/sports/Football.svg"; // 스포츠는 우선 축구만 지원하므로 하드코딩

        let league = getObjById(db.league, match.league_id); // match 객체에 있는 league_id 외래키로 해당 리그 객체를 찾음
        let leagueImgUrl = league.imageUrl;
        let leagueName = league.name;

        let homeTeam = getObjById(db.team, match.home_team_id);
        let homeTeamImg = homeTeam.imageUrl;
        let homeTeamName = homeTeam.name;

        let awayTeam = getObjById(db.team, match.away_team_id);
        let awayTeamImg = awayTeam.imageUrl;
        let awayTeamName = awayTeam.name;

        let homeWinrate = getWinrate(homeTeam.offense, homeTeam.defense, awayTeam.offense, awayTeam.defense); //예 : 0.58 (58%)
        let homePercent = Math.round(homeWinrate * 100);
        let awayWinrate = 1 - homeWinrate;
        let awayPercent = Math.round(awayWinrate * 100);

        // [3-2] html에 주입 후 innerHTML

        if(i == 0) html += `<ul class="table-row" style="margin-top: 24px;">`; // 첫 번째 매치아이템은 헤더로부터 24px margin
        else html += `<ul class="table-row">`; // 나머지 매치아이템은 위 아이템과 붙여서

        html += `<li class="table-item">
                    <img class="sports-img center" src="${sportImgUrl}">
                </li>
                <li class="table-item">
                    <img class="league-img" src="${leagueImgUrl}">
                    <div class="league-name">${leagueName}</div>
                </li>
                <li class="table-item">
                    <img class="team-img" src="${homeTeamImg}">
                    <div class="team-name">${homeTeamName}</div>
                    <div class="team-winrate">${homePercent}%</div>
                </li>
                <li class="table-item">
                    <span class="result-text">${match.result}</span>
                </li>
                <li class="table-item">
                    <img class="team-img" src="${awayTeamImg}">
                    <div class="team-name">${awayTeamName}</div>
                    <div class="team-winrate">${awayPercent}%</div>
                </li>
                <li class="table-item betBtnContainer">
                    ${match.participantCount} 명
                </li>`;
        html += `</ul>`;
    }
    pastTable.innerHTML = html;
}