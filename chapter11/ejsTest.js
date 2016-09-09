var ejs=require('ejs');

var template='<%=message %>';

var context={message:'Hello Ejs'};
console.log(ejs.render(template,context));

//字符转义：EJS会转义上下文值中的所有特殊字符，将它们替换为HTML实体码

//var context={'message':"<script>alert('XSS Attack!');</script>"};
//console.log(ejs.render(template,context));//&lt;script&gt;alert(&#39;XSS Attack!&#39;);&lt;/script&gt;


//定制符号
//ejs.open='{{:';
//ejs.close='}}:'

//用EJS过滤器处理模板数据,为了表明你正在用过滤器，要在EJS的开始标签中添加一个冒号（ : ） 
//  <%=: 是用在转义的EJS输出上的过滤器。
//  <%-: 是用在非转义的EJS输出上的过滤器
//var temp1='<%=:movies|last%>';
//var movies={'movies':[
//	'Blabla',
//	'Babe',
//	'Real World'
//]};

//console.log(ejs.render(temp1,movies));