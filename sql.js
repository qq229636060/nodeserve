var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'zll1987120',
  database : 'use'
});
module.exports = connection