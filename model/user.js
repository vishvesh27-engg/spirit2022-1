const mongoose = require("mongoose");
//User schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique:false},
    collegename: { type: String, default: null ,unique:false},
    email: { type: String, required: true, unique: true },
    phno: { type: String, default: null,unique:false },
    img: { type: String, required: false, unique: false},
    password: { type: String, default: null,unique:false },
	//Since our website is not ready we will host a static form for the ipl auction event in the old website
	//and connect it with this database. So when our new website will be put up, we will send mail to the registered users with a random password to         //login into the new website. So I made the storerandompassword field to store a random password for them which can be used later
	storerandompassword:  { type: String, required:false,unique:false },
	discord:  { type: String, required:false,unique:false },
    isVerified: { type: Boolean, default: false },
    provider: { type: String, default: "email" },
    events_registered: [{ type: String, default: null }],
	  
	  //for campus ambassadors:
    isCampusAmb: { type: Boolean, default: false },
    campusAmbId:  { type: String, required:false, unique:true },
    referrals : { type: String, default: "0",unique:false },
  },
  {
    timestamps: true,
  },
);
const model = mongoose.model("UserSchema", UserSchema);
module.exports.model = model;
module.exports.UserSchema = UserSchema;