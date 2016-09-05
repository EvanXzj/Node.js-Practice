var http=require('http');
var fs=require('fs');

var server=http.createServer(function(req,res){
	if(req.url=='/'){
		fs.readFile('./titles.json',function(err,data){
			if(err){
				console.log(err);
				res.end('Server Error');
			}else{
				var titles=JSON.parse(data.toString());

				fs.readFile('./title.html',function(err,data){
					if(err){
						console.log(err);
						res.end('Server Error');
					}else{
						var teml=data.toString();

						console.log("titles.join('</li><li>'): "+titles.join('</li><li>'));//test
						var html=teml.replace('%',titles.join('</li><li>'));

						res.writeHead(200,{'Content-Type':'text/html'});
						res.end(html);
					}
				});
			}
		});
	}
});

server.listen(3000,function(){
	console.log('Server running at http://127.0.0.1:3000');
});