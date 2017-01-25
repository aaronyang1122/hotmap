'use strict';

const URL = require('url');
const FS = require('fs');
const PATH = require('path');
const types = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

var _data = []

const toQueryParams = function () { 
	var searchHash = this.split('&'); 
	var ret = {};
	for(var i = 0, len = searchHash.length; i < len; i++){ //这里可以调用each方法 
		var pair = searchHash[i]; 
		if((pair = pair.split('='))[0]){ 
			var key = decodeURIComponent(pair.shift()); 
			var value = pair.length > 1 ? pair.join('=') : pair[0]; 
			if(value != undefined){ 
				value = parseInt(decodeURIComponent(value)); 
			} 
			if(key in ret){ 
				if(ret[key].constructor != Array){ 
					ret[key] = [ret[key]]; 
				} 
				ret[key].push(value); 
			}else{ 
				ret[key] = value; 
			} 
		} 
	} 
	return ret; 
}

const router = {
	pic: function (req, res) {
		let query = URL.parse(req.url).query;
		let _currentDate = new Date();
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		FS.readFile('./assets/data.json', 'utf8', function readFileCallback(err, data){
	    if (err){
	      console.log(err);
	    } else {
	    		_data = (data !== '') ? JSON.parse(data) : _data;
	    		if (req.headers.referer !== undefined) {
	    			let _o = Object.assign({
	    				referer: req.headers.referer,
	    				useragent: req.headers['user-agent'],
	    				time: _currentDate.getTime()
	    			}, toQueryParams.call(query))
	    			_data.push(_o)
	    			FS.writeFile('./assets/data.json', JSON.stringify(_data), 'utf8'); // write it back 
	    		}
			}
	  });
		
		console.log('\n' + 
								'====================================================================' + 
								'\n' + 
								'requestQuery: ' + query +'\n' + 
								'requestReferer: ' + req.headers.referer + '\n' + 
								'requestUserAgent: ' + req.headers['user-agent'] + '\n' + 
								'date: ' + _currentDate.getTime() + '\n' +
								'====================================================================' + 
								'\n')
		res.end();
	},
	assets: function (req, res) {
		let pathname = '.' + URL.parse(req.url).pathname;
		let ext = PATH.parse(pathname).ext;
		ext = ext ? ext.slice(1) : 'unknown';
		let contentType = types[ext] || "text/plain";
		
		FS.exists(pathname, function (exists) {
			if (!exists) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("This request URL " + pathname + " was not found on this server.");
        res.end();
      } else {
      	FS.readFile(pathname, "binary", function(err, file) {
			    if (err) {
		        res.writeHead(500, {'Content-Type': 'text/plain'});
		        res.end(err);
			    } else {
		        res.writeHead(200, {'Content-Type': contentType});
		        res.write(file, "binary");
		        res.end();
			    }
			 	});
      }
		});
	}
}

module.exports = router;
