var http=require('http');

var server=http.createServer(function(req,res){
	//默认状态码为200
	//----1
	//res.write('Hello Node.js');
	//res.end();

	//----2
	// var body="Hello Node.js";
	// res.setHeader('Content-Length',body.length);
	// res.setHeader('Content-Type','text/plain');
	// res.end(body);

	//----3
	var url='http://www.baidu.com';
	var body='<p>Redirecting to <a href="'+url+'">'+url +'</a></p>';
	//res.setHeader('Location',url);
	res.setHeader('Content-Length',body.length);
	res.setHeader('Content-Type','text/html');
	res.statusCode=302;

	res.end(body);
});

server.listen(3000);