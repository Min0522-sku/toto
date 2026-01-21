import db from "./common/database.js";

// db에서 값 가져오는 방법(예시 코드)
// console.log(db.league[1].id);

// __개발용__ 
// 로컬스토리지 초기화가 필요할 때 아래 코드 주석 해제 후 실행
// localStorage.clear(); 

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
    
}