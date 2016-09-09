var jade=require('jade');
var temp='strong #{message}';

var temp1='a(href=url) link to Node.js';

var context={message:'Hello Jade'};
var context1={url:'http://nodejs.org'}

//模板先被编译成函数，然后带着上下文调用它，以便渲染HTML输出
var fn=jade.compile(temp);
var fn1=jade.compile(temp1);

console.log(fn(context));
console.log(fn1(context1));