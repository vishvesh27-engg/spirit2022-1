const express = require("express");
const app = express.Router();
const bodyParser=require('body-parser');
const stuff_user = require("../model/user");
const stuff = require("../model/events");
const multer = require('multer');

var urlencodedParser = bodyParser.urlencoded({ extended : false });

//define storage for the images

const storage = multer.diskStorage({
    //destination for files
    destination: function (req, file, callback) {
        callback(null, './public/images/shutterbug_submissions');
    },
  
    //add back the extension
    filename: function (req, file, callback) {
      callback(null,Date.now() + " " +file.originalname);
    },
  });
  
//upload parameters for multer
const upload = multer({
storage: storage,
fileFilter: function(req, file, callback){
    if( file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
        console.log(file.mimetype);
        console.log(file.size);
        callback(null, true)
        // if(file.size <= 1024 * 1024 * 3){
        //     callback(null, true)
        //     console.log('less than 3mb');
        // }
        // else{
        //     callback(null, false)
        // }
    }else{
        console.log(file.mimetype);
        console.log("Only png, jpg and jpeg files are supported!");
        callback(null, false)
    }
},
limits: {
    fieldSize: 1024 * 1024 * 3,
},
});

app.post('/', upload.single('image'), async (req, res) => {

    console.log(req.file);
    var count1 = 0; var count2 = 0;
    const data2 = await stuff_user.model.findOne({ email: req.body.email }).then(
        (data2)=> {
            for(let i=0; i<data2.events_registered.length; i++){
                if(data2.events_registered[i] === 'shutterbug'){
                    count1++;
                }
            }
        }
    )
    .catch(
        (error)=> {
                console.log(error);
                res
                .status(200)
                .contentType("text/plain")
                .end(error.message)
        }
    )

    const data3 = await stuff.event.findOne({ event_name: 'shutterbug_submission' }).then(
        (data3)=>{
            for(let i=0; i<data3.email_address.length; i++){
                if(data3.email_address[i] === req.body.email){
                    count2++;
                }
            }
        }
    )
    .catch(
        (error)=>{
            console.log(error);
            res
            .status(200)
            .contentType("text/plain")
            .end(error.message)
        }
    )

    if(count1 === 1 && count2 === 0){
        if(req.file){
            console.log(req.file.size)
            var email = req.body.email;
            const data = await stuff.event.findOne({ event_name: 'shutterbug_submission' }).then(
                (data)=> {
                    let j = data.email_address.length;
                    data.email_address[j] = req.body.email;
                    data.full_name[j] = req.body.username;
                    data.drive[j] = req.body.drive;
                    data.img[j] = req.file.filename;
                    data.save()
                    let mssg = "Success. Image Uploaded!"  
                    res.render("events/shutterbug_success.ejs", {mssg: mssg})
                }
            )
            .catch(
                (error)=>{
                    console.log(error);
                    res
                    .status(200)
                    .contentType("text/plain")
                    .end(error.message)
                }
            )
        }
        else{
            let mssg = "Please check if the image uploaded is of format png, jpg or jpeg. Please try again"  
            res.render("events/shutterbug_success.ejs", {mssg: mssg})
        }
    }else if(count1 === 0){
        let mssg = "Sorry you have not registered for this event"  
        res.render("events/shutterbug_success.ejs", {mssg: mssg})
    }else if(count2 >= 1 ){
        let mssg = "You have already submitted your entry"  
        res.render("events/shutterbug_success.ejs", {mssg: mssg})
    }
});


module.exports = app;  

