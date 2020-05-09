module.exports = (max,count)=>{
    //max : number between 0 to max
    //count : how many unique numbers
    uniqueNubers = []
    while(uniqueNubers.length<count){
        var randomNumber = Math.floor(Math.random()*max)+1;
        if(uniqueNubers.indexOf(randomNumber)==-1){
            uniqueNubers.push(randomNumber);
        }
    }
    return uniqueNubers;
}