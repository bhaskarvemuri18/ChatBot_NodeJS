if( result.search('Running PIE application') > -1 ){
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