const mongoose=require('mongoose');
const User=require('../models/userSchema');
const shortid=require('shortid');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', false);
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/userDetails');
const post=(req,res)=>{
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
}
const post_new=(req,res)=>{
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
}
const post_comment_get=(req,res)=>{
    User.findOne({ userId: req.body.userId},
        { comment: { $elemMatch: { postId: req.body.postId } } } ,(err,result)=>
        {
            if(err)
            {
                res.send(err);
            }
            else{
                res.send(result);
            }
        });          
        
}
const post_comment_post=(req,res)=>{
    User.findOneAndUpdate({"userId":req.body.userId},{$push:{comment:{postId:req.body.postId,commentedBy:req.body.commentedBy,comment_text:req.body.text}}},(err,result)=>{
        if(err)
        {
            res.send(err);
        }
        else{
            res.send("Comment updated");

        }
    });
}
const post_like=(req,res)=>{
    User.findOneAndUpdate({"userId":req.body.userId},{$push:{likes:{postId:req.body.postId,likedBy:req.body.likedBy}}},(err,result)=>{
        if(err)
        {
            res.send(err)
        }
        else{
            res.send("Liked");
        }
    });
}
module.exports={
    post,
    post_new,
    post_comment_get,
    post_comment_post,
    post_like

}