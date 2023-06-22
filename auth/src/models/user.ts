import mongoose from "mongoose";
import { Password } from '../services/password';
// An interface that describes the properties 
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

//an interface that describes the peoperties
//that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties
//that a User Document has. Tell ts to ignore
//the attrs like createdAt,..., only cares about
//email and pwd
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email:{ 
    //mongoose type, not ts type,ts string is lowercase
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},{
    toJSON:{
      transform(doc, ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
  }
});

//middleware, calling the function after saving sth
//and then after it call done
userSchema.pre('save',async function(done){
  //call Userdoc by this, do not use => otherwise it will be changed to the context
  //if we first create a password, mongoose will also set isModified to true
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password',hashed);
  }
  done();
});

//apply ts on mongoose for type checking
//get ts involved in creating new users
userSchema.statics.build = (attrs:UserAttrs) => {
  return new User(attrs);
}

//<UserDoc, UserModel> some crazy code that fit mongo and ts
//<> generic type arguments, type properties in class, function, etc...
//UserModel, U extends Model<T>, is the return value of function model
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export { User }; 