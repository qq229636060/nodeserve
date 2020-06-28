const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
var connection = require("./sql.js");
var rdata = require("./returndata.js");
var jwt = require('jsonwebtoken')
let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
app.use((req,res_app,next) =>{
    var token = req.headers['token'];
    if(req.path == '/login'){
        return next()
    }
    if(token == undefined){
          res_app.send(rdata(-200,'','还未登录'));
          return false;
      }else{
          verToken(token).then((data)=> {
              req.data = data;
              return next();
          }).catch((error)=>{
            　　　　res_app.send(rdata(-200,'','还未登录'));
                   return false;
          })
      }
})

//登录提交
app.post('/login',(req, res_app) => {
    console.log("a")
    console.log(req.query.useid)
    console.log(req.query.password)
    if(req.query.useid == '' || req.query.password == ''){
        res_app.send(rdata(-1,'','请填写用户名或密码'));
        return false
    }
    var sql_order = "select * from useinfo WHERE usename = '" + req.query.useid + "' AND `password` = '" + req.query.password+"'"
    connection.query(sql_order,function(err,res,next){
        if(err){
            console.log('err:'+err)
            res_app.send(err)
        }else if(res.length == 0){
            console.log('res:'+JSON.parse(JSON.stringify(res)))
            res_app.send(rdata(-1,JSON.parse(JSON.stringify(res)),'用户名或密码错误'));
        }else{
            let content ={name:req.query.useid}; // 要生成token的主题信息
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60*60*1  // 1小时过期
            });
            JSON.parse(JSON.stringify(res))[0].tokens = token;
            var data = JSON.parse(JSON.stringify(res))[0];
            data.token = token;
            res_app.send(rdata(0,data,'登录成功'));
        }
       // console.log(JSON.parse(JSON.stringify(res)))
    })
    
    //connection.end();
}) 
app.post('/index',(req, res_app) => {
    //console.log(req.headers['token'])
    res_app.send("你好");
})

var verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, secretOrPrivateKey ,(error, decoded) => {
            if (error) {
              console.log('error:'+error.message)
              return
            }
            console.log(decoded)
          });
        resolve(info);
    })
}


var server = app.listen(8001, function () {
    console.log(server.address())
    console.log("应用实例，访问地址为")
}) 