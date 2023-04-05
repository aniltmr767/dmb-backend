
const dmbVersionController = require('../controllers/dmbVersionController');
const terminalController = require('../controllers/terminalController');
module.exports = async function (socket) {
    
    console.log('new device connected individually :',socket.id) 


     socket.on('switch-to-my-store',(storeId)=>{
        console.log('storeId',storeId)
        console.log('socket.room',socket.rooms)
        socket.leave(socket.id);
        socket.join(String(storeId))
        console.log('socket.room',socket.rooms)
        socket.emit('switched-to-store', ...socket.rooms )
      })



   

      socket.on('get-my-current-version',async(input)=>{
       console.log('storeId:',input.storeId)
        
             const result= await  dmbVersionController.getCurrentDmbVersion(input)
             socket.emit('current-version-received',result)
             console.log('result:',result)
         })
 




         socket.on('get-my-upcomming-schedule-list',async(input)=>{        
            console.log('input:',input)   
             
            const result= await  dmbVersionController.getUpcommingSchedule(input)
            socket.emit('upcomming-schedule-list-received',result)
            console.log('result:',result)
          })




          socket.on('get-schedule-by-versionId',async(input)=>{        
            console.log('input:',input)   
             
            const result= await  dmbVersionController.getScheduleByVersionId(input)
            socket.emit('schedule-by-versionId-received',result)
            console.log('result:',result)
          })




         socket.on('update-current-displaying-version',async(input)=>{            
             
                  const result= await  terminalController.updateCurrentDisplayingVersion(input)
                  socket.emit('current-displaying-version-updated',result)
                  console.log('result:',result)
         })


        socket.on('disconnect',()=>{
            console.log('disconnected individually device :',socket.id)
         })

         
         
    
  };