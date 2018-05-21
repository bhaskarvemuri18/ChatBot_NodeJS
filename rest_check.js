//   var request = require('request')
//   request(
//     { method: 'GET'
//     , uri: 'http://www.google.com'
//     , gzip: true
//     }
//   , function (error, response, body) {
//       // body is the decompressed response body
//       console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
//       console.log('the decoded data is: ' + body)
//     }
//   )
//   .on('data', function(data) {
//     // decompressed data as it is received
//     console.log('decoded chunk: ' + data)
//   })
//   .on('response', function(response) {
//     // unmodified http.IncomingMessage object
//     response.on('data', function(data) {
//       // compressed data as it is received
//       console.log('received ' + data.length + ' bytes of compressed data')
//     })
//   })

// var startTime = (new Date()).getTime(),
//     endTime;

// $.ajax({
//     type:'GET',
//     url: 'http://mysite.net/speedtest',
//     async: false,
//     success : function() {
//         endTime = (new Date()).getTime();
//     }
// });

// alert('Took ' + (endTime - startTime) + 'ms');


var http = require('http');
var start = new Date();
// http.get({host: 'risingstack.com', port: 80}, function(res) {
http.get({host: 'stageglobaldataservices.noam.corp.frk.com', 
path:'/xml/product/ProductDetails?AppID=IW&Country=SG&Language=en_GB&FundID=21374', 
method: 'GET' }, function(res) {
    console.log('Request took:', new Date() - start, 'ms');
});




// var http = require('http');
// var start = new Date();
// // http.get({host: 'risingstack.com', port: 80}, function(res) {
// http.get({host: 'stageglobaldataservices.noam.corp.frk.com/xml/product/ProductDetails?AppID=IW&Country=SG&Language=en_GB&FundID=21374', 
// method: 'GET' }, function(res) {
//     console.log('Request took:', new Date() - start, 'ms');
// });



// var express = require('express')
// var responseTime = require('response-time')
 
// var app = express()
 
// app.use(responseTime())
 
// app.get('/', function (req, res) {
//   res.send('hello, world!')
// })


// const request = require('request')

// request({
//   uri: 'https://risingstack.com',
//   method: 'GET',
//   time: true
// }, (err, resp) => {
//   console.log(err || resp.timings)
// })