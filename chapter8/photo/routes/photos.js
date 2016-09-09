var Photo=require('../models/Photo');
var fs=require('fs');
var path=require('path');
var join=path.join;

exports.listPhoto=function(req,res,next){
	Photo.find({},function(err,photos){
		if (err) return next(err);

		//console.log('photos:'+photos);
		res.render('photos',{
			title:'Photos',
			photos:photos
		});
	});
};

exports.form=function(req,res){
	res.render('photos/upload',{title:'Photo Upload'});
};

exports.submit=function(dir){
	return function(req,res,next){
		//console.log(dir);
		//console.log(req.files);
		//console.log(req.body);
		var img=req.files.photo.image;
		//console.log('img:'+img);
		var name=req.body.photo.name||img.name;
		//console.log('name:'+name);
		var path=join(dir,img.name);
		//console.log('path:'+path);

		//rename and transfer
		fs.rename(img.path,path,function(err){//rename(tem_name,target_name,next)
			if(err) throw err;

			Photo.create({
				name:name,
				path:img.name
			},function(err){
				if (err) throw err;

				res.redirect('/');
			});
		});
	};
};

exports.download=function(dir){
	return function(req,res,next){
		var id=req.params.id;
		Photo.findById(id,function(err,photo){//查找文件
			if(err) throw err;

			var path=join(dir,photo.path);//构造指向文件的绝对路径

			//res.sendfile(path);
			res.download(path,photo.name+'.jpeg');//download(path [,newFileName]),下载时newFileName替换文件原始名称
		});
	};
};