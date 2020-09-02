const mongoose=require('mongoose');

const Bcrypt=require('../services/bcrypt')
const shortid=require('shortid');

const User=require('../models/userSchema');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', false);
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/userDetails');
const signup=(req,res)=>{
    User.findOne({ "emailId": req.body.emailId },function(error,existing_user){
        if(existing_user)
        {
            res.status(400).send("User already exist");
        }
        else{
            
            
            const hashpassword= Bcrypt.generateHash(req.body.password);
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
}
const login=(req,res)=>{
    User.findOne({"emailId":req.body.emailId},'emailId password userId', function(err, result) {
        if (err) {
          console.log(err);
        } else {
            if(!result) {
                return res.redirect('/signup').send("The Email-id does not exist.Please sign-up before you login ");
            }
           if(!Bcrypt.comparePassword(req.body.password,result.password)) {
                return res.status(400).send("The password is invalid");
            }
         
          res.send("The username and password combination is correct!");
        }
 });    
}
module.exports={
    signup,
    login
}