var SSH = require('simple-ssh');
var bodyParser = require('body-parser') 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(bodyParser.urlencoded({ extended: false })); 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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

function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

    // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      var result = response.output.text[0];
  console.log(result);
  io.sockets.emit('message',{message:  result});
  


// start all conditions
    
    if( result.search('Running IW Notification') > -1 ){
        console.log("Running IW Notifications");
        var interval = setInterval(function() {
        var IWret = shellExec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS');
        console.log(IWret);
        if(IWret==0){
        console.log(IWret);
        io.sockets.emit('message',{message: "IW Notification Workflow completed"});
        }
        if(IWret != 0) {
          clearInterval(interval);
        }
    }, 5000);
    }


// do not delete the below closed braces
}
}


function shellExec(stdoput){
ssh.exec(stdoput, {  
out: function(stdout) {
console.log(stdout);       
// io.sockets.emit('message',{message: stdout});
return stdoput;
}}).start();
}



http.listen(8199, function(){
  console.log('listening on *:8199');
});