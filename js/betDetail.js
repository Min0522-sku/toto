// 1.데이터 가져와서 넣기
// 1-1. 메인페이지에서 로컬에 넣은걸 받아오기
// 1-2. 받아온걸 내 페이지 공간에 맞게끔 세팅


// 2.기능적 구현
// 2-1. 헤더 누르면 메인페이지로 이동
// 2-2. 마이페이지 버튼 누르면 이동
// 2-3. 배팅 종목 버튼(하나만 고를 수 있도록)
// 2-4. 금액을 입력(본인의 자본금에서 빠져나가도록)
// 2-5. 배팅하기 버튼은 종목과 금액을 입력안하면 안눌리게끔
// 2-6. 배팅하기 버튼을 누르면 배팅 정보를 경기결과 페이지로 넘기기
// 2-7. 배팅하기 버튼을 누르면 경기결과 페이지로 이동


    //데이터 가져와서 넣기
    const matchData = JSON.parse(localStorage.getItem('match'));
    const teamData = JSON.parse(localStorage.getItem('team'));
    
    let selectedId = localStorage.getItem('selectedMatchId');
    let targetMatch = "";
    for (let i = 0; i < matchData.length; i++) {
        if (matchData[i].id == selectedId) {
            targetMatch = matchData[i];
            break; 
        }
    }

    const hTeamId = targetMatch.home_team_id;
    const aTeamId = targetMatch.away_team_id;

    let homeTeam, awayTeam;
    for (let index = 0; index < teamData.length; index++) {
        if (teamData[index].id == hTeamId) {
            homeTeam = teamData[index];
        }
        if (teamData[index].id == aTeamId) {
            awayTeam = teamData[index];
        }
    }

    //이미지
    document.querySelector('.home-team-name').innerText = homeTeam.name;
    document.querySelector('.away-team-name').innerText = awayTeam.name;
    
    document.querySelector('#home-teamimg img').src = homeTeam.imageUrl;
    document.querySelector('#away-teamimg img').src = awayTeam.imageUrl;

    // 7. 전력비교 테이블 채우기
    const rows = document.querySelectorAll('.compare-row');
    
    // 순위
    rows[0].cells[0].innerText = `${homeTeam.leagueRank}위`;
    rows[0].cells[2].innerText = `${awayTeam.leagueRank}위`;
    
    // 전적 
    rows[1].cells[0].innerText = `${homeTeam.wins}승 ${homeTeam.draws}무 ${homeTeam.losses}패`;
    rows[1].cells[2].innerText = `${awayTeam.wins}승 ${awayTeam.draws}무 ${awayTeam.losses}패`;
    
    // 득점/실점
    rows[2].cells[0].innerText = homeTeam.avgScored;
    rows[2].cells[2].innerText = awayTeam.avgScored;
    rows[3].cells[0].innerText = homeTeam.avgConceded;
    rows[3].cells[2].innerText = awayTeam.avgConceded;

    // 8. 승률 그래프 계산 및 적용
    const total = homeTeam.offense + awayTeam.offense;
    const hRate = Math.round((homeTeam.offense / total) * 100);
    const aRate = 100 - hRate;

    const hBar = document.querySelector('.winRate.home');
    const aBar = document.querySelector('.winRate.away');

    // 막대기 길이와 텍스트 넣기
    hBar.style.width = `${hRate}%`;
    hBar.innerText = `${homeTeam.name} 승률: ${hRate}%`;
    
    aBar.style.width = `${aRate}%`;
    aBar.innerText = `${awayTeam.name} 승률: ${aRate}%`;

    // 9. 배당률 버튼 업데이트
    const betBtns = document.querySelectorAll('.bet-button');
    const hOdds = (100 / hRate).toFixed(2);
    const aOdds = (100 / aRate).toFixed(2);

    betBtns[0].innerText = `HOME승: ${hOdds}`;
    betBtns[1].innerText = `무승부: 3.50`;
    betBtns[2].innerText = `AWAY승: ${aOdds}`;

    localStorage.setItem('selectedMatchId', 5) 

    //배팅 기능
    


