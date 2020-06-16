const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
var connection = require("./sql.js");
var rdata = require("./returndata.js");
var jwt = require('jsonwebtoken')

//登录提交
app.post('/login',(req, res_app) => {
    var sql_order = "select * from useinfo WHERE usename = '" + req.query.useid + "' AND `password` = '" + req.query.password+"'"
    connection.query(sql_order,function(err,res,next){
        if(err){
            console.log('err:'+err)
            res_app.send(err)
        }else if(res.length == 0){
            console.log('res:'+JSON.parse(JSON.stringify(res)))
            res_app.send(rdata(-1,JSON.parse(JSON.stringify(res)),'用户名或密码错误'));
        }else{
            let content ={name:req.body.name}; // 要生成token的主题信息
            let secretOrPrivateKey="jwt";// 这是加密的key（密钥）
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
    res_app.send("你好");
})
var server = app.listen(8001, function () {
    console.log(server.address())
    console.log("应用实例，访问地址为")
})