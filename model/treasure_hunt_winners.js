const mongoose = require("mongoose");
//User schema
const HuntWinnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique:false},
    college: { type: String, required: true, default: null ,unique:false},
    email: { type: String, required: true, unique: true},
    phno: { type: String, required: true, default: null, unique:false},
  },
  {
    timestamps: true,
  },
);
const HuntWinner = mongoose.model("treasurehuntwinners", HuntWinnerSchema);
module.exports.hunt_winner = HuntWinner;