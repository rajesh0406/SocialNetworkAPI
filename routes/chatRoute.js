const chatController=require('../Controller/chatController')
const express=require('express');
const app=express();
app.use(express.json());
const router=express.Router();

router.get("/chat",chatController.chat_get )
router.post("/chat",chatController.chat_post)
module.exports=router;