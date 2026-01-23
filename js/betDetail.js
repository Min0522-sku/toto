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
    
    let selectedId = Number(new URLSearchParams(location.search).get("id"));
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
        console.log(homeTeam);
        console.log(awayTeam);
    const hRate = Math.round(getWinrate(homeTeam.offense , homeTeam.defense, awayTeam.offense, awayTeam.defense) * 100);
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

    //배팅 기능

    

    

let isSelected = false;  // 선택 여부 (true/false)
let betId;       // 종목 id
let betContent = "";     // 선택한 내용

// 리셋 함수
function reset() {
    isSelected = false;
    betId = undefined;
    betContent = "";

    const allBtn = document.querySelectorAll(".bet-button")
    for(let i = 0 ; i <= allBtn.length -1 ; i++){
        allBtn[i].style.backgroundColor = "white"
        allBtn[i].style.color = "black"
    }
    document.querySelector("#goal-select").style.color = ""
    


    console.log("모든 선택 리셋 완료");
}

// 1. 승무패 버튼 클릭 시
function homeCheck(btn) {
    reset(); 
    document.querySelector("#score-text").value = "";

    isSelected = true;     
    betId = 1 ;
    betContent = btn.id;

    btn.style.background = "orange"

    
    
    console.log(`${"선택됨:"} ${betId} ${(betContent)}` );
}


function firstGoal(option){
    reset(); 
    document.querySelector("#score-text").value = "";
    

    isSelected = true;
    betId = 2 ;
    betContent = option.value;

    option.style.color = "orange"

    

    console.log(`${"선택됨:"} ${betId} ${betContent}`);
}

function scoreSelect(){
    reset(); 

    isSelected = true;
    betId = 3
    let inputScore = document.querySelector("#score-text")
    betContent = inputScore.value ; 

    console.log(`${"선택됨:"} ${betId} ${betContent}`);
}

const userLog = JSON.parse(localStorage.getItem('userLog'))
if(userLog ==null){
    userLog =[];
}

function bettingBtn(){ //배팅 버튼을 눌렀을때 함수
    
    const amountInput = document.querySelector(".betAmount") //배팅 금액 가져오기
    const amountValue = Number(amountInput.value) //amountValue에 배팅 금액 넣기

    if(isSelected == false){ //배팅 종목을 선택 안했을때 리턴
        alert("배팅 종목을 선택해 주세요!");
        return;
    }
    if(amountValue <= 0 || amountValue == null || amountValue % 1 !== 0 ){ //배팅 금액 입력 조건
        alert("금액을 정확히 입력해주세요(숫자만가능)")
        return;
    }
    const user = JSON.parse(localStorage.getItem('user')) //로컬에있는 user정보 가져오기
    const userMoney = Number(localStorage.getItem('user').money) //가져온 user 정보에서 money객체 가져오기
    if(userMoney < amountValue){ //user의 money가 배팅한 금액 보다 적으면 리턴
        alert("잔액이 부족합니다")
        return;
    }
    
    if(betId == 3){ //스코어 맞추기 종목에서 숫자:(콜론)숫자의 형식으로만 입력되게끔
        let inputScore = document.querySelector("#score-text") 
        betContent = inputScore.value ; //사용자가 스코어 맞추기 인풋박스에 적은 값을 betContent에 넣음
        const scoreType = /^[0-9]+:[0-9]+$/ ; //정규표현식 사용
        if(!scoreType.test(betContent)){ console.log(betContent) ; //betContent가 정규표현식에 어긋날경우 리턴
            alert("스코어 형식을 맞추세요(예: 2:1)")
            return;
        }
    }
    

        
    const betUserLog = {
        id: userLog <= 0 ? 1 : userLog[userLog.length-1].id + 1 ,
        user_id: JSON.parse(localStorage.getItem('me')).id ,
        match_id: selectedId , 
        bet_id: betId , 
        betContent,
        createdAt: todayString ,
        betAmount: amountInput.value, 
    }

    userLog.push(betUserLog)
    localStorage.setItem('userLog' , JSON.stringify(userLog))
    location.href="/html/simulation.html"
}



//{ id: 3, user_id: 5, match_id: 3, bet_id: 3, betContent: "3:2", createdAt: "", betAmount: 100000, isSuccess: true, payout: 360000 },




const today = new Date();

const year = today.getFullYear();      
const month = today.getMonth() + 1;   
const date = today.getDate();         

const todayString = year + "-" + month + "-" + date;




