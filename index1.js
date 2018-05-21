// var app = require('express')();
// var http = require('http').Server(app);

// // app.get('/', function(req, res){
// //   res.send('<h1>Hello world</h1>');
// // });

// app.get('/', function(req, res){
// res.sendFile(__dirname + '/index.html');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

// var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');
// **************************************************************************************************************

// var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
// var fs = require('fs');

// var speechToText = new SpeechToTextV1({
//   username: 'c8f70bca-916f-47cf-964e-f11ba9124ed7',
//   password: 'x6hFxhGPZni4',
//   url: 'https://stream.watsonplatform.net/speech-to-text/api/'
// });

// var params = {
//   content_type: 'audio/wav'
// };

// // create the stream
// var recognizeStream = speechToText.createRecognizeStream(params);

// // pipe in some audio
// fs.createReadStream(__dirname + '/resources/speech.wav').pipe(recognizeStream);

// // and pipe out the transcription
// recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

// // listen for 'data' events for just the final text
// // listen for 'results' events to get the raw JSON with interim results, timings, etc.

// recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events

// ['data', 'results', 'speaker_labels', 'error', 'close'].forEach(function(
//   eventName
// ) {
//   recognizeStream.on(
//     eventName,
//     console.log.bind(console, eventName + ' event: ')
//   );
// });

// ***************************************************************************************************************
var SSH = require('simple-ssh');
// var s = app.listen(port);
// var io = require('socket.io').listen(server);
// var io = require('socket.io') 
var bodyParser = require('body-parser') 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var io = require('socket.io').listen(server);
app.use(bodyParser.urlencoded({ extended: false })); 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
// .listen(app.listen(port));
var ssh = new SSH({
    host: 'sacsun59',
    user: 'pdmschd',
    pass: 'Ftt@sacsun59'
});
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: 'ae07e8c0-d011-43d8-80e6-fe0089167013', // replace with service username
  password: 'YLg7T5g58ocZ', // replace with service password
  version_date: '2018-02-15'
});

var workspace_id = 'adad526c-5827-4580-a150-660702a54984'; // replace with workspace ID
// var self = this.io;
// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id
  }, processResponse);

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'Welcome!!' });
	socket.on('send', function (data) {
    io.sockets.emit('message', data);
    console.log(data);
    conversation.message({
    workspace_id: workspace_id,
    input: { text: data.message }
    }, processResponse)
	});
}); 

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
       io.sockets.emit('message',{message:  response.output.text[0]});
      var result = response.output.text[0]
      if( result.search('Running IW Notification') > -1 ){
          console.log("test if");
          ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', {  
          out: function(stdout) {
          // setTimeout(stdout, 3000);
        console.log(stdout);
        if(stdout==0){
        io.sockets.emit('message',{message: "IW Notification Workflow completed"});
        }
        // io.sockets.emit('message',{message: stdout});
    }
}).start();
      }
      else if( result.search('Running PIE application') > -1 ){
          console.log("test if");
          ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_PIE_Monthly_Risk', {  
          out: function(stdout) {
        console.log(stdout);
        if(stdout==0){
        io.sockets.emit('message',{message: "PIE Risk Workflow completed"});
        }
        // io.sockets.emit('message',{message: stdout});
    }
}).start();
      }
  }
}


app.post('/api', function(req, res){
//   res.sendFile(__dirname + '/index.html');
console.log(req.body)
conversation.message({
    workspace_id: workspace_id,
    input: { text: req.body.msg }
    }, processResponse)
});


// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });
http.listen(3200, function(){
  console.log('listening on *:3200');
});