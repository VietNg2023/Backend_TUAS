"use strict";
const mongoose = require("mongoose");
const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  router = express.Router(),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"),
  passport = require('passport');
const { isAuthenticated } = require('./middlewares/authentication.js'),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  homeController = require("./controllers/homeController"),
  menuController = require("./controllers/menuController"),
  payController = require("./controllers/payController"),
  errorController = require("./controllers/errorController"),
  passportConfig = require('./config/passport-config');
const User = require("./models/user"),
  Order = require("./models/order");

mongoose.connect(
  "mongodb://127.0.0.1:27017/restaurant_db",
  {useNewUrlParser: true}
);
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

router.use(express.static("public"));
router.use(layouts);
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method", {methods: ["POST", "GET"]}));
router.use(express.json());
router.use(cookieParser("secret_passcode"));
router.use(expressSession({
  secret: "secret_passcode",
  cookie: {maxAge: 4000000},
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(connectFlash());
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
passportConfig(passport);

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/menu", homeController.showMenu);
router.get("/menus/meaty", menuController.showMeaty);
router.get("/menus/fooddetails/:id", menuController.showFooddetails);
router.post("/menus/savetoCart", menuController.saveToCart);
router.get("/menus/cartdetails/:orderId", menuController.showCartdetails);
// router.get("/users/loginafterchoose/", usersController.loginafterchoose);
router.get("/users/loginafterchoose/:orderId", usersController.loginafterchoose); 
router.post("/users/loginafterchoose", usersController.authenticateafterchoose, usersController.redirectView);

//router.get("/pay/method/:userId", payController.showMethod);
router.get("/pay/method/:userId", async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      
      // Fetch order details from the database
      const orderDetails = await Order.findById(user.temporder).populate('items.course');

      res.render("pay/method", { user, orderDetails });
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});

//router.get("/pay/creditcard/:userId", payController.showCredit);
router.get("/pay/creditcard/:userId", async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      // Fetch order details from the database
      const orderDetails = await Order.findById(user.temporder).populate('items.course');
      res.render("pay/creditcard", { user, orderDetails });
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});
router.get("/pay/savetoHistory/:userId", payController.saveToHistory);
router.get("/pay/orderfinish/:payId", payController.showOrderFinish);

router.get("/contact",homeController.showSignUp);
router.post("/contact", homeController.postedSignUpForm);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate, usersController.redirectView);

router.get ("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete ("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get ("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete ("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});