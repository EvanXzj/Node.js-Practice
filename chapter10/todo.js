function ToDo(){
	this.todos=[];
}

//添加事项
ToDo.prototype.add = function(item) {
	if(!item) throw new Error('ToDo#add requires an item');

	this.todos.push(item);
};

//删除全部事项
ToDo.prototype.deleteAll=function(){
	this.todos=[];
};

//获取事项数目
ToDo.prototype.getCount=function(){
	return this.todos.length;
};

//两秒后带着 "true" 调用回调
ToDo.prototype.doAsync=function(callback){
	setTimeout(callback,2000,true);
};

module.exports=ToDo;