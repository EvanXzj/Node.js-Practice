var fs=require('fs');
var http=require('http');

function getEntries(){
	var enteries=[];
	var entriesRow=fs.readFileSync('./enteries.txt','utf8');//同步读取

	entriesRow=entriesRow.split('---');

	entriesRow.map(function (entryRow){
		var entry={};
		var lines=entryRow.split("\n");

		lines.map(function(line){
			if(line.indexOf('title:')===0){
				entry.title=line.replace('title:','');
			}else if(line.indexOf('date:')===0){
				entry.date=line.replace('date:','');
			}else{
				entry.body=entry.body||'';
				entry.body+=line;
			}
		});
		enteries.push(entry);
	});
	return enteries;
}

var enteries=getEntries();
console.log(enteries);

//生成html
function blogPage(enteries){
	var outputHtml='<html>'+
					'<head>'+
					'<style type="text/css">'+
					'.entry_title {font-weight:bold;}'+
					'.entry_date {font-style:italic;}'+
					'.entry_body {margin-bottom:1em;}'+
					'</style>'+
					'</head>'+
					'<body>';
	enteries.map(function(entry){
		outputHtml+='<div class="entry_title">'+entry.title+'</div>\n'+
					'<div class="entry_date">'+entry.date+'</div>\n'+
					'<div class=entry_body>'+entry.body+'</div>\n';
	});

	outputHtml+='</body></html>';
	return outputHtml;
}

var server=http.createServer(function(req,res){
	var outputHtml=blogPage(enteries);

	res.writeHeader(200,{'Conten-type':'text/html'});
	res.end(outputHtml);
});

server.listen(3000,function(){
	console.log('Server running at http://127.0.0.1:3000');
});