const mongoose=require('mongoose');
const MessageSchema=mongoose.Schema({
    name:{
        type:String,
    },
    message:{
        type:String
    }
}
);
var Message=mongoose.model("message",MessageSchema);
module.exports=Message;