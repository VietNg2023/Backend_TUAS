const User = require("../models/user");
const Order = require("../models/order");

module.exports = {
  index: (req, res) => {
      console.log("Controller: Users Index");
      User.find({})
          .then(users => {
              console.log("Users found:", users);
              res.render("users/index", {
                  users: users
              });
          })
          .catch(error => {
              console.log(`Error fetching users: ${error.message}`);
              res.redirect("/");
          });
  },
  indexView: (req, res) => {
    res.render("users/index");
}, 
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    console.log("Request Body:", req.body); // Log the request
    try {
      let userParams = {
        name: {
          first: req.body.firstName,
          last: req.body.lastName
        },
        email: req.body.email,
        password: req.body.password
      };
      User.create(userParams)
        .then(user => {
          req.flash("success", `${user.fullName}'s account created
➥ successfully!`);
          res.locals.redirect = "/users";
          res.locals.user = user;
          next();
        })
        .catch(error => {
          console.log(`Error saving user: ${error.message}`);
          res.locals.redirect = "/users/new";
          req.flash("error",`Failed to create user account because: ➥${error.message}.`);
          next();
        });
    } catch (error) {
      console.log("Caught an error:", error);
      next(error);
    }
  },  
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
        .then(user => {
          res.locals.user = user;
          next(); 
        })
        .catch(error => {
          console.log(`Error fetching user by ID: ${error.message}`);
          next(error);
        });
      },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
        .then(user => {
            res.render("users/edit", { user: user });
        })
        .catch(error => {
            console.log(`Error fetching user by ID for editing: ${error.message}`);
            next(error);
        });
  },
  update: (req, res, next) => {
    const userId = req.params.id;
    const userParams = {
        name: {
        first: req.body.firstName, // Use req.body.first to update the first name
        last: req.body.lastName,   // Use req.body.last to update the last name
      },
      email: req.body.email,
      password: req.body.password,
    };
    User.findByIdAndUpdate(userId, { $set: userParams }, { new: true }) // Use { new: true } to return the updated user
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user; // Pass the updated user to the view
        next();
      })
      .catch(error => {
        console.log(`Error updating user: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findOneAndDelete({ _id: userId })
        .then(() => {   
          res.locals.redirect = "/users";
          next();
        })
        .catch(error => {
            console.log(`Error deleting user by ID: ${error.message}`);
            next(); 
          });
        },
  login: (req, res) => {
    res.render("users/login");
  },
  // authenticate with hashing
  // authenticate: (req, res, next) => {
  //   User.findOne({email: req.body.email})
  //       .then(user => {
  //         if (user) {
  //           user.passwordComparison(req.body.password)
  //           .then(passwordsMatch => {
  //             if (passwordsMatch) {
  //               res.locals.redirect = `/users/${user._id}`;
  //               req.flash("success", `${user.fullName}'s logged in successfully!`);
  //               res.locals.user = user;
  //               } else {
  //                 req.flash("error", "Failed to log in user account: Incorrect Password.");
  //                 res.locals.redirect = "/users/login";
  //               }
  //                 next();
  //               });
  //             } else {
  //               req.flash("error", "Failed to log in user account: User account not found.");
  //               res.locals.redirect = "/users/login";
  //               next();
  //             }
  //           })
  //           .catch(error => {
  //             console.log(`Error logging in user: ${error.message}`);
  //             next(error);
  //           });
  //         },
  authenticate: (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user && user.passwordComparison(req.body.password)) {
                res.locals.redirect = `/users/${user._id}`;
                req.flash("success", `${user.fullName}'s logged in successfully!`);
                res.locals.user = user;
            } else {
                req.flash("error", "Failed to log in user account: Incorrect Email or Password.");
                res.locals.redirect = "/users/login";
            }
            next();
        })
        .catch(error => {
            console.log(`Error logging in user: ${error.message}`);
            next(error);
        });
},
  loginafterchoose: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const userOrder = await Order.findById(orderId).populate('items.course');
      res.render("users/loginafterchoose", { userOrder });
    // res.render("users/loginafterchoose");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  // authenticateafterchoose: (req, res, next) => {
  //   User.findOne({ email: req.body.email })
  //     .then(user => {
  //       if (user) {
  //         user.passwordComparison(req.body.password)
  //           .then(passwordsMatch => {
  //             if (passwordsMatch) { 
  //               res.locals.redirect = `/pay/method/${user._id}`;
  //               req.flash("success", `${user.fullName}'s logged in successfully!`);
  //               res.locals.user = user;
  //             } else {
  //               req.flash("error", "Failed to log in user account: Incorrect Password.");
  //               res.locals.redirect = "/users/loginafterchoose";
  //             }
  //             next();
  //           });
  //       } else {
  //         req.flash("error", "Failed to log in user account: User account not found.");
  //         res.locals.redirect = "/users/loginafterchoose";
  //         next();
  //       }
  //     })
  //     .catch(error => {
  //       console.log(`Error logging in user: ${error.message}`);
  //       next(error);
  //     });
  // },
  // working with hashing
  // authenticateafterchoose: async (req, res, next) => {
  //   try {
  //     const { email, password, userOrder } = req.body;
  
  //     // Find the user by email
  //     const user = await User.findOne({ email });
  
  //     if (user) {
  //       // Compare passwords
  //       const passwordsMatch = await user.passwordComparison(password);
  
  //       if (passwordsMatch) {
  //         // Create a new Order document
  //         const order = new Order(userOrder);
  
  //         // Save the order to the user's temporder
  //         user.temporder.push(order);
  
  //         // Save the user with the updated temporder
  //         await user.save();
  
  //         // Set the redirect and user information
  //         res.locals.redirect = `/pay/method/${user._id}`;
  //         req.flash("success", `${user.fullName}'s logged in successfully!`);
  //         res.locals.user = user;
  //       } else {
  //         req.flash("error", "Failed to log in user account: Incorrect Password.");
  //         res.locals.redirect = "/users/loginafterchoose";
  //       }
  //     } else {
  //       req.flash("error", "Failed to log in user account: User account not found.");
  //       res.locals.redirect = "/users/loginafterchoose";
  //     }
  
  //     next();
  //   } catch (error) {
  //     console.log(`Error logging in user: ${error.message}`);
  //     next(error);
  //   }
  // },
authenticateafterchoose: async (req, res, next) => {
    try {
        const { email, password, userOrder } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (user && user.passwordComparison(password)) {
            // Save the order to the user's temporder
            user.temporder = userOrder;

            // Save the user with the updated temporder
            await user.save();

            // Set the redirect and user information
            res.locals.redirect = `/pay/method/${user._id}`;
            req.flash("success", `${user.fullName}'s logged in successfully!`);
            res.locals.user = user;
        } else {
            req.flash("error", "Failed to log in user account: Incorrect Email or Password.");
            res.locals.redirect = "/users/loginafterchoose";
        }

        next();
    } catch (error) {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
    }
},

};