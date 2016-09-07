var connect=require('connect');
var fs=require('fs');

var app=connect();

//app.use(sayHello);
app.use(logger);//在程序中使用中间件,可以调用.use()方法，把中间件函数传给它,use的顺序对程序也有影响
app.use('/user',admin);//挂载：只有url完全匹配时才会调用后面的中间件（admin中直接结束响应了，所以下面的sayHello中间件不会执行了）
app.use(sayHello);



app.listen(3000);

function logger(req,res,next){//在logger.txt 写入请求的一些信息
	fs.writeFile('logger.txt',req.method+' || '+req.url,function(err){
		if(err) throw err;
		console.log('Write Log Success !');
	});
	next();//转移控制权给下一个相关的组件
}	

//当一个组件不调用 next() 时，命令链中的后续中间件都不会被调用
function sayHello(req,res){
	res.setHeader('Content-Type','text/plain');
	res.end('Hello Node.js');
}

function admin(req,res){
	if(req.url=='/'){//url=http://127.0.0.1:3000/user  挂载会自动去掉前缀/user
		res.setHeader('Content-Type','text/plain');
		res.end('Hello Aministrator');
	}else if(req.url=='/admin'){
		//url=http://127.0.0.1:3000/user  挂载会自动去掉前缀/user
		res.setHeader('Content-Type','text/plain');
		res.end('Hello Admin');
	}

	//for test
	//console.log('admin function processed');
	//next();
}