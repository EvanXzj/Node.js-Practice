var http=require('http');
var querystring=require('querystring');

var items=[];

var server=http.createServer(function(req,res){
	if(req.url=='/'){
		switch(req.method){
			case 'GET':
				show(res);
				break;
			case 'POST':
				add(req,res);
				break;
			default:
				badRequest(res);
		}
	}else{
		notFound(res);
	}
});

server.listen(3000);

function show(res){
	var html='<html><head><title>ToDO-List</title><style type="text/css">li:hover{background-color:yellow;}</style></head><body>'+
			'<h1>ToDO-List</h1>'+
			'<ul>'+
			items.map(function(item,index){
				return '<li id="'+index+'">'+item+'</li>';
			}).join('')+
			'</ul>'+
			'<form actio="/" method="post">'+
			'<p><input type="text" name="item" /></p>'+
			'<p><input type="submit" value="Add Item" /></p>'+
			'</form></body></html>';
	res.setHeader('Content-Type','text/html');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
}

function badRequest(res){
	res.statusCode=400;
	res.setHeader('Content-Type','text/plain');
	res.end('400 Bad Found');
}


function notFound(res){
	res.statusCode=404;
	res.setHeader('Content-Type','text/plain');
	res.end('404 Not Found');
}

function add(req,res){
	var body='';
	req.setEncoding('utf8');
	req.on('data',function(chunk){
		body+=chunk;
	});
	req.on('end',function(){
		console.log(body);
		var obj=querystring.parse(body);

		console.log(obj);
		items.push(obj.item);
		console.log(items);
		show(res);
	});
}