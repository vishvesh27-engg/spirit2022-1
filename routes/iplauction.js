const express = require("express");
const app = express.Router();
const bodyParser = require("body-parser");
const stuff = require("../model/ipl_auction");
const stuff_user = require("../model/user");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/register/", urlencodedParser, async (req, res) => {

  const { member1, member2, member3, teamname } = req.body;
  const data = await stuff.iplauction.findOne({ teamname }).lean();
  if(data)
  return res.send({
    status: "error",
    error:
      "Team Name already exists. Please choose a different name",
  });
  await stuff.iplauction
    .create({
      teamname,
      member1,
      member2,
      member3,
    })
    .then((response) => res.send({ status: "ok", data: response }))
    .catch((error) => {
      console.log(error.message);
      if (error.code === 11000) {
        // duplicate key
        return res.json({
          status: "error",
          error:
            "One of the participants is already registered in another team",
        });
      }
      return res.send({
        status: "error",
        error:
          "Something went wrong. Contact Spirit 2021 team if you are not able to register",
      });
    });
});

module.exports = app;
