class Users{
    constructor(){
        // this.roomId = roomId;
        this.users=[]
    }

    addUser(id,username,roomId,admin){
        var user = {id,username,roomId,admin};
        this.users.push(user);
    }
    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user)=> user.id !==id)
        }
        return user;
    }
    setAdmin(roomId){
        var user = this.users.filter((user)=>user.roomId===roomId)[0];       
        var index = this.users.indexOf(user)
        this.users[index].admin = true;       
    }
    getUser(id){
        return this.users.filter((user)=>user.id===id)[0];
        
    }
    getAdmin(roomId){
        var user = this.users.filter((user)=> user.roomId===roomId && user.admin===true)[0];
        return user;
    }
    getUsernameList(roomId){
        var users = this.users.filter((user)=> user.roomId===roomId);
        var userList = users.map((user)=> user.username);
        return userList;
    }
    getUserList(roomId){
        return this.users.filter((user)=>user.roomId===roomId);;
    }
    getAllUsers(){
        return this.users;
    }
    getUserCount(roomId){
        return this.users.filter((user)=> user.roomId===roomId).length;
    }
}

module.exports = {Users};