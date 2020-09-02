const express=require('express');
const router=express.Router();
const postController=require('../Controller/postController');
router.get('/',postController.post);
router.post('/new',postController.post_new);
router.post('/comment',postController.post_comment_post);
router.get('/comment',postController.post_comment_get);
router.post('/like',postController.post_like);
module.exports=router;