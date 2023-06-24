import express from 'express';
import { currentUser } from '@hxtickets/common';
const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req,res)=>{

  //in current-user middleware returned payload
  res.send({ currentUser: req.currentUser || null });

});
 
export { router as currentUserRouter};