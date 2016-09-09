var net=require('net');

net.createServer(function(socket){
	socket.write('Hello World\r\n');
	socket.end();
}).listen(3000);
