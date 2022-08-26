const express = require("express");
const app = express.Router();
const bcrypt = require("bcryptjs");
const stuff = require("../model/user");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");

var session;
//jwt
const JWT_SECRET =
  "abcdefghijklmonofdikvnmdskjfcndkjfnadfldknsfkrlnwfnwekjdnslakcndskjvnsdkcjnsdkjvwenfwejfnweofijngnwuernlewn8592324@$%@$^%#@#@^$#%$#%@#$#$#$%#$%#$%$#%$#kfjnedmjdn";
//mail settings
var transporter = nodemailer.createTransport({
  service: "gmail", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: "spiritiitg2022@gmail.com",
    pass: "cdidzeswzcebqnfp",
  },
});

//registering an user
app.post("/register", async (req, res) => {
  const {
    username,
    collegename,
    email,
    phno,
    password: plainTextPassword,
    storerandompassword,
    discord,
  } = req.body;
  if (!username || typeof username !== "string") {
    return res.json({
      status: "error",
      error: "your username is badly formatted",
    });
  }
  if (!email || typeof email !== "string") {
    return res.json({
      status: "error",
      error: "your email address is badly formatted",
    });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }
  //encrypting password end to end
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    //storerandompassword will contain a value only when the user registers for a event in the old website so that we can mail him the credentials to       //login into the new website. Its TEMPORARY
    //ignore line 64-77. Its for registering users from old website without password
    if (storerandompassword) {
      const user = await stuff.model.findOne({ email }).lean();
      if (!user) {
        const isVerified = true;
        const response = await stuff.model.create({
          username,
          collegename,
          email,
          phno,
          password,
          isVerified,
          storerandompassword,
          discord,
        });
        return res.json({ status: "ok", data: response });
      }
    }
    //Main authentication part is the else part below. It will register users in the new website
    else {
      const response = await stuff.model.create({
        username,
        collegename,
        email,
        phno,
        password,
        discord,
      });
      var mailOptions = {
        from: "Spirit 2021 <spiritiitg2022@gmail.com>",
        to: email,
        subject: "Welcome to Spirit 2021. Verify your account",
        html: `Hi ${username},
<br><br>
Thanks for registering for Spirit!
<br>
Please verify your account on the below link:
<br>
<a href="http://${req.hostname}/authapi/verifyaccount/${response._id}">Click here</a>
<br><br>
If the link is not visible mark the email as not spam.
<br><br>
Regards
<br>
Spirit Web Operations`,
      };
      //sending verification mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent");
      });
      return res.json({ status: "ok", data: response });
    }
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key passed
      return res.json({
        status: "error",
        error: "Sorry this email is already in use",
      });
    } else if (error) {
      return res.json({ status: "error", error: "Something went wrong" });
    }
  }

  res.json({ status: "ok" });
});

//signin users
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await stuff.model.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid email/password" });
  }

  if (user.provider !== "email") {
    return res.json({
      status: "error",
      error: `You are authenticated using the same mail with ${user.provider}`,
    });
  }

  if (user.isVerified === false) {
    return res.json({ status: "error", error: "Email not verified. Please verify to sign in" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the email, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_SECRET
    );
    session = req.session;
    session.userid = email;
    console.log(req.session.userid);
    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid email/password" });
});

//sign in with google/fb
app.post("/loginwithgofb", async (req, res) => {
  const { email, username, provider } = req.body;
  const user = await stuff.model.findOne({ email }).lean();

  if (!user) {
    return res.json({ status: "error", error: "User does not exist" });
  }

  if (!user.isVerified) {
    return res.json({
      status: "error",
      error: `Email address is not verified`,
    });
  }

  if (user.provider !== provider) {
    return res.json({
      status: "error",
      error: `You are authenticated using the same mail with ${user.provider}`,
    });
  }

  session = req.session;
  session.userid = email;
  console.log(req.session);
  return res.json({ status: "ok", data: user });
});

//register with google/fb
app.post("/registerwithgofb", async (req, res) => {
  const { email, username, provider } = req.body;
  const isVerified = false;
  try {
    const response = await stuff.model.create({
      username,
      email,
      isVerified,
      provider,
    });
    var mailOptions = {
      from: "Spirit 2021 <spiritiitg2022@gmail.com>", // sender address (who sends)
      to: email, // list of receivers (who receives)
      subject: "Welcome to Spirit 2021.", // Subject line
      html: `Hi ${username},
<br><br>
Thanks for registering for Spirit!
<br>
We need a little more information, before we complete your registration. Please update your details on the below link:
<br>
<a href="http://${req.hostname}/profile/update/${response._id}">Click here to update your account</a>
<br><br>
If the link is not visible mark the email as not spam.
<br><br>
Regards
<br>
Spirit Web Operations`, // html body
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }

      console.log("Message sent: " + info.response);
    });
    console.log("User created successfully: ");
    return res.json({ status: "ok", data: response });
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({
        status: "error",
        error: "Sorry this email is already in use",
      });
    }
    throw error;
  }
});

//verifying an account
app.get("/verifyaccount/:id", async (req, res) => {
  const doc = await stuff.model
    .findById(req.params.id)
    .then((user) => {
      if (user != null) {
        user.isVerified = true;
        user.save().then(
          (user) => {
            res.statusCode = 200;
            res.render("emailverified");
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

app.post("/pass_forgot_req", async (req, res) => {
  const { email } = req.body;

  console.log("sending mail...");
  const query = await stuff.model.findOne({ email: email });
  if (query) {
    if (query.provider === "email") {
      //return res.json({ status: "ok", data: query.provider });
      try {
        var mailOptions1 = {
          from: "Spirit 2021 <spiritiitg2022@gmail.com>",
          to: email,
          subject: "Reset your Spirit 2021 password",
          html: `<b>Reset password for email: ${email}</b><br><a href="http://${req.hostname}/authapi/getnewpass/${query._id}">Click here to change your password</a>`, // html body
        };
        transporter.sendMail(mailOptions1, function (error, info) {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: " + info.response);
        });
        return res.json({ status: "ok", data: query.provider });
      } catch (error) {
        if (error.code === 11000) {
          return res.json({
            status: "error",
            error: "",
          });
        }
        throw error;
      }
    } else {
      return res.json({ data: "This account is associated with google/facebook" });
    }
  } else {
    return res.json({ data:"No account associated with this email" });
  }
});

app.post("/pass_reset_req", async (req, res) => {
  const { id, old_password: old_password } = req.body;

  const doc = await stuff.model.findById(id);
  if (doc != null) {
    if (await bcrypt.compare(old_password, doc.password)) {
      return res.json({ status: "ok", data: doc._id });
    } else {
      err = new Error("Please enter the correct password");
      res.status(400).send({ message: err.message });
    }
  } else {
    err = new Error("User " + req.params.quesid + " not found");
    res.status(400).send({ message: err.message });
  }
});

app.get("/getnewpass/:id", async (req, res) => {
  console.log(req.params.id);
  id = req.params.id;
  const doc = await stuff.model.findById(req.params.id).then((user1) => {
    res.render("forgotpassword", { user: user1 });
  });
});

app.post("/reset_pass", async (req, res) => {
  const { id, password2: plainTextPassword } = req.body;
		// console.log(plainTextPassword);

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: `Invalid password` });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);

  const doc = await stuff.model
    .findById(id)
    .then(async (user) => {
      if (user != null) {
        if (await bcrypt.compare(plainTextPassword, user.password)) {
          return res.json({
            status: "error",
            error: `Your new password is same as your old password`,
          });
        }

        user.password = password;
        user.save().then(
          (user) => {
            //res.statusCode = 200;
            return res.json({ status: "ok", data: user._id });
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

app.post("/ca_register", async (req, res) => {
  const {
    email, user_email
  } = req.body;
  if (!email || typeof email !== "string") {
    return res.json({
      status: "error",
      error: "your email address is badly formatted",
    });
  }
  if(email != user_email){
    return res.json({
      status: "error",
      error: `You have not entered your email address correctly`,
    });
  }
  var isCampusAmb = true;
  var campusAmbId = Math.floor((Math.random() * 100000000) + 1);
  var referrals = "0";

  const user1 = await stuff.model.findOne({ email })
  .then((user1)=>{
    if(user1.isCampusAmb == true){
      return res.json({
        status: "error",
        error: `You are aleady a campus ambassador`,
      });
    }
    if(user1.isVerified == false){
      return res.json({
        status: "error",
        error: `You have not verified your account`,
      });
    }
    user1.referrals = referrals;
    user1.campusAmbId = campusAmbId;
    user1.isCampusAmb = true;
    user1.save();

    return res.json({ status: "ok" });

  }).catch((error)=>{
    console.log(error);
    return res.json({
      status: "error",
      error: `Account not found`,
    });
  });
  //res.json({ status: "ok" });
});

module.exports = app;
