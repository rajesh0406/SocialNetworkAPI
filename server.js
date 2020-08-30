const mongoose=require('mongoose');
const express=require('express');
const bcrypt=require('bcrypt');
const User=require('./models/userSchema');
const Message=require('./models/Message');
const shortid=require('shortid');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', false);
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/userDetails');


const app=express();
app.use(express.json());

var http = require("http").Server(app)
var io= require("socket.io")(http)
app.post('/signup', (req,res)=>{

    User.findOne({ "emailId": req.body.emailId },function(error,existing_user){
        if(existing_user)
        {
            res.status(400).send("User already exist");
        }
        else{
            
            const salt=bcrypt.genSaltSync();
            const hashpassword=bcrypt.hashSync(req.body.password,salt); 
            var newUser=new User({firstName:req.body.firstName,lastName:req.body.lastName,emailId:req.body.emailId,phnNo:req.body.phnNo,password:hashpassword,userName:req.body.userName});
            
            newUser.save(function(err,result){
                if(err)
                {
                    res.send("Something went wrong during sign-up");
                }
                else{
                    res.send("Sign-up successful");
                }
                res.end();
            });
            
           

        }

    });
   
});
app.post("/login",(req, res) => {
    User.find({"emailId":req.body.emailId},'emailId password userId', function(err, result) {
        if (err) {
          console.log(err);
        } else {
            if(!result) {
                return res.redirect('/signup').send("The Email-id does not exist.Please sign-up before you login ");
            }
           if(!bcrypt.compareSync(req.body.password, result[0].password)) {
                return res.status(400).send("The password is invalid");
            }
          
             
          res.send("The username and password combination is correct!");
        }
 });    
});
app.post('/profile',(req,res)=>{
   User.findOne({"emailId":req.body.emailId},'emailId profile',function(err,result)
   {
       if(err)
       {
           console.log("Something went wrong");
       }
    res.send(result.profile);

   });     
});
app.get('/profile/edit',(req,res)=>{
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
});
app.get('/people',(req,res)=>{
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
});
app.post('/friend_request',(req,res)=>{   

    User.findOneAndUpdate({"userId":req.body.recipientId}, {$push:{friend_request:{senderId:req.body.userId,senderName:req.body.userName}}},(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            console.log(result)
            console.log(result.friend_request.senderId);
            
            res.end("Request Sent");
            
        }
        });
});
app.get('/view_request',(req,res)=>{
    User.findOne({"userId":req.body.userId},"friend_request",(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            res.send(result.friend_request);
        }
    });
});
app.post('/accept_request',(req,res)=>{
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
     
});
app.get('/view_friend_profile',(req,res)=>{
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
});
app.get('/mypost',(req,res)=>{
    User.findOne({"userId":req.body.userId},"post",(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
            res.end();
        }
    });

});
app.post('/mypost/new',(req,res)=>{
    var pid=shortid.generate();
    User.findOneAndUpdate({"userId":req.body.userId},{$push:{post:{postType:req.body.postType,postContent:req.body.postContent,postId:pid}}},(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
          User.findOneAndUpdate({"userId":req.body.userId},{$push:{comment:{postId:pid,commentedBy:req.body.commentedBy,comment_text:req.body.text}}},(errr,results)=>{});
          User.findOneAndUpdate({"userId":req.body.userId},{$push:{likes:{postId:pid,likedBy:req.body.likedBy}}},(errr,results)=>{});
          res.send("Post uploaded");
          res.end();

        }
    });
});
app.post('/mypost/comment',(req,res)=>{
    User.findOneAndUpdate({"userId":req.body.userId},{$push:{comment:{postId:req.body.postId,commentedBy:req.body.commentedBy,comment_text:req.body.text}}},(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            console.log(result.comment);
            res.send("Comment updated");

        }
    });

});
app.post('/mypost/like',(req,res)=>{
    User.findOneAndUpdate({"userId":req.body.userId},{$push:{likes:{postId:req.body.postId,likedBy:req.body.likedBy}}},(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            console.log(result);
            res.send("Liked");
        }
    });
})

io.on("connection", (socket) => {
    console.log("Socket is connected...")
})
app.get("/chat", (req, res) => {
    Message.find({}, (error, chats) => {
        res.send(chats)
    })
})
app.post("/chat", async (req, res) => {
    try {
    var chat = new Message(req.body)
    await chat.save()
    res.sendStatus(200)
    
    io.emit("chat", req.body)
    } catch (error) {
    res.sendStatus(500)
    console.error(error)
    }
   })
app.listen(3000);
