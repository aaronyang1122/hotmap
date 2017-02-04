'use strict';

//const HTTP = require('http');
//const URL = require('url');
//const ROUTER = require('./router.js');
const PORT = 9000;
const path = require('path');
const express = require('express');
const router = require('./router.js');
const app = express();

app.use(express.static(path.join(__dirname, '../assets')));
app.use('/', router);

app.listen(PORT);

console.log('Server running at 127.0.0.1:' + PORT);

//HTTP.createServer(function (request, response){
//	if (request.url !== '/favicon.ico') {
//		// 获取路径
//		let pathname = URL.parse(request.url).pathname;
//		pathname = pathname.match(/\w+/)[0];
//		// router
//		if (ROUTER.hasOwnProperty(pathname)) {
//			ROUTER[pathname](request, response);
//		} else {
//			// 不在路由表里返回404
//			response.writeHead(404, {'Content-Type': 'text/plain'});
//    response.write("This request URL " + pathname + " was not found on this server.");
//    response.end();			
//		}
//	} else {
//		response.end();
//	}
//}).listen(PORT);

