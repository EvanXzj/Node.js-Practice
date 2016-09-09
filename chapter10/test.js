var assert=require('assert');

var ToDo=require('./todo');

var todo=new ToDo();

var testsCompleted=0;

//测试以确保删除后没留下待办事项
function deleteTest(){
	todo.add('item one');
	assert.equal(todo.getCount(),1,'one item should exist');//断言测试添加
	todo.deleteAll();//删除所有事项
	assert.equal(todo.getCount(),0,'No items should exist');//断言测试删除所有事项

	testsCompleted++;//记录测试已完成
}

//测试以确保待办事项添加能用
function addTest(){
	todo.deleteAll();//删除所有事项
	todo.add('add function test');
	assert.notEqual(todo.getCount(),0,'at least one item exist');

	testsCompleted++;
}
//测试看 doAsync 回调传入的是否为 true
function doAsyncTest(callback){
	todo.doAsync(function(value){
		assert.ok(value,'callback should be passed true');

		testsCompleted++;
		callback();//完成后激活回调函数
	});
}

//测试看缺少参数时add是否会抛出错误
function throwsTest(){
	assert.throws(todo.add,/require/);
	testsCompleted++;
}

deleteTest();
addTest();
throwsTest();
doAsyncTest(function(){
	console.log('Completed '+testsCompleted+' tests');
});