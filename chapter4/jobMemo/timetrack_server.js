//启动文件
var http =require('http');
var mysql=require('mysql');
var work=require('./lib/timetrack');

var db=mysql.createConnection({
	host:'127.0.0.1',
	user:'root',
	password:'1234',
	database:'timetrack'
});

//HTTP请求路由
var server=http.createServer(function(req,res){
	switch(req.method){
		case 'POST':
			switch(req.url){
				case '/':
					work.add(db,req,res);
					break;
				case '/archive':
					work.archive(db,req,res);
					break;
				case '/delete':
					work.delete(db,req,res);
					break;
			}
			break;
		case 'GET':
			switch(req.url){
				case '/':
					work.show(db,res);
					break;
				case '/archived':
					work.showArchived(db,res);
					break;
			}
			break;
	}
});

//创建数据表，所有的node-mysql查询都用 query 函数执行。
db.query(
	"CREATE TABLE  IF NOT EXISTS work ("
	+" id INT(10) NOT NULL AUTO_INCREMENT, "
	+"hours DECIMAL(5,2) DEFAULT 0, "
	+"dateTime DATE, "
	+"archived INT(1) DEFAULT 0, "
	+"description LONGTEXT, "
	+"PRIMARY KEY(id))",
	function(err){
		if(err) throw err;
		console.log('Server Started....');
		server.listen(3000,'127.0.0.1');
	}
);

//npm 官网查看api
// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '1234',
//   database : 'timetrack'
// });
 
// connection.connect();
 
// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;
 
//   console.log('The solution is: ', rows[0].solution);
// });
 
// connection.end();

