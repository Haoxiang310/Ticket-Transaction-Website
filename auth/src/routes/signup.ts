import express, { Request, Response } from 'express';
//check body inside the incoming request
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
//validationResult, inspect the middleware of validation and pull out the validation information off, to send back to user
const router = express.Router();

//add more custom properties to a exisitng ts type: subclasses

router.post('/api/users/signup',  
[
    body('email')
      .isEmail() //built in express-validator to validate there is a email in req body
      .withMessage('Email must be valid'), //have a structure of email
    body('password')
      .trim() //express-validator sanitization, make sure the password contains no space, etc.
      .isLength({min: 4, max:20})
      .withMessage('Password must be between 4 and 20 characters')
], 
async(req: Request,res: Response)=>{

  //get error messages 
  const errors = validationResult(req);

  //early send back the error msg to user
  if(!errors.isEmpty()){
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if(existingUser){
    throw new BadRequestError('Email in use');
  }

  const user = User.build({ email, password });
  await user.save();

  res.status(201).send(user);
  //using express-validator for automatic validation
});

export { router as signupRouter};