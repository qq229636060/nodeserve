const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
var connection = require("./sql.js");
var rdata = require("./returndata.js");
var jwt = require('jsonwebtoken')
var request = require('request');
let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
app.use((req,res_app,next) =>{
    var token = req.headers['token'];
    if(req.path == '/login'){
        return next()
    }
    if(token == undefined){
          res_app.send(rdata(-200,'','登录超时！请重新登录'));
          return false;
      }else{
          verToken(token).then((data)=> {
              console.log(data)
              req.data = data;
              return next();
          }).catch((error)=>{
            　　　　res_app.send(rdata(-200,'','登录超时！请重新登录'));
                   return false;
          })
      }
})
// request('http://m21.filmfly.cn/c3/cinema/seats?planId=509816062', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       console.log(body) // 请求成功的处理逻辑
//     }
//   });

//登录提交
app.post('/login',(req, res_app) => {
    //console.log(req.query.useid)
    //console.log(req.query.password)
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
            res_app.send(rdata(-1,JSON.parse(JSON.stringify(res)),'用户名或密码错误'));
        }else{
            let content ={name:req.query.useid}; // 要生成token的主题信息
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60*60  // 1小时过期
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


app.get('/index',(req, res_app) => {
    var sql_order = "select * from content";
    connection.query(sql_order,function(err,res,next){
        if(err){
            console.log(err)
        }else{
            res_app.send(rdata(0,res,""));
        }
    })
    
})

app.post('/user',(req, res_app) => {
    //console.log(req.data)
    res_app.send(rdata(0,req.data,''));
})

app.post('/editpassword',(req,res_app)=>{
    debugger;
    console.log('a'+req.data)
    var sql_order = "select * from useinfo WHERE usename = " + req.data.name;
    var sql_editpw = "UPDATE useinfo SET password='"+ req.query.npw +"' WHERE usename = "+ req.data.name
    connection.query(sql_order,function(err,res,next){
        if(err){
            console.log(err)
        }else{
            if(req.query.opw == JSON.parse(JSON.stringify(res))[0].password){
                connection.query(sql_editpw,function(err,res,next){
                    if(err){
                        res_app.send(err)
                    }else{
                        res_app.send(rdata(0,res,'修改密码成功'));
                    }
                })
            }else{
                res_app.send(rdata(-1,'','旧密码不正确')); 
            }
        }
    })
})

var verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token, secretOrPrivateKey ,(error, decoded) => {
            if (error) {
              console.log('error:'+error.message)
              return res.send(rdata(-200,'',error.message));
            }else{
                return decoded
            }
          });
        resolve(info);
    })
}


var server = app.listen(8999, function () {
    console.log(server.address())
    console.log("应用实例，访问地址为")
}) 