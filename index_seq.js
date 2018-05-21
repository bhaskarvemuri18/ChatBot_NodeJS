var SSH = require('simple-ssh');
var bodyParser = require('body-parser'); 
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
app.use(bodyParser.urlencoded({ extended: false })); 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var ssh = new SSH({
    host: 'sacsun59',
    user: 'pdmschd',
    pass: 'Ftt@sacsun59'
});

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: 'ae07e8c0-d011-43d8-80e6-fe0089167013', // replace with service username
  password: 'YLg7T5g58ocZ', // replace with service password
  version_date: '2018-03-15'
});

var workspace_id = 'adad526c-5827-4580-a150-660702a54984'; // replace with workspace ID
// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id
  }, callingExcecute);

io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'Welcome!!' });
	socket.on('send', function (data) {
    io.sockets.emit('message', data);
    console.log(data);
    conversation.message({
    workspace_id: workspace_id,
    input: { text: data.message }
    }, callingExcecute)
	});
}); 

var commands = [{
  "command":"/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND",
  "successMsg":"Load completed. Starting Cache_Refresh_IWServices_Daily_Data",
  "failureMsg":"Load failed. Check the monitor for status"
},{
 "command":"/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data",
  "successMsg":"Services refreshed. Starting Notification",
  "failureMsg":"Refresh failed. Check the monitor for status"
},{
 "command":"/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS",
  "successMsg":"Services refreshed and Notification was sent",
  "failureMsg":"Refresh failed. Check the monitor for status"
}];
var standardOP;
var exec = true;
var index = 0;
var shell;
var command;
var successMsg;
var failureMsg;
function callingExcecute(err, response) {
   var result = response.output.text[0];
   io.sockets.emit('message',{message:  result});
   console.log(result);
  if( result.search('Loading into the table') < 0 ) {
    return false;
  }  
  var interval = setInterval(function() {
      if(exec || (standardOP == 0 && index < commands.length)) {
        exec = false;        
        standardOP = undefined;
        shell = new SSH({
            host: 'sacsun59',
            user: 'pdmschd',
            pass: 'Ftt@sacsun59'
        });
        command = commands[index]["command"];
        successMsg = commands[index]["successMsg"];
        failureMsg = commands[index]["failureMsg"];
        shell.exec(command, {
          out: function(stdout) {
            standardOP = stdout;
            console.log(stdout);
            if(stdout == 0) {
              io.sockets.emit('message',{message:  successMsg});
            } else if(stdout == 99 || stdout == 3) {
              io.sockets.emit('message',{message:  failureMsg});
            }
          }
        }).start({
          success: function() {},
          fail: function(err) {}
        });
        index++;
        if(index == commands.length) {
          clearInterval(interval);
        }
      }
    }, 1000);

if( result.search('Getting response time') < 0 ) {
    // return false;
     console.log('Response time');
     io.sockets.emit('message',{message:  "Respones time"});
    var start = new Date();
    // http.get({host: 'risingstack.com', port: 80}, function(res) {
    http.get({host: 'stageglobaldataservices.noam.corp.frk.com', 
    path:'/xml/product/ProductDetails?AppID=IW&Country=SG&Language=en_GB&FundID=21374', 
    method: 'GET' }, function(res) {
    console.log('Request took:', new Date() - start, 'ms');
});

  } 
}

http.listen(3800, function(){
  console.log('listening on *:3800');
});
