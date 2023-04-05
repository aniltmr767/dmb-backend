const convertToUTC =(inputTimeStamp)=>{
    console.log('inputTimeStamp,',inputTimeStamp)
    const utcTimeStamp=  new Date(inputTimeStamp) 
    
    const utcString=  utcTimeStamp.toISOString()
 
     const dateString=utcString.split('T');
     const utcDate=dateString[0]
 
     const timeString= dateString[1].split(':');
     const hours=timeString[0]
     const minutes=timeString[1]
     const timeInMinutes=parseInt(hours) * 60 + parseInt(minutes)
     
     const utcDateInNumbers=parseInt(utcDate.replace(/-/g,''))    
    return {utcTimeStamp,utcDate,utcDateInNumbers,hours,minutes,timeInMinutes}
 }

 module.exports={ convertToUTC }