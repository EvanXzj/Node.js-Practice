function divEscapedContentElement(message){
	return $('<div></div>').text(message);
}

function divSystemContentElement(message){
	return $('<div></div>').html('<i>'+message+'</i>');
}

function processUserInput(chatApp,socket){
	var message=$("#send-message").val();

	var systemMessage;

	if(message.charAt(0)=='/'){//命令
		systemMessage=chatApp.processCommand(message);
		if(systemMessage){
			$("#messages").append(divSystemContentElement(systemMessage));
		}
	}else{
		chatApp.sendMessage($("#room").text(),message);//发送信息给其他用户
		$("#messages").append(divEscapedContentElement(message));//当前界面显示自己输入的信息
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	}

	//清空发送信息框
	$("#send-message").val('');
}

var socket=io.connect();//连接服务端

$(document).ready(function(){
	var chatApp=new Chat(socket);

	//监听修改昵称结果
	socket.on('nameResult',function(result){
		if(result.success){
			message ="Your are now known as "+result.name+'.';
		}else{
			message =result.message;
		}
		$('#messages').append(divSystemContentElement(message));
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	});

	//监听变更房间结果
	socket.on('joinResult',function(result){
		$("#room").text(result.room);
		$("#messages").append(divSystemContentElement("Room Changed"));
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	});
	//监听信息
	socket.on('message',function(message){
		var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();

		var newElement=divEscapedContentElement('['+year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second+'] '+message.text);
		$("#messages").append(newElement);
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	});

	//显示房间列表
	socket.on('rooms',function(allRooms){
		$("#room-list").empty();

		for(var  room in allRooms.rooms){
			var room=room.substring(1,room.length);
			if(room !='');{
				var newElement= $('<div id="'+room+'"></div>').html(room);

				$("#room-list").append(newElement);
				if(room == allRooms.currentRoom){
					$('#'+room).css('background-color','yellow');
				}	
			}
		}

		$("#room-list div").click(function(){
			chatApp.processCommand('/join '+$(this).text());

			$("#send-message").focus();
		});
	});

	//定时请求房间列表
	setInterval(function(){
		socket.emit('rooms');
	},1000);//1s

	$("#send-form").submit(function(){
		processUserInput(chatApp,socket);

		return false; //防止表单提交的默认行为
	});
});
