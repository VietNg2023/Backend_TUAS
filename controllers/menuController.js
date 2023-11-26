const Course = require("../models/course");
const Order = require("../models/order");
module.exports = {
  showMeaty: async (req, res) => {
    try {
      // Fetch the list of courses from the database
      const Beefcourses = await Course.find({type:"Beef"});
      const Porkcourses = await Course.find({type:"Pork"});
      const Chickencourses = await Course.find({type:"Chicken"});
      const Fishcourses = await Course.find({type:"Fish"});
      // Render the meaty.ejs template with the list of courses
      res.render("menus/meaty", { Beefcourses, Porkcourses, Chickencourses, Fishcourses });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  showFooddetails: async (req, res) => {
    try {
      // Fetch the specific course from the database using the id
      const courseId = req.params.id;
      const course = await Course.findById(courseId);
      // Render the beefdetails.ejs template with the specific course details
      res.render("menus/fooddetails", { course });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  showCartdetails: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const userOrder = await Order.findById(orderId).populate('items.course');
  
      // Render the cartdetails.ejs template with the order details
      res.render("menus/cartdetails", { userOrder });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  saveToCart: async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const coursePrice = req.body.coursePrice;
    // Generate a unique session identifier (you might need a session management library)
    const sessionId = req.session.id;
    // Check if the user already has an active order with the current session identifier
    const existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      // If the user has an active order, add the selected course to the order
      existingOrder.items.push({
        course: courseId,
        quantity: 1,
      });
      // Update the total price of the order
      existingOrder.totalPrice += parseFloat(coursePrice);
      // Save the updated order to the database
      await existingOrder.save();
      // Optionally, you can redirect the user to a confirmation page
      res.redirect(`/menus/cartdetails/${existingOrder._id}`);
    } else {
      // If the user doesn't have an active order, create a new order with the session identifier
      const orderItem = {
        course: courseId,
        quantity: 1,
      };

      const userOrder = new Order({
        items: [orderItem],
        totalPrice: coursePrice,
        sessionId,
      });
      // Save the order to the database
      await userOrder.save();
      // Optionally, you can redirect the user to a confirmation page
      res.redirect(`/menus/cartdetails/${userOrder._id}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
},
} 