var socketio=require('socket.io');

var io;
var guestNumber=1;
var nickNames={};
var nameUsed=[];
var currentRoom={};

exports.listen=function(server){
	io=socketio.listen(server);

	io.set('log level',1);

	io.sockets.on('connection',function(socket){
		guestNumber=assignGuestNumber(socket,guestNumber,nickNames,nameUsed);//客户连接进来赋值一个访客名

		joinRoom(socket,'Lobby');//第一次连接时进入lobby大厅

		//处理用户的信息，更名，变更房间
		handleMessageBroadcasting(socket);
		handleNameChangeAttempts(socket,nickNames,nameUsed);
		handleRoomJoining(socket);

		//用户发出请求时，显示聊天室列表
		socket.on('rooms',function(){
			socket.emit('rooms',{rooms:io.sockets.manager.rooms,currentRoom:currentRoom[socket.id]});
		});

		//用户离开后的清理逻辑
		handelClientDisconnection(socket,nickNames,nameUsed);
	});
}

//分配用户名称
function assignGuestNumber(socket,guestNumber,nickNames,nameUsed){
	var name='Guest'+guestNumber;//生成新名称
	nickNames[socket.id]=name;
	socket.emit('nameResult',{//让用户知道他们的名称
		success:true,
		name:name
	});

	nameUsed.push(name);//存在已占用的名称

	return guestNumber+1;//+1
}

//进入聊天室
function joinRoom(socket,room){
	socket.join(room);
	currentRoom[socket.id]=room;
	socket.emit('joinResult',{room:room});//告诉用户进入了新的房间

	//通知房间的其他用户新用户进入
	socket.broadcast.to(room).emit('message',{
		text:nickNames[socket.id]+' has joined '+room+'.'
	});

	//将房间的用户汇总发送给用户
	var usersInRoom=io.sockets.clients(room);

	//console.log(usersInRoom);//查看结构用

	if(usersInRoom.length>1){
		var usersInRoomSummary='Currently user in '+room+' : ';
		for (var index in usersInRoom){
			var userSocketId=usersInRoom[index].id;
			if(userSocketId !=socket.id){//不是当前用户
				if(index>0){//index=0时不用加逗号（第一个用户之前）
					usersInRoomSummary +=',';
				}
				usersInRoomSummary +=nickNames[userSocketId];
			}
		}
		usersInRoomSummary +='.';
		socket.emit('message',{text:usersInRoomSummary});
	}
}

//昵称变更
function handleNameChangeAttempts(socket,nickNames,nameUsed){
	socket.on('nameAttempt',function(name){
		if(name.indexOf('Guest')==0){
			socket.emit('nameResult',{
				success:false,
				message:"NickNames Can Not Begin With \"Guest\" !"
			});
		}else{
			if(nameUsed.indexOf(name)==-1){
				var previousName=nickNames[socket.id];
				var previousNameIndex=nameUsed.indexOf(previousName);

				nameUsed.push(name);
				nickNames[socket.id]=name;

				delete nameUsed[previousNameIndex];//删之前的昵称
				socket.emit('nameResult',{//通知用户自己，昵称变更成功
					success:true,
					name:name
				});
				//通知房间的其他用户，某某已更名为xxx
				socket.broadcast.to(currentRoom[socket.id]).emit('message',{
					text:previousName +' is known as '+ name+' .'
				});
			}else{
				socket.emit('nameResult',{
					success:false,
					message:"That name already in use !"
				});
			}
		}
	});
}

//发送信息
function handleMessageBroadcasting(socket){
	socket.on('message',function(message){
		socket.broadcast.to(message.romm).emit('message',{
			text:nickNames[socket.id]+' : '+message.text
		});
	});
}

//创建房间
function handleRoomJoining(socket){
	socket.on('join',function(room){
		if(currentRoom[socket.id] !=room.newRoom){
			socket.leave(currentRoom[socket.id]);
			socket.broadcast.to(currentRoom[socket.id]).emit('message',{
				text:nickNames[socket.id]+' has left this room.'
			});
			joinRoom(socket,room.newRoom);
		}else{
			var text='Your are already in room: '+currentRoom[socket.id]+'.';
			socket.emit('message',{
				text:text
			});
		}
	});
}

//断开连接,清除一些信息
function handelClientDisconnection(socket){
	socket.on('disconnect',function(){
		var nameIndex=nameUsed.indexOf(nickNames[socket.id]);
		socket.broadcast.to(currentRoom[socket.id]).emit('message',{
			text:nameUsed[nameIndex]+' 离开了当前房间.'
		});
		delete nameUsed[nameIndex];
		delete nickNames[socket.id];
	});
}