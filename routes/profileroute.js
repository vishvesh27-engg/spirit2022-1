const express = require("express");
const app = express.Router();
const stuff = require("../model/user");

//get one's profile
app.get("/", async (req, res) => {
  if (req.session.userid) {
    email = req.session.userid;
    const user = await stuff.model.findOne({ email }).lean();
    res.render("dashboard/dashboard", { user: user, logged_in: true});
  }
  else{
    res.send("Access denied")
  }
});

//get profile to update
app.get("/update/:id", async (req, res) => {
  const doc = await stuff.model
    .findById(req.params.id)
    .then((user) => {
      if (user != null) {
        user.save().then(
          (user) => {
            res.statusCode = 200;
            res.render("dashboard/profile_update", { user: user, logged_in: true });
          },
          (err) => res.status(400).send({ message: err.message })
        );
      } else {
        err = new Error("User " + req.params.quesid + " not found");
        res.status(400).send({ message: err.message });
      }
    })
    .catch((err) => res.status(400).send({ message: err.message }));
});

//update profile
app.put("/put/:id", async (req, res) => {
  try {
    const doc = await stuff.model
      .findById(req.params.id)
      .then((user) => {
        if (user != null) {
          if (
            !req.body.username ||
            req.body.collegename ||
            req.body.email ||
            req.body.phno
          ) {
            user.username = req.body.username;
            user.collegename = req.body.collegename;
            user.email = req.body.email;
            user.phno = req.body.phno;
            user.isVerified = true;
            user.save().then(
              (user) => {
                res.statusCode = 200;
                return res.json({ status: "ok" });
              },
              (err) => res.status(400).send({ message: err.message })
            );
          } else {
            err = new Error("Please enter all the details");
            res.status(400).send({ message: err.message });
          }
        } else {
          err = new Error("User " + req.params.quesid + " not found");
          res.status(400).send({ message: err.message });
        }
      })
      .catch((err) => res.status(400).send({ message: err.message }));
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({
        status: "error",
        error: "vmro this email is already in use",
      });
    }
  }
});

module.exports = app;
