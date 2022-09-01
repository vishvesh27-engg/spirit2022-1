const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authapi = require("./routes/authapi");
const profileroute = require("./routes/profileroute");
const event_regRoute = require("./routes/event_regRoute");
const shutterbug = require("./routes/shutterbug");
const iplauction = require("./routes/iplauction");
const treasurehunt = require("./routes/treasurehunt");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const stuff_user = require("./model/user");
const stuff_event = require("./model/events");
const stuff_ipl_auction = require("./model/ipl_auction");
const stuff_treasure_hunt_winners = require("./model/treasure_hunt_winners");
const cors = require("cors");
var session;

//spirit 2022

app.use(express.static("public"));
app.locals.stuff_event = stuff_event;

mongoose.connect(
  "mongodb+srv://spirit2021:yH7HfOYsISfl1JKz@cluster0.g6tea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connection to db established"));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "secretkeyrvfmiefmeoofmdgtt",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//cors
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cookieParser());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  //throw new Error('BROKEN');
  session = req.session;
  if (session.userid) {
    res.render("index/index", { logged_in: true });
  } else res.render("index/index", { logged_in: false });
});

//Authentication
app.get("/register", (req, res) => {
  if (!req.session.userid) {
    res.render("authentication/register", { logged_in: false });
  } else {
    res.redirect("/");
  }
});
app.get("/login", (req, res) => {
  if (!req.session.userid) {
    res.render("authentication/login", { logged_in: false });
  } else {
    res.redirect("/");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//events
app.get("/events", async (req, res) => {
  session = req.session;
  if (session.userid) {
    const email = req.session.userid;
    const user = await stuff_user.model.findOne({ email }).lean();
    res.render("events/events", { user: user, logged_in: true });
  } else res.render("events/events", { logged_in: false });
});

app.get("/events/register/:name", async (req, res) => {
  if (req.session.userid) {
    const email = req.session.userid;
    const user = await stuff_user.model.findOne({ email }).lean();
    res.render("events/event_reg", { user: user, name: req.params.name });
  } else {
    res.redirect("/login");
  }
});

app.get("/shutterbug_submission", async (req, res) => {
  if (req.session.userid) {
    const email = req.session.userid;
    const user = await stuff_user.model.findOne({ email }).lean();
    res.render("events/shutterbug_submission", { user: user });
  } else {
    res.redirect("/login");
  }
});

app.get("/shutterbug_entries", async (req, res) => {
  session = req.session;
  const entries = await stuff_event.event
    .findOne({ event_name: "shutterbug_submission" })
    .lean();
  if (session.userid) {
    const email = req.session.userid;
    const user = await stuff_user.model.findOne({ email }).lean();
    res.render("events/shutterbug_entries", {
      user: user,
      logged_in: true,
      entries: entries,
    });
  } else
    res.render("events/shutterbug_entries", {
      logged_in: false,
      entries: entries,
    });
});

//TREASURE HUNT
app.get("/iabcmh", (req, res) => {
  res.render("treasurehunt/question_page");
});

app.get("/hunt_submit_details", (req, res) => {
  res.render("treasurehunt/submit_details");
});

//SPONSORS
app.get("/sponsors", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.render("sponsors/sponsors", { logged_in: true });
  } else res.render("sponsors/sponsors", { logged_in: false });
});
//ABOUTUS
app.get("/aboutus", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.render("aboutus/aboutus", { logged_in: true });
  } else res.render("aboutus/aboutus", { logged_in: false });
});

//CAMPUS AMBASSADOR RESGISTER
app.get("/campus_amb_register", async (req, res) => {
  session = req.session;
  if (session.userid) {
    const email = session.userid;
    const user = await stuff_user.model.findOne({ email }).lean();
    res.render("authentication/ca-register", { user: user, logged_in: true });
  } else {
    res.render("authentication/login", { logged_in: false, loginmsg: true });
  }
});

//APIS
app.use("/authapi", authapi);
app.use("/iplauction", iplauction);
app.use("/treasurehunt", treasurehunt);
app.use("/profile", profileroute);
app.use("/shutterbug_submission", shutterbug);
app.use("/events/event_registration", event_regRoute);

app.get("*", function (req, res) {
  res.status(404).send("<h1>Not Found</h1>");
});

app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Hello Spirit");
});
