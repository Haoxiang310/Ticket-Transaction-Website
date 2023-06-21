//a type using express validator
import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]){
    //call super to invoke constructor of base class
    super('Invalid request parameters');

    // only because we are extending a built-in class;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(){
    return this.errors.map(err => {
      return { message: err.msg, field: err.type}
    })
  }
}
