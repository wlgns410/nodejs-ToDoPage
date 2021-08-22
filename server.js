// 설치한 라이브러리를 호출
const express = require('express');
const app = express();
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;

// 어떤 데이터 베이스에 저장할 것인지
var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.czsgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client){
    // 에러처리
    if (err) return console.log(err);

    // db 이름('todoapp')
    db = client.db('todoapp');

    // db 내에 있는 '폴더'(post 폴더)에 저장할 데이터를 삽입
    db.collection('post').insertOne({name:'jihoon', age:27, _id:100}, function(err, result){
        console.log('저장완료');
    });

    // 로컬 컴퓨터에 서버를 염(포트번호, 할 기능)
    app.listen(8080, function(){
        console.log('listening on 8080')
    });

    db.collection('post').insertOne({title:'운동', data:'2021-08-22', _id:1}, function(err, result){
        console.log('일정 등록')
    })

    app.post('/add', function(req, res){
        res.send('저장 완료');
        console.log(req.body.date);
        console.log(req.body.title);
    })
})



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

app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html')
})

// es6 문법
// app.get('/write', (req, res) => {
//     res.sendFile(__dirname + '/write.html')
// })

