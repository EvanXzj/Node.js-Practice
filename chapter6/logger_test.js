var connect=require('connect');
var logger=require('./connect_logger');

var app=connect().use(logger(':method :url')).use(sayHello).listen(3000);

function sayHello(req,res){
	res.setHeader('Content-Type','text/plain');
	res.end('Hello Node.js');
}