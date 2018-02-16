/**
 * Created by Gabriel on 16/02/2018.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        user_id:String,
        user_name:String,
        user_surname:String,
        last_login:Date
    }
);

module.exports= mongoose.model('User',UserSchema);