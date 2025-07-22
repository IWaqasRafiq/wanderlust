const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy =  require('passport-local');
const User = require('./models/user.js');
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const mongoUrl =
  "mongodb+srv://@cluster0.ti04esi.mongodb.net";
mongoose.connect(mongoUrl);


const sessionOptions = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
};

app.get("/", (req, res) => {
  res.send("Root is working.");
});

app.use(session(sessionOptions));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log(`port is up 8080`);
});

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected");
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose is disconnected");
  process.exit(1);
});
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});
