'use strict';

const FS = require('fs');
const express = require('express');
const UA = require('ua-device');
const phantom = require('phantom');
const router = express.Router();

var _data = [];

router.get('/pic', function (req, res) {
	let _currentDate = new Date();
	FS.readFile('./data/data.json', 'utf8', function (err, data) {
	  if (err){
	    console.log(err);
	  } else {
	  		_data = (data !== '') ? JSON.parse(data) : _data;
	  		if (req.get('Referrer') !== undefined) {
	  			let _o = Object.assign({
	  				referer: req.get('Referrer'),
	  				useragent: req.get('user-agent'),
	  				device: new UA(req.get('user-agent')),
	  				host: req.hostname,
	  				originalurl: req.originalUrl,
	  				path: req.path,
	  				baseurl: req.baseUrl,
	  				time: _currentDate.getTime()
	  			}, req.query)
	  			_data.push(_o)
	  			FS.writeFile('./data/data.json', JSON.stringify(_data), 'utf8'); // write it back
	  			// print
	  			console.log('\n' + 
											'====================================================================' + 
											'\n' + 
											'requestQuery: ' + JSON.stringify(req.query) +'\n' + 
											'requestReferer: ' + req.get('Referrer') + '\n' + 
											'requestUserAgent: ' + req.get('user-agent') + '\n' + 
											'date: ' + _currentDate.getTime() + '\n' +
											'====================================================================' + 
											'\n')
	  		}
		}
	});
	res.type('png');
	res.status(200).end();
})

router.get('/hotmapdata', function (req, res) {
	FS.readFile('./data/data.json', 'utf8', function (err, data) {
	  if (err){
	    console.log(err);
	    res.status(500).send({ error: 'something error' });
	  } else {
  		res.send((data !== '') ? JSON.parse(data) : _data);
		}
	});
})

router.get('/screenshot', function (req, res) {
  phantom.create().then(function (ph) {
    ph.createPage().then(function (page) {
      page.setting('userAgent', 'foo app');
      page.open('http://phantomjs.org/screen-capture.html').then(function (status) {
//      res.json({
//          pageStatus: status
//      });
				page.render('./phantomjs.png');
        page.close();
        ph.exit();
        res.status(200).end();
      });
    });
  });
})

//const router = {
//	pic: function (req, res) {
//		let query = URL.parse(req.url).query;
//		let _currentDate = new Date();
//		res.writeHead(200, {'Content-Type': 'image/jpeg'});
//		FS.readFile('./assets/data.json', 'utf8', function readFileCallback(err, data){
//	    if (err){
//	      console.log(err);
//	    } else {
//	    		_data = (data !== '') ? JSON.parse(data) : _data;
//	    		if (req.headers.referer !== undefined) {
//	    			let _o = Object.assign({
//	    				referer: req.headers.referer,
//	    				useragent: req.headers['user-agent'],
//	    				time: _currentDate.getTime()
//	    			}, toQueryParams.call(query))
//	    			_data.push(_o)
//	    			FS.writeFile('./assets/data.json', JSON.stringify(_data), 'utf8'); // write it back 
//	    		}
//			}
//	  });
//		
//		console.log('\n' + 
//								'====================================================================' + 
//								'\n' + 
//								'requestQuery: ' + query +'\n' + 
//								'requestReferer: ' + req.headers.referer + '\n' + 
//								'requestUserAgent: ' + req.headers['user-agent'] + '\n' + 
//								'date: ' + _currentDate.getTime() + '\n' +
//								'====================================================================' + 
//								'\n')
//		res.end();
//	},
//	assets: function (req, res) {
//		let pathname = '.' + URL.parse(req.url).pathname;
//		let ext = PATH.parse(pathname).ext;
//		ext = ext ? ext.slice(1) : 'unknown';
//		let contentType = types[ext] || "text/plain";
//		
//		FS.exists(pathname, function (exists) {
//			if (!exists) {
//      res.writeHead(404, {'Content-Type': 'text/plain'});
//      res.write("This request URL " + pathname + " was not found on this server.");
//      res.end();
//    } else {
//    	FS.readFile(pathname, "binary", function(err, file) {
//			    if (err) {
//		        res.writeHead(500, {'Content-Type': 'text/plain'});
//		        res.end(err);
//			    } else {
//		        res.writeHead(200, {'Content-Type': contentType});
//		        res.write(file, "binary");
//		        res.end();
//			    }
//			 	});
//    }
//		});
//	}
//}

module.exports = router;
