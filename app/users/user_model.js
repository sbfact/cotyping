var mongoose =require('mongoose'),
    //connection=require('../../config/mongoose'),
    Schema=mongoose.Schema;


var userSchema=new Schema({
  email:String,
  localPassword:String,
  fbToken:String,
  jsonWebToken:String
});

module.exports=mongoose.model('user',userSchema);
