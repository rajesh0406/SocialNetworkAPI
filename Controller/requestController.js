const mongoose=require('mongoose');
const User=require('../models/userSchema');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', false);
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/userDetails');
const people=(req,res)=>{
    User.find({"userId":{$ne:req.body.userId}},'userName profile userId',function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(result);
        }
    });
}
const request_new=(req,res)=>{
    User.findOneAndUpdate({"userId":req.body.recipientId}, {$push:{friend_request:{senderId:req.body.userId,senderName:req.body.userName}}},(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            res.end("Request Sent");
            
        }
        });
}
const request_view=(req,res)=>{
    User.findOne({"userId":req.body.userId},"friend_request",(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            res.send(result.friend_request);
        }
    });
}
const request_accept=(req,res)=>{
    User.findOneAndUpdate({'userId':req.body.userId},{$push:{friends:{friendId:req.body.friendId}}},(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            User.findOneAndUpdate({'userId':req.body.friendId},{$push:{friends:{friendId:req.body.userId}}},(err,result)=>{
                if(err)
                {
                    res.send(err)
                }             

            });
            res.end("Request Accepted");
        }

    });
}
module.exports={
    people,
    request_new,
    request_view,
    request_accept 
}