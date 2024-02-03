const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String},
  shift: {type: Number,default:0},
  otp: { type: String, default:''}, 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
