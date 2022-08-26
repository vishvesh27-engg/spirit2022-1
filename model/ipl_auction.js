const mongoose = require("mongoose");
//IPLAuction Schema
const stuff_user = require("./user");
const IPLAuction = new mongoose.Schema(
  {
    teamname: { type: String, required: true, unique: true },
    member1: [stuff_user.UserSchema],
    member2: [stuff_user.UserSchema],
    member3: [stuff_user.UserSchema],
  },
  {
    timestamps: true,
  }
);
const IPLAuctionSchema = mongoose.model("IPLAuctionSchema", IPLAuction);
module.exports.iplauction = IPLAuctionSchema;
