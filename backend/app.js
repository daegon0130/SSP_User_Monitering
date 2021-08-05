const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const { sequelize } = require('./models/');
const userRouter = require('./routes/user');
const viewRouter = require('./routes/views');

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

app.use('/api/user', userRouter);
app.use('/api/v', viewRouter);

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