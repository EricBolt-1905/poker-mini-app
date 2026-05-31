// Формат записи рук: "AKs" (одномастные), "AKo" (разномастные), "AA" (пара).
// Каждая позиция – массив строк с руками.

const CHARTS = {
    // 6-max: позиции: UTG, MP, CO, BTN, SB
    6: {
        UTG: ["AA","KK","QQ","JJ","TT","99","88","77","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","AQo","AJo","ATo","KQs","KJs","KTs","K9s","K8s","QJs","QTs","JTs","T9s","98s","87s","76s","65s","54s"],
        MP: ["66","55","44","A9o","A8o","KQo","KJo","QJo","JTo"].concat(["AA","KK","QQ","JJ","TT","99","88","77","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","AQo","AJo","ATo","KQs","KJs","KTs","K9s","K8s","QJs","QTs","JTs","T9s","98s","87s","76s","65s","54s"]),
        CO: ["22","33","44","55","66","77","88","99","TT","JJ","QQ","KK","AA","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","AQo","AJo","ATo","A9o","A8o","A7o","A6o","A5o","A4o","A3o","A2o","KQs","KJs","KTs","K9s","K8s","K7s","K6s","K5s","KQo","KJo","KTo","QJs","QTs","Q9s","Q8s","QJo","QTo","JTs","J9s","J8s","JTo","T9s","T8s","98s","97s","87s","86s","76s","75s","65s","54s"],
        BTN: "22+, A2s+, K2s+, Q2s+, J2s+, T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, A2o+, K2o+, Q2o+, J2o+, T2o+, 92o+, 82o+, 72o+, 62o+, 52o+, 42o+, 32o".split(", "),
        SB: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,AKo,AQo,AJo,ATo,A9o,A8o,KQs,KJs,KTs,K9s,K8s,KQo,KJo,QJs,QTs,QJo,JTs,T9s,98s".split(",")
    },
    // 9-max
    9: {
        UTG: ["AA","KK","QQ","JJ","TT","99","88","AKs","AQs","AJs","ATs","KQs","KJs","QJs","JTs","T9s","98s","AKo","AQo"],
        UTG1: ["77","66","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","KTs","K9s","QTs","J9s","T8s","97s","87s","76s","65s","54s"].concat(["AA","KK","QQ","JJ","TT","99","88","AKs","AQs","AJs","ATs","KQs","KJs","QJs","JTs","T9s","98s","AKo","AQo"]),
        MP: ["55","44","AJo","ATo","KJo","KTo","QJo","QTo","JTo"].concat(["AA","KK","QQ","JJ","TT","99","88","77","66","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","AQo","KQs","KJs","KTs","K9s","QJs","QTs","JTs","J9s","T9s","T8s","98s","97s","87s","76s","65s","54s"]),
        HJ: ["33","22","A9o","A8o","K9s","K8s","Q8s","Q9s","J8s","T7s"].concat(["AA","KK","QQ","JJ","TT","99","88","77","66","55","44","AKs","AQs","AJs","ATs","A9s","A8s","A7s","A6s","A5s","A4s","A3s","A2s","AKo","AQo","AJo","ATo","A9o","A8o","KQs","KJs","KTs","K9s","K8s","KQo","KJo","KTo","QJs","QTs","Q9s","Q8s","QJo","QTo","JTs","J9s","J8s","JTo","T9s","T8s","98s","97s","87s","86s","76s","75s","65s","54s"]),
        CO: "22+, A2s+, K2s+, Q2s+, J2s+, T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, A2o+, K2o+, Q2o+, J2o+, T2o+, 92o+, 82o+, 72o+, 62o+, 52o+, 42o+, 32o".split(", "),
        BTN: "22+, A2s+, K2s+, Q2s+, J2s+, T2s+, 92s+, 82s+, 72s+, 62s+, 52s+, 42s+, 32s, A2o+, K2o+, Q2o+, J2o+, T2o+, 92o+, 82o+, 72o+, 62o+, 52o+, 42o+, 32o".split(", "),
        SB: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,AKo,AQo,AJo,ATo,A9o,A8o,KQs,KJs,KTs,K9s,K8s,KQo,KJo,QJs,QTs,QJo,JTs,T9s,98s".split(",")
    }
};
