const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const { sequelize } = require('./models/');
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const timelogRouter = require('./routes/timeLog');

const app = express();
app.set('port', 3000);
sequelize.sync({ force : false })
  .then(()=>{
      console.log('데이터베이스 연결 성공');
  })
  .catch((err)=>{
      console.log(err);
  });

app.use(morgan('dev'));
// 요청의 본문에 있는 데이터를 req.body 객체로 만들어줌.
app.use(express.json());
app.use(express.urlencoded( { extended : false } ));
// cors 이슈 해결
const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true
}
app.use(cors(corsOptions))

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/v', timelogRouter);

// /get_todo_list post 요청 입력:     출력: [ {"id":"3","text":"abc"}, ... ]
app.post('/get_todo_list', async (req, res)=>{
    try{
        console.log(req.body);
        //const todos = await Todo.findAll();
        res.send(req.body);
        //console.log(todos, 'sdfsdfsdf');
    } catch(err){
        console.error(err);
        next(err);
    }
});
// /add_todo post 요청 입력: {"text":"abc" }  출력: {"id":10}
app.post('/add_todo', async(req, res)=>{
    try{
        /*
    ToDos.push({ "id": ++numId, "text": req.body.text })
    console.log(ToDos);*/
        //onst todo = await Todo.create({
        //    text: req.body.text,
        //});
        //console.log(todo, '과연과연과연');
        res.send('ok');
    } catch(err){
        console.error(err);
        next(err);
    }
});
// /update_todo post 요청 입력: {"text":"abc", "id":3}  출력:
app.post('/update_todo', async (req, res)=>{
    try{
        /*
        console.log(req.body);
        for (let i = 0; i<ToDos.length; i++){
            if (ToDos[i].id === req.body.id){
                ToDos[i].text = req.body.text;
                console.log(ToDos);
                break;
            }
        */
        //const result = await Todo.update({
        //    text: req.body.text,
        //}, {
        //    where: { id: req.body.id },
        //});
        //console.log('12312312312',result);
        res.send('ok');
    } catch (err){
        console.error(err);
        next(err);
    }
});
// delete_todo 요청
app.post('/delete_todo', async (req, res)=>{
    try{
        /*console.log(req.body);
        for (let i = 0; i<ToDos.length; i++){
            if (ToDos[i].id === req.body.id){
                ToDos.splice(i, 1);
                break;
            }
        }*/
        //const result = await Todo.destroy({ where: { id: req.body.id } });
        //console.log(result, "destory");
        res.send('ok'); 
    } catch (err){
        console.error(err);
        next(err);
    }
});


app.use((req, res, next)=>{
    //throw Error(`${req.method} ${req.url} 존재하지 않습니다.\n`);
    next(`${req.method} ${req.url} 존재하지 않습니다.\n`);
});
app.use((err, req, res, next)=>{
    res.status(404).send(err);
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});