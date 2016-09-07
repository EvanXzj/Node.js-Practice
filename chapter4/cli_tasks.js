var fs=require('fs');
var path=require('path');

console.log("process.argv : "+ process.argv);
var args=process.argv.splice(2);//去掉 node cli_tasks.js,只留下参数
console.log('args :'+ args);


var command=args.shift();//取出第一个命令参数
console.log('command :'+ command);

var description=args.join(' ');//合并剩余参数 ，作为描述
console.log('description :'+ description);

//cwd() 是当前执行node命令时候的文件夹地址 
//__dirname 是被执行的js 文件的地址
var cwd = process.cwd();
console.log(cwd);
console.log(__dirname);

var file=path.join(cwd,'.tasks');
console.log('filePath : '+file);

switch(command){
	case 'list':
		listTask(file);//显示任务
		break;
	case 'add':
		addTask(file,description);//增加任务
		break;
	default:
		console.log('Usage: node filename[.js] list|add [taskDescription]');
}

//从文本文件中加载用JSON编码的数据
function getTaskArray(file,cb){
	fs.exists(file,function(exists){
		var tasks=[];
		if(exists){
			fs.readFile(file,'utf-8',function(err,data){
				if(err) throw err;

				var data=data.toString();

				tasks=JSON.parse(data||[]);

				cb(tasks);
			});
		}else{
			cb([]);
		}
	});
}

//显示任务
function listTask(file){
	getTaskArray(file,function(tasks){
		for (var i in tasks){
			//console.log(typeof(i));//string
			console.log('task '+(parseInt(i)+1)+': '+tasks[i]);
		}
	});
}

//把任务保存到磁盘中
function storeTask(file,tasks){
	console.log('tasks : '+tasks);// an array 
	fs.writeFile(file,JSON.stringify(tasks),'utf-8',function(err){
		if(err) throw err;
		console.log('JSON.stringify(tasks): '+JSON.stringify(tasks));
		console.log('Add Task Success');
	});
}

//add a task
function addTask(file,description){
	getTaskArray(file,function(tasks){//读取任务
		tasks.push(description);//压入一个数组内

		storeTask(file,tasks);//写入文件
	});
}