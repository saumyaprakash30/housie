const crypto = require('simple-crypto-js').default;
simpleCrypto = new crypto(process.env.SECRETKEY_CRYPTO)
class Room {
    constructor() {
        this.rooms = [];
    }
    getRoomByHash(hash){
        return this.rooms.filter(room=>room.hashedId===hash)[0];
    }
    getRoomById(roomId){
        let room=this.rooms.filter(room=> room.roomId===roomId)[0];
        return room;
    }
    addRoom(roomId){

        this.rooms.push({
            roomId:roomId,
            players:[],
            hashedId:simpleCrypto.encrypt(roomId)
        })
    }

    removeRoom(roomId){
        let rooms = this.rooms.filter(room=>room.roomId!=roomId)
        this.rooms=rooms;
    }
}