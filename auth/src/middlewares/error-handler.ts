import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/custom-error";

// Err Handler takes four arguments, the first of which is an error object. This differentiates it from non-error handling middleware which takes only three arguments.
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
  if(err instanceof CustomError){
    return res.status(err.statusCode).send( { errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{
      message: 'Something went wrong'
    }]
  });
}