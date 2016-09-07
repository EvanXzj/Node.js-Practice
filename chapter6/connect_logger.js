function setup(format){
	var regxp=/:(\w+)/g;
	return function logger(req,res,next){
		var str=format.replace(regxp,function(match,property){
			console.log(match);
			console.log(property);
			return req[property];
		});

		console.log(str);

		next();
	}
}

module.exports=setup;