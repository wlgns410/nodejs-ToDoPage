// 설치한 라이브러리를 호출
const express = require('express')
const app = express();

// 로컬 컴퓨터에 서버를 염(포트번호, 할 기능)
app.listen(8080, function(){
    console.log('listening on 8080')
});

// 누군가가 /pet으로 방문 시 pet 안내문 띄우기
app.get('/pet', function(req, res){
    res.send('펫 용품 판매 사이트입니다.');
});

// beauty 용품 판매 URL
app.get('/beauty', function(req, res){
    res.send('뷰티용품 쇼핑 페이지입니다.')
});

//
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
});