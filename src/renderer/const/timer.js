export const formatDate = (date)=>{
    const padTo2Digits = (num) =>{
        return num.toString().padStart(2,'0');
    }
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth()+1),
            padTo2Digits(date.getDate()),
        ].join('-')+' '+
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds())
        ].join(':')
    );
}

export const  fancyTimeFormat = (duration) =>{   
    // Hours, minutes and seconds
     const hours = ~~(duration / 3600);
     const minutes = ~~((duration % 3600) / 60);
     const seconds = ~~duration % 60;

     return {hours,minutes,seconds}
}
