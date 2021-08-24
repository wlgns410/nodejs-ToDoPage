// 설치한 라이브러리를 호출
const express = require('express');
const app = express();
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

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

});

app.post('/add', function(req, res){
    res.send('저장 완료');
    console.log(req.body.date);
    console.log(req.body.title);

    // db.counter 내의 allpost를 찾음
    db.collection('counter').findOne({ name : "게시물 개수" }, function(err, result){
        console.log(result.totalPost)
        var allPost = result.totalPost;

        //db.post에서 가져옴
        db.collection('post').insertOne({title:req.body.title, date:req.body.date, _id: allPost + 1}, function(err, result){
            console.log('일정 등록')
        
            // 콜백함수 안에 작성 1개만 저장 $set, $inc 은 연산자 operator임 이건 따로 공부, totalpost + 1
            db.collection('counter').updateOne({name: "게시물 개수"}, { $inc : {totalPost:1}}, function(err, result){
                if(err) {return console.log(err)};
            });
        });
        
    });
    
});

app.delete('/delete', function(req, res){
    console.log(req.body);
    // 정수로 변환 parseInt
    req.body._id = parseInt(req.body._id);
    //요청.body에 담긴 게시물번호를 db.Post에서 삭제
    db.collection('post').deleteOne(req.body, function(err, result){
        console.log('삭제 완료');
        res.status(200).send({ message : '삭제 성공'});
    });
});

//list로 GET요청 시 실제 DB에 저장된 데이터들로 예쁘게 꾸며진HTML을 보여줌


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

// app.get('/write', function(req, res){
//     res.sendFile(__dirname + '/write.html')
// });

// es6 문법
// app.get('/write', (req, res) => {
//     res.sendFile(__dirname + '/write.html')
// })
app.get('/index', function(req, res){
    db.collection('post').find().toArray(function(err, result){
        console.log(result);
        res.render('index.ejs', {post : result});
    });
});

app.get('/write', function(req, res){
    db.collection('post').find().toArray(function(err, result){
        console.log(result);
        res.render('write.ejs', {post : result});
    });
});



app.get('/list', function(req, res){
    // find : 모든 데이터 가져옴
    db.collection('post').find().toArray(function(err, result){
        console.log(result);
        res.render('list.ejs', { posts : result });
    });
});

// /detail로 접속하면 detail.ejs 보여줌
// /detail2로 접속하면 detail2.ejs 보여줌
// ':' 뒤에 파라미터가 있으면, 그 페이지로 보내주세요, req.params.id : 요청의 파라미터.something을 가져와라. 
app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        console.log(result);
        if(err) {return res.status(404).send('요청 페이지 없음')};
        res.render('detail.ejs', {data : result});
    });
});
