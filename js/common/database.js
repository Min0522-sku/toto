const league = [
    { id: 1, name: "EPL", imageUrl: "/assets/images/leagues/epl.svg"},
    { id: 2, name: "La Liga", imageUrl: "/assets/images/leagues/laliga.png"},
    { id: 3, name: "Bundesliga", imageUrl: "/assets/images/leagues/bundesliga.svg"},
    { id: 4, name: "Champions League", imageUrl: "/assets/images/leagues/champions_league.png"},
    { id: 5, name: "Europa League", imageUrl: "/assets/images/leagues/europa_league.png"},
]

const team = [
    { id: 1, league_id: 1, name: "리버풀", imageUrl: "/assets/images/teams/epl/1.png", offense: 92, defense: 99, avgScored: 2.35, avgConceded: 0.65, leagueRank: 1, wins: 15, draws: 3, losses: 2 },
    { id: 2, league_id: 1, name: "맨시티", imageUrl: "/assets/images/teams/epl/2.png", offense: 98, defense: 65, avgScored: 2.45, avgConceded: 1.35, leagueRank: 3, wins: 12, draws: 4, losses: 5 },
    { id: 3, league_id: 1, name: "아스널", imageUrl: "/assets/images/teams/epl/3.png", offense: 88, defense: 90, avgScored: 2.1, avgConceded: 0.95, leagueRank: 2, wins: 13, draws: 5, losses: 3 },
    { id: 4, league_id: 1, name: "첼시", imageUrl: "/assets/images/teams/epl/4.png", offense: 86, defense: 70, avgScored: 2.05, avgConceded: 1.25, leagueRank: 4, wins: 11, draws: 6, losses: 4 },
    { id: 5, league_id: 1, name: "토트넘", imageUrl: "/assets/images/teams/epl/5.png", offense: 90, defense: 55, avgScored: 2.2, avgConceded: 1.55, leagueRank: 7, wins: 10, draws: 3, losses: 8 },
    { id: 6, league_id: 1, name: "브라이튼", imageUrl: "/assets/images/teams/epl/6.png", offense: 68, defense: 85, avgScored: 1.55, avgConceded: 1.1, leagueRank: 5, wins: 10, draws: 6, losses: 5 },
    { id: 7, league_id: 1, name: "A.빌라", imageUrl: "/assets/images/teams/epl/7.png", offense: 75, defense: 62, avgScored: 1.7, avgConceded: 1.4, leagueRank: 6, wins: 10, draws: 5, losses: 6 },
    { id: 8, league_id: 1, name: "뉴캐슬", imageUrl: "/assets/images/teams/epl/8.png", offense: 70, defense: 75, avgScored: 1.5, avgConceded: 1.2, leagueRank: 8, wins: 9, draws: 6, losses: 6 },
    { id: 9, league_id: 1, name: "맨유", imageUrl: "/assets/images/teams/epl/9.png", offense: 60, defense: 68, avgScored: 1.25, avgConceded: 1.3, leagueRank: 9, wins: 8, draws: 6, losses: 7 },
    { id: 10, league_id: 1, name: "에버튼", imageUrl: "/assets/images/teams/epl/10.png", offense: 67, defense: 58, avgScored: 1.45, avgConceded: 1.5, leagueRank: 10, wins: 8, draws: 4, losses: 9 },
    { id: 11, league_id: 2, name: "R.마드리드", imageUrl: "/assets/images/teams/laliga/1.png", offense: 98, defense: 88, avgScored: 3.24, avgConceded: 0.8, leagueRank: 1, wins: 14, draws: 2, losses: 4 },
    { id: 12, league_id: 3, name: "B.뮌헨", imageUrl: "/assets/images/teams/bundesliga/1.png", offense: 92, defense: 92, avgScored: 2.2, avgConceded: 0.91, leagueRank: 1, wins: 16, draws: 3, losses: 1 },
    
]

const user = [
    { id: 1, name: "박지훈", money: 1000000 },
    { id: 2, name: "김수연", money: 1000000 },
    { id: 3, name: "조기수", money: 1000000 },
    { id: 4, name: "최영민", money: 1000000 },
]

const match = [
    { id: 1, league_id: 1, home_team_id: 1, away_team_id: 2, status: "경기 종료", result: "3:2", date: "2026-01-19", maxProfit: 780000, participantCount: 128 },
    { id: 2, league_id: 1, home_team_id: 3, away_team_id: 1, status: "경기 종료", result: "1:1", date: "2026-01-18", maxProfit: 420000, participantCount: 96 },
    { id: 3, league_id: 1, home_team_id: 4, away_team_id: 6, status: "경기 종료", result: "0:2", date: "2026-01-17", maxProfit: 310000, participantCount: 74 },
    { id: 4, league_id: 1, home_team_id: 5, away_team_id: 7, status: "경기 종료", result: "2:0", date: "2026-01-17", maxProfit: 510000, participantCount: 88 },
    { id: 5, league_id: 1, home_team_id: 8, away_team_id: 9, status: "경기 종료", result: "4:1", date: "2026-01-16", maxProfit: 690000, participantCount: 140 },
    { id: 6, league_id: 1, home_team_id: 10, away_team_id: 2, status: "경기 종료", result: "0:3", date: "2026-01-16", maxProfit: 560000, participantCount: 120 },
    { id: 7, league_id: 1, home_team_id: 6, away_team_id: 3, status: "경기 종료", result: "2:2", date: "2026-01-15", maxProfit: 270000, participantCount: 62 },
    { id: 8, league_id: 4, home_team_id: 12, away_team_id: 5, status: "경기 종료", result: "1:0", date: "2026-01-15", maxProfit: 330000, participantCount: 71 },
    { id: 9, league_id: 1, home_team_id: 2, away_team_id: 5, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 10, league_id: 1, home_team_id: 1, away_team_id: 8, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 11, league_id: 1, home_team_id: 3, away_team_id: 9, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 12, league_id: 1, home_team_id: 4, away_team_id: 10, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 13, league_id: 1, home_team_id: 5, away_team_id: 1, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 14, league_id: 1, home_team_id: 6, away_team_id: 2, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 15, league_id: 1, home_team_id: 7, away_team_id: 3, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
    { id: 16, league_id: 4, home_team_id: 1, away_team_id: 11, status: "경기 전", result: "", date: "", maxProfit: "", participantCount: "" },
]

const log = [
    { id: 1, match_id: 1, subject_team: "home", time: "0:08:00", event_id: 1 },
    { id: 2, match_id: 1, subject_team: "away", time: "0:11:00", event_id: 2 },
    { id: 3, match_id: 1, subject_team: "home", time: "0:32:00", event_id: 2 },
    { id: 4, match_id: 1, subject_team: "home", time: "1:06:00", event_id: 2 },
    { id: 5, match_id: 1, subject_team: "away", time: "1:20:00", event_id: 1 },
    { id: 6, match_id: 1, subject_team: "away", time: "1:27:00", event_id: 2 },
]

const event = [
    { id: 1, type: "goal" },
    { id: 2, type: "save" },
]

const bet = [
    { id: 1, type: "승무패 예측" },
    { id: 2, type: "선제골 예측" },
    { id: 3, type: "스코어 예측" },
]

const userLog = [
    { id: 1, user_id: 1, match_id: 1, bet_id: 1, betContent: "home", createdAt: "2026-01-21", betAmount: 100000, isSuccess: true, payout: 360000 },
    { id: 2, user_id: 4, match_id: 2, bet_id: 2, betContent: "away", createdAt: "2026-01-22", betAmount: 100000, isSuccess: true, payout: 360000 },
    { id: 3, user_id: 3, match_id: 3, bet_id: 3, betContent: "3:2", createdAt: "2026-01-22", betAmount: 100000, isSuccess: true, payout: 360000 },
    { id: 4, user_id: 1, match_id: 4, bet_id: 1, betContent: "home", createdAt: "2026-01-23", betAmount: 45000, isSuccess: true, payout: 117000 },
    { id: 5, user_id: 2, match_id: 5, bet_id: 2, betContent: "away", createdAt: "2026-01-24", betAmount: 32000, isSuccess: false, payout: 0 },
    { id: 6, user_id: 3, match_id: 6, bet_id: 3, betContent: "0:3", createdAt: "2026-01-25", betAmount: 78000, isSuccess: true, payout: 265200 },
    { id: 7, user_id: 4, match_id: 7, bet_id: 1, betContent: "away", createdAt: "2026-01-26", betAmount: 15000, isSuccess: false, payout: 0 },
    { id: 8, user_id: 1, match_id: 8, bet_id: 2, betContent: "home", createdAt: "2026-01-27", betAmount: 60000, isSuccess: true, payout: 132000 },
    { id: 9, user_id: 2, match_id: 1, bet_id: 3, betContent: "2:1", createdAt: "2026-01-28", betAmount: 41000, isSuccess: true, payout: 127100 },
    { id: 10, user_id: 3, match_id: 2, bet_id: 1, betContent: "home", createdAt: "2026-01-29", betAmount: 27000, isSuccess: false, payout: 0 },
    { id: 11, user_id: 4, match_id: 3, bet_id: 2, betContent: "away", createdAt: "2026-01-30", betAmount: 52000, isSuccess: true, payout: 145600 },
    { id: 12, user_id: 1, match_id: 4, bet_id: 3, betContent: "1:1", createdAt: "2026-01-31", betAmount: 83000, isSuccess: false, payout: 0 },
    { id: 13, user_id: 2, match_id: 5, bet_id: 1, betContent: "away", createdAt: "2026-02-01", betAmount: 10000, isSuccess: true, payout: 37000 },
    { id: 14, user_id: 3, match_id: 6, bet_id: 2, betContent: "home", createdAt: "2026-02-02", betAmount: 94000, isSuccess: true, payout: 197400 },
    { id: 15, user_id: 4, match_id: 7, bet_id: 3, betContent: "4:0", createdAt: "2026-02-03", betAmount: 68000, isSuccess: false, payout: 0 },
    { id: 16, user_id: 1, match_id: 8, bet_id: 1, betContent: "home", createdAt: "2026-02-04", betAmount: 39000, isSuccess: true, payout: 97500 },
    { id: 17, user_id: 2, match_id: 1, bet_id: 2, betContent: "away", createdAt: "2026-02-05", betAmount: 76000, isSuccess: false, payout: 0 },
    { id: 18, user_id: 3, match_id: 2, bet_id: 3, betContent: "2:2", createdAt: "2026-02-06", betAmount: 22000, isSuccess: true, payout: 72600 },
    { id: 19, user_id: 4, match_id: 3, bet_id: 1, betContent: "away", createdAt: "2026-02-07", betAmount: 87000, isSuccess: true, payout: 208800 },
    { id: 20, user_id: 1, match_id: 4, bet_id: 2, betContent: "home", createdAt: "2026-02-08", betAmount: 54000, isSuccess: false, payout: 0 },
    { id: 21, user_id: 2, match_id: 5, bet_id: 3, betContent: "3:2", createdAt: "2026-02-09", betAmount: 61000, isSuccess: true, payout: 176900 },
    { id: 22, user_id: 3, match_id: 6, bet_id: 1, betContent: "home", createdAt: "2026-02-10", betAmount: 33000, isSuccess: false, payout: 0 },
    { id: 23, user_id: 4, match_id: 7, bet_id: 2, betContent: "away", createdAt: "2026-02-11", betAmount: 47000, isSuccess: true, payout: 150400 },
    { id: 24, user_id: 2, match_id: 8, bet_id: 3, betContent: "1:0", createdAt: "2026-02-12", betAmount: 91000, isSuccess: true, payout: 245700 },
]

const db = {
    league,
    team,
    user,
    match,
    log,
    event,
    bet,
    userLog,
}

export default db