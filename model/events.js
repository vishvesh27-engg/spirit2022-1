const mongoose = require("mongoose");
//Event schema
const stuff_user = require("./user");
const EventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true },
    content_on_card : { type: String, required: true },
    date : { type: Date, required: false  },
    user_object_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', unique: false}],
    full_name: [{ type: String, required: false, unique:false}],
    email_address: [{ type: String, required: false, unique:false}],
    college: [{ type: String, required: false, unique:false}],
    contact_number: [{ type: String, required: false, unique:false}], 
  	whatsapp_number: [{ type: String, required: false, unique:false}],
    chess_username: [{ type: String, required: false, unique:false}],
    athlos_events_registered: [{ type: String, required: false, unique:false}], 
    designation: [{ type: String, required: false, unique:false}], 
    img: [{ type: String, required: false, unique: false}],
    drive: [{ type: String, required: false, unique: false}],
  	poster: {type: String, required:false, unique:false },

  });
const Event = mongoose.model("Event", EventSchema);
module.exports.event = Event;

