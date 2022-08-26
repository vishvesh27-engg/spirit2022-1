const express = require("express");
const app = express.Router();
const bodyParser = require("body-parser");
const stuff = require("../model/treasure_hunt_winners");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/add/", urlencodedParser, async (req, res) => {

  const { name, email, college, phno } = req.body;
  const data = await stuff.hunt_winner.findOne({ email }).lean();
  if(data)
  return res.send({
    status: "error",
    error:
      "You have already registered yourself.",
  });
  await stuff.hunt_winner
    .create({
      name,
      email,
      college,
      phno,
    })
    .then((response) => res.send({ status: "ok", data: response }))
    .catch((error) => {
      console.log(error.message);
      if (error.code === 11000) {
        // duplicate key
        return res.json({
          status: "error",
          error:
            "You have already registered yourself.",
        });
      }
      return res.send({
        status: "error",
        error:
          "Something went wrong. Contact Spirit 2021 team if you are not able to register",
      });
    });
});

app.post("/check_answer/", urlencodedParser, async (req, res) => {
  const {answer} = req.body;
  if(answer === "Viswanathan Anand"){
	  res.send({ status: "ok", data: "Correct Answer!" });
  }
  return res.send({
    status: "error",
    error:
      "Your answer is incorrect.",
  });
});


module.exports = app;