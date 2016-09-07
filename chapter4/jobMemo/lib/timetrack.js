var querystring=require('querystring');

exports.sendHtml=function(res,html){//发送HTML响应
	res.setHeader('Content-Type','text/html,charset=utf-8');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
};

//解析HTTP POST数据
exports.parseReceivedData=function(req,cb){
	var body='';
	req.setEncoding('utf8');
	req.on('data',function(chunk){
		body+=chunk;
	});
	console.log('body :'+body);
	req.on('end',function(){
		var data=querystring.parse(body);
		console.log('data :'+data);
		cb(data);
	});
};

//渲染简单的表单
exports.actionForm=function(id,path,label){
	var html='<form method="POST" action="'+path+'">'+
	'<input type="hidden" name="id" value="'+id+'"/>'+
	'<input type="submit" value="'+label+'"/>'+
	'</form>';
	return html;
};

//添加工作记录
exports.add=function(db,req,res){
	exports.parseReceivedData(req,function(work){
		db.query("INSERT INTO work (hours,dateTime,description) VAlUES(?,?,?)",//插入记录
			[work.hours,work.date,work.description],
			function(err){
			if(err) throw err;
			exports.show(db,res);//给用户显示工作记录清单
		});
	});
};

//删除工作记录
exports.delete=function(db,req,res){
	console.log('delete function start....');
	exports.parseReceivedData(req,function(work){
		console.log('[work.id]: '+work.id);
		db.query("DELETE FROM work WHERE id=?",[work.id],function(err){//根据id删除记录
			if(err) throw err;
			exports.show(db,res);
		});
	});
};

//归档一条工作记录
exports.archive=function(db,req,res){
	console.log('archive function start....');
	exports.parseReceivedData(req,function(work){
		console.log('[work.id]: '+work.id);
		db.query('UPDATE work set archived=1 WHERE id=?',[work.id],function(err){
			if(err) throw err;
			exports.show(db,res);
		});
	});
};

//获取工作记录
exports.show=function(db,res,showArchived){
	console.log('show function started');
	var query="select * from work where archived=? order by dateTime desc";
	var archiveValue=(showArchived) ? 1 : 0;
	console.log('archiveValue：'+archiveValue);
	db.query(query,[archiveValue],function(err,rows){//rows 是查询返回的结果
		if(err) throw err;
		var html=(showArchived) ? '' :'<a href="/archived">View Archived Work</a><br />';
		//console.log('rows: '+rows);
		html +=exports.workHitlistHtml(rows);//将查询结果格式化为HTML表格
		if(!showArchived){
			html +=exports.workFormHtml();
		}

		exports.sendHtml(res,html);//给用户发送HTML响应
	}) ;
};
exports.showArchived=function(db,res){
	//console.log('showArchived started .....');
	exports.show(db,res,true);
};


//将工作记录渲染为HTML表格
exports.workHitlistHtml=function(rows){
	var html='<table>';
	for(var i in rows){
		html +='<tr>';
		html +='<td>'+rows[i].dateTime+'</td>';
		html +='<td>'+rows[i].hours+'</td>';
		html +='<td>'+rows[i].description+'</td>';

		if(!rows[i].archived){
			html +='<td>'+exports.workArchiveFrom(rows[i].id)+'</td>';
		}

		html +='<td>'+exports.workDeleteForm(rows[i].id)+'</td>';
		html +='</tr>'
	}
	html +='</table>';
	return html;
};

//用来添加、归档、删除工作记录的HTML表单
exports.workFormHtml=function(){
	var html='<form method="POST" action="/">'+
			'<p>Date (YYYY-MM-DD):<br/><input name="date" type="text" /></p>'+
			'<p>Hours Worked:<br/><input name="hours" type="text" /></p>'+
			'<p>Description:<br />'+
			'<textarea name="description"></textarea></p>'+
			'<input type="submit" value="Add">'+
			'</form>';
		return html;
};

exports.workArchiveFrom=function(id){
	return exports.actionForm(id,'/archive','Archive');
};
exports.workDeleteForm=function(id){
	return exports.actionForm(id,'/delete','Delete');
};