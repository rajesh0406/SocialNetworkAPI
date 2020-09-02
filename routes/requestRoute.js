
const express=require('express');
const router=express.Router();
const requestController=require('../Controller/requestController');
router.get('/people',requestController.people);
router.post('/new',requestController.request_new);
router.get('/view',requestController.request_view);
router.post('/accept',requestController.request_accept);
module.exports=router;