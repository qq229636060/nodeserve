const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
var connection = require("./sql.js");
var rdata = require("./returndata.js");

//登录提交
app.post('/login',(req, res_app) => {
    console.log(req.query.useid);
    console.log(req.query.password);
    var sql_order = "select * from useinfo WHERE usename = '" + req.query.useid + "' AND `password` = '" + req.query.password+"'"
    console.log(sql_order)
    connection.query(sql_order,function(err,res,next){
        console.log(err);
        if(err){
            console.log('err:'+err)
            res_app.send(err)
        }else if(res.length == 0){
            console.log('res:'+JSON.parse(JSON.stringify(res)))
            res_app.send(rdata(-1,JSON.parse(JSON.stringify(res)),'用户名或密码错误'));
        }else{
            res_app.send(rdata(0,JSON.parse(JSON.stringify(res)),'登录成功'));
        }
       // console.log(JSON.parse(JSON.stringify(res)))
    })
    
    //connection.end();
}) 
var server = app.listen(8001, function () {
    console.log(server.address())
    console.log("应用实例，访问地址为")
})