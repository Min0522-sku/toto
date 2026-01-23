import db from "./common/database.js";
// __개발용__ 
// 로컬스토리지 초기화가 필요할 때 아래 코드 주석 해제 후 실행
localStorage.clear(); 

// [1] 로컬스토리지에 초기 데이터 삽입 
// 사전 정의 item : league, team, match, event, user
// 껍데기만 정의 : log, userLog

const predefinedItems = ["league", "team", "match", "event", "user", "bet"];
const undefinedItems = ["log", "userLog"];

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

function login(){
    // [1] input에 입력된 값 가져오기
    let name = document.querySelector(".login-input").value;
    // [2] localStorage에 이름 set
    let users = JSON.parse(localStorage.getItem("user"));
    let id = 1;

    if(users == null) users = [];
    else id = users[users.length - 1].id + 1;

    let money = 100000; // 초기 자금 (10만원, 수정 가능)
    let me = { id, name, money };
    users.push(me);
    localStorage.setItem("user",JSON.stringify(users));
    localStorage.setItem("me", JSON.stringify(me));

    // [3] home 화면으로 link
    location.href = "./html/home.html";
}
window.login = login;