var http=require('http');
var fs=require('fs');
var path=require('path');
var mime=require('mime');

var chatServer=require('./lib/chat_server');


var cache={};//用来缓存文件内容的对象

//404 Not Found 响应
function send404(res){
	res.writeHead(404,{"Content-Type":"text/plain"});
	res.write('Error 404: Resource not found');
	res.end();//结束响应，不然客户端看不到任何内容
}

//发送文件到客户端
function sendFile(res,filePath,fileContents){
	res.writeHead(200,{"Content-Type":mime.lookup(path.basename(filePath))});
	res.end(fileContents);//发送文件内容
}

//检查文件是否缓存了
function serverStatic(res,cache,absPath){
	if(cache[absPath]){//文件有缓存

		sendFile(res,absPath,cache[absPath]);

	}else{
		fs.exists(absPath,function(exists){
			if(exists){//文件存在
				fs.readFile(absPath,function(err,data){
					if(err){
						send404(res);
					}else{
						cache[absPath]=data;//添加文件缓存
						sendFile(res,absPath,data);//调用文件发送方法
					}
				});
			}else{
				send404(res);//文件不存在
			}
		});
	}
}

var server=http.createServer(function(req,res){
	var filepath='';
	if(req.url=='/'){
		filepath='public/index.html';
	}else{
		filepath='public'+req.url;
	}
	var absPath='./'+filepath;//转化为相对路径

	serverStatic(res,cache,absPath);//返回静态文件
});

server.listen(3000,function(){
	console.log('Server running at http://127.0.0.1:3000');
});

chatServer.listen(server);//跟HTTP服务器共享同一个TCP/IP端口