//Connect的cookie解析器支持常规cookie、签名cookie和特殊的JSON cookie,默认常规cookie.
//如果你想支持 session() 中间件要求的签名cookie，在创建 cookieParser() 实例时要传入一个加密用的字符串.]

var connect=require('connect');
var cookieParser=require('cookie-parser');
//原本connect的内置中间件被分离出来，不依赖connect也能够work。要使用cookieParser组件，还需cmd运行
//	npm install cookie-parser


var app=connect().use(cookieParser('Evan is a good man')).use(function(req,res){
	console.log(req.cookies);
	console.log(req.signedCookies);
	res.end('Hello Node.js');
}).listen(3000);