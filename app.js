if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");;
const ExpressError = require("./utils/ExpressError.js");
//const  MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlist';
const dbUrl = process.env.ATLASTDB_URL



const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


main().then(() => {
    console.log("connected to DB")
}).catch((err) => {
    console.log(err);
})

async function main( ) {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl:  dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
}) ;

store.on("error", () => {
    console.log("Error in Mongo Session Store", err)
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// });


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User ({
//         email:"student@gmail.com",
//         username: "delta-student"
//     });
//     let registeredUser = await User.register(fakeUser, "hello123");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter );
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
    
    let {statusCode = 500, message = "something went wrong !"} = err;
   res.status(statusCode).render("error.ejs", { message });
});


app.listen(7777, () => {
    console.log("server is listning to port 7777");
});













// app.get("/testlisting", async (req, res) => {
//     let samplelisting = new listing({
//         title: "My new villa",
//         description: "Near the beach",
//         price: 1200,
//         location:"chittagong, bangladesh",
//         country: "Bangladesh",
//     });
//     await samplelisting.save();
//     console.log("sample was save");
//     res.send("successful");
// });

