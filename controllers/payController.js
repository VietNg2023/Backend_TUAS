const User = require('../models/user');
const Order = require('../models/order');
const Pay = require('../models/pay');
module.exports = {
  // showMethod: async (req, res) => async (req, res) => {
  //   try {
  //       const userId = req.params.userId;
  //       const user = await User.findById(userId);
  //       // Fetch order details from the database
  //       const orderDetails = await Order.findById(user.temporder).populate('items.course');
  //       res.render("pay/method", { user, orderDetails });
  //   } catch (error) {
  //       console.error(error);
  //       res.status(500).send("Internal Server Error");
  //   }
  // },
  // showCredit: (req, res) => {
  //   res.render("pay/creditcard");
  // },
    saveToHistory: async (req, res, next) => {
      try {
          // Extract userId from the route parameter
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const orderIds = user.temporder;
        // Use Promise.all to asynchronously fetch and populate each order
        const orders = await Promise.all(orderIds.map(async (orderId) => {
          const order = await Order.findById(orderId).populate('items.course');
          return order;
        }));
        const items = orders.flatMap(order => order.items);
        const totalPrice = orders.reduce((total, order) => total + order.totalPrice, 0);
        const pay = new Pay({
          userId: userId,
          items: items,
          totalPrice: totalPrice,
        });
        //const orderDetails = await Order.findById(user.temporder).populate('items.course');
          // // Create a new Pay instance using data from user.temporder and orderDetails
          // const pay = new Pay({
          //     userId: userId, 
          //     items: orderDetails,
          //     totalPrice: orderDetails.totalPrice,
          // });
          // Save the payment to the database
          await pay.save();
        // Redirect to the order finish page with the pay ID
        res.redirect(`/pay/orderfinish/${pay._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
},
// showOrderFinish: async(req, res) => {
//   try {
//     res.render("pay/orderfinish");
// } catch (error) {
//   console.error(error);
//   res.status(500).send("Internal Server Error");
// }
// },
  showOrderFinish: async(req, res) => {
    try {
      const payId = req.params.payId;
      const payDocument = await Pay.findById(payId);
      const userId = payDocument.userId;
      const user = await User.findById(userId);
      const userPay = await Pay.findById(payId).populate('items.course');
      res.render("pay/orderfinish",{ user, userPay });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  },
};
