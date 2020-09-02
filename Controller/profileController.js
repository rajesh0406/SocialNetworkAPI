const mongoose=require('mongoose');
const User=require('../models/userSchema');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', false);
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/userDetails');

const profile=(req,res)=>{
    User.findOne({"userId":req.body.userId},'emailId profile',function(err,result)
    {
        if(err)
        {
            res.send("Something went wrong");
        }
     res.send(result.profile);
 
    }); 
}
const profile_edit=(req,res)=>{
    User.findOne({"emailId":req.body.emailId},'emailId profile',function(err,result){
        if(err)
        {
            res.send(err);
        }
        result.profile.profilePic=req.body.profilePic,
        result.profile.dob=req.body.dob,
        result.profile.relationship_status=req.body.relationship_status,
        result.profile.workplace=req.body.workplace,
        result.profile.school_college=req.body.school_college,
        result.profile.location=req.body.location
        result.save(function(err,result){});
        res.send("Details saved");
    });
}
const friend_profile=(req,res)=>{
    User.findOne({"userId":req.body.friendId},"profile userName",(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
            res.end();
        }
    });
}
module.exports={
    profile,
    profile_edit,
    friend_profile
}