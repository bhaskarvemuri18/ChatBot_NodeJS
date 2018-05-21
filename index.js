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
        io.sockets.emit('message',{message: "PIE Monthly Risk Workflow completed"});
        }
        // io.sockets.emit('message',{message: stdout});
    }
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


else if( result.search('Getting response time') > -1 ){
var http = require('http');
var start = new Date();
// http.get({host: 'risingstack.com', port: 80}, function(res) {
http.get({host: 'stageglobaldataservices.noam.corp.frk.com', 
path:'/xml/product/ProductDetails?AppID=IW&Country=SG&Language=en_GB&FundID=21374', 
method: 'GET' }, function(res) {
    console.log('Request took:', new Date() - start, 'ms');
});

      }
  }
}




function processResponse(err, response) {
if (err) {
console.error(err); // something went wrong
return;
}



if (response.output.text.length != 0) {
console.log(response.output.text[0]);
io.sockets.emit('message',{message:  response.output.text[0]});
var result = response.output.text[0]
    if(result.search('Loading into the table') > -1 ){
    console.log("Loading into the table");
    stdout_ind = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND');
    console.log(stdout_ind);    
    if(stdout_ind==0){
        io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
        stdout_IW = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data');
        if(stdout_IW==0){
            io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
            stdout_Not = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS');
            if(stdout_Not==0){
             io.sockets.emit('message',{message: "Services refreshed and Notification was sent"});

            }
        }
        }

    // ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND', {  
    // out: function(stdout) {
    // console.log(stdout);
    //     if(stdout==0){
    //     io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
    //     }
    //     else if(stdout==99){
    //     io.sockets.emit('message',{message: "Load process failed. Please check the manager for details"});
    //     }
    // }
    // }).start();
    }
}
}


function shellExecute(script){
    ssh.exec(script, {  
    out: function(stdout) {
    console.log(stdout);
    if(stdout==99){
        io.sockets.emit('message',{message: "Process failed. Please check the manager for details"});
        }   
    while(stdout!=''|| undefined) 
        return stdout;
    }
    }).start();
}





// function processResponse(err, response) {
// if (err) {
// console.error(err); // something went wrong
// return;
// }
// if (response.output.text.length != 0) {
// console.log(response.output.text[0]);
// io.sockets.emit('message',{message:  response.output.text[0]});
// var result = response.output.text[0]
//     if( result.search('Loading into the table') > -1 ){
//     console.log("Loading into the table");
//     ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND', {  
//     out: function(stdout) {
//     console.log(stdout);
//         switch(stdout){
//         case '0':
//         io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
        
//         case '99':
//         io.sockets.emit('message',{message: "Load process failed. Please check the manager for details"});
//         }
//     }
//     }).start();
//     }
// }
// }


/************************************************************* */



// function processResponse(err, response) {
//   if (err) {
//     console.error(err); // something went wrong
//     return;
//   }
//  Display the output from dialog, if any.
//   if (response.output.text.length != 0) {
//       console.log(response.output.text[0]);
//        io.sockets.emit('message',{message:  response.output.text[0]});
//       var result = response.output.text[0]
//       if( result.search('Loading into the table') > -1 ){
//           console.log("Loading prices");
//           ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND', {  
//           out: function(stdout) {
//           console.log(stdout);
//           if(stdout==0){
//           io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
//           ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data', {  
//           out: function(stdout) {
//           console.log(stdout);
//           if(stdout==0){
//           io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
//           console.log("Refreshing NOTIFICATION");
//           ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', {  
//           out: function(stdout) {
//           console.log(stdout);
//           if(stdout==0){
//           io.sockets.emit('message',{message: "NOtification completed"});
//         }    
//         else if(stdout==99) {
//             io.sockets.emit('message',{message: "NOtification refresh failed. Please check the monitor for status"});
//         }
//     }
// }).start();
//         }    
//         else if(stdout==99) {
//             io.sockets.emit('message',{message: "Service refresh failed. Please check the monitor for status"});
//         }
//     }
//         }).start();
//         }    
//         else if(stdout==99){
//             io.sockets.emit('message',{message: "Load failed. Please check the monitor for status"});
//         }
//     }
// }).start();
//       }

//       //////////////////////////////************************* */
//        else if( result.search('Load completed. Starting') > -1 ){
//           console.log("Refreshing Services");
//           ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data', {  
//           out: function(stdout) {
//           console.log(stdout);
//           if(stdout==0){
//           io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
//         }    
//         else if(stdout==99) {
//             io.sockets.emit('message',{message: "Service refresh failed. Please check the monitor for status"});
//         }
//     }
// }).start();
//       }
//       else if( result.search('Services refreshed. Starting') > -1 ){
//           console.log("Refreshing NOTIFICATION");
//           ssh.exec('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS', {  
//           out: function(stdout) {
//           console.log(stdout);
//           if(stdout==0){
//           io.sockets.emit('message',{message: "NOtification completed"});
//         }    
//         else if(stdout==99) {
//             io.sockets.emit('message',{message: "NOtification refresh failed. Please check the monitor for status"});
//         }
//     }
// }).start();
//       }

//       ////////////////////*********************************** */
//   }
// }

// app.post('/api', function(req, res){
// //   res.sendFile(__dirname + '/index.html');
// console.log(req.body)
// conversation.message({
//     workspace_id: workspace_id,
//     input: { text: req.body.msg }
//     }, processResponse)
// });


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



/**
 * 
 * 
 * 
 * 
 * 
 *   // if(result.search('Loading into the table') > -1 ){
  //   console.log("Loading into the table");
  //   stdout_ind = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_FS_PricesIND');
  //   asynch(stdout_ind);
  //   while(stdout_ind!=0){
  //     setTimeout
  //   }
  //   if(stdout_ind==0){
  //   io.sockets.emit('message',{message: "Load completed. Starting Cache_Refresh_IWServices_Daily_Data"});
  //   stdout_IW = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_IWServices_Daily_Data');
  //   asynch(stdout_IW);
  //   if(stdout_IW!=0){
  //   io.sockets.emit('message',{message: "Services refreshed. Starting Notification"});
// stdout_Not = shellExecute('/gid/pdm/scripts/run_workflow.sh Daily_PDM_Composite_Cache_Refresh_Notification_IW_OTHERS');
// if(stdout_Not==0){
//     io.sockets.emit('message',{message: "Services refreshed and Notification was sent"});
//  }
// }
// }
// }
 */