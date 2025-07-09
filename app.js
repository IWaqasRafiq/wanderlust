const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const mongoUrl = "mongodb+srv://@cluster0.ti04esi.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoUrl);

app.get("/", (req , res) =>{
    res.send("Root is working.")
})

// app.get("/testListing", async (req , res) =>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "by the beach",
//         price : 1200,
//         location : "Karachi, Sindh",
//         country : "Paksitan",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull testing")
// });

app.get("/listings", async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", {allListings});
    // req.send("working")
});

app.get("/listings/new", async (req, res) => {
    res.render("listing/new.ejs");
})


app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", {listing});
})

app.post("/listings", async(req, res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

app.listen(8080, () => {
    console.log(`port is up 8080`)
});










////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});
mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});
process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
