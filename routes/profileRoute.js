
const express=require('express');
const router=express.Router();
const profileController=require('../Controller/profileController');
router.get('/profile',profileController.profile);
router.post('/profile/edit',profileController.profile_edit);
router.get('/profile/friend',profileController.friend_profile);
module.exports=router;