class Users{
    constructor(){
        // this.roomId = roomId;
        this.users=[]
    }

    addUser(id,username,roomId){
        var user = {id,username,roomId};
        this.users.push(user);
    }
    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user)=> user.id !==id)
        }
        return user;
    }
    getUser(id){
        return this.users.filter((user)=>user.id===id)[0];
    }

    getUserameList(roomId){
        var users = this.users.filter((user)=> user.roomId===roomId);
        var userList = users.map((user)=> user.username);
        return userList;
    }
    getAllUsers(){
        return this.users;
    }
}

module.exports = {Users};