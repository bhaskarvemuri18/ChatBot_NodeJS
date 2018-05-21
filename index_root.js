var SSH = require('simple-ssh');
var bodyParser = require('body-parser') 
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
  version_date: '2018-02-15'
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
  var result = response.output.text[0];
  
  /*Start the conditions*/
  if( result.search('Running IW Notification') > -1 ){
    console.log("test if");
    ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', {  
    out: function(stdout) {
    console.log(stdout);
      if(stdout==0){
      io.sockets.emit('message',{message: "IW Notification Workflow completed"});
      }}
  }).start();
  }  

  else if( result.search('Running PIE application') > -1 ){
  console.log("test if");
  ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_PIE_Monthly_Risk', {  
  out: function(stdout) {
  console.log(stdout);
  if(stdout==0){
  io.sockets.emit('message',{message: "PIE Monthly Risk Workflow completed"});
  }}
  }).start();
  }

  else if( result.search('Running MRD extract.') > -1 ){
  console.log("test if");
  ssh.exec('/gid/pdm/scripts/run_PDS_EXTRACT_workflow.sh Daily_PDS_MRD_Fund_Manager_Extract', {  
  out: function(stdout) {
  console.log(stdout);
  if(stdout==0){
  io.sockets.emit('message',{message: "Fund Manager Extract completed"});
  }}
  }).start();
  }


 /*
Add conditions/ nested if else for other individual workflows here 
  */     

/* Conditions for sequence*/
  if(result.search('Loading into the table') > -1 ){
    console.log("Loading into the table");
    
    //var newOut = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS'); 
    //asynch(stdout_ind);
    // console.log(stdout_ind);
    // while(stdout_ind!=0){
    // io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
    // }
    // });
var output;
    ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', {  
    out: function(stdout) {
 output = stdout;
      
    if(stdout==99){
        io.sockets.emit('message',{message: "Process failed. Please check the manager for details"});
        } 
    }
    }).start();
    
var interval = setInterval(function() {
  // console.log("calling");
  //console.log(output);
if(output==0) {
  clearInterval(interval);
  //console.log(stdout_ind + "stdoutinadasdasd");
  //io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});    
  //console.log("exectutjgn next aasd");  
  //stdout_IW = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data'); 
    // asynch(stdout_IW);
   // console.log(stdout_IW);
    // while(stdout_IW!=0){
    // io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
    // }
    // });
    //clearInterval(interval);
    
}
}, 1000);

// // if(stdout_ind==0){
//     io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
    
//     shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data', function(stdout_IW){
//     asynch(stdout_IW);
//     console.log(stdout_IW);
//     while(stdout_IW!=0){
//     io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
//     }
//     });
    
//     // if(stdout_IW==0){
//     shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', function(stdout_Not){
//     asynch(stdout_Not);
//       while(stdout_Not!=0){
//        io.sockets.emit('message',{message: "Services refreshed and Notification was sent"});
//       }
//     });
    // if(stdout_Not==0){
}
// }
// }
// }
}
}


var commands = [{
  "command":"/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND",
  "successMsg":"Load completed. Starting Cache_Refresh_IWServices_Daily_Data",
  "failureMsg":"Load failed. Check the monitor for status"
},{
 "command":"/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data",
  "successMsg":"Services refreshed. Starting Notification",
  "failureMsg":"Refresh failed"
},{
 "command":"/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS",
  "successMsg":"Services refreshed and Notification was sent",
  "failureMsg":"Refresh failed"
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
            // console.log(stdout);
            if(stdout == 0) {
              io.sockets.emit('message',{message:  successMsg});
            } else if(stdout == 99) {
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
}


function asynch(stdoutvar){
  while(stdoutvar!= undefined){
    console.log(stdoutvar);  
  }
  return stdoutvar;
}


function shellExecute(script){
    ssh.exec(script, {  
    out: function(stdout) {
    //console.log(stdout);
    if(stdout==99){
        io.sockets.emit('message',{message: "Process failed. Please check the manager for details"});
    }   
    //while(stdout!=''|| undefined) 
      //  return stdout;
    }
    }).start();
}


http.listen(3800, function(){
  console.log('listening on *:3800');
});
