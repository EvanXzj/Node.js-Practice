var Chat=function(socket){
	this.socket=socket;
}

//客户端发送信息
Chat.prototype.sendMessage=function(room,text){
	var message={
		room:room,
		text:text
	};

	this.socket.emit('message',message);
}

//变更房间
Chat.prototype.roomChange=function(room){
	this.socket.emit('join',{
		newRoom:room
	});
}

//处理聊天命令
Chat.prototype.processCommand=function(command){
	var words=command.split(' ');
	console.log('words[0]: '+words[0]);
	var command=words[0].substring(1,words[0].length).toLowerCase();//substring 从零开始  stringObject.substring(start,stop)

	var message=false;//命令处理结果

	switch(command){
		case 'join':
			words.shift();
			console.log('words: '+words);
			var room=words.join(' ');
			console.log('room: '+room);
			this.roomChange(room);
			break;
		case 'nick':
			words.shift();
			console.log('words: '+words);
			var name=words.join(' ');
			console.log('name: '+name);
			this.socket.emit('nameAttempt',name);
			break;
		default:
			message="Unrecognized Command";
			break;
	}

	return message;
}