const Course = require("../models/course");
module.exports = {
  index: (req, res) => {
      console.log("Controller: Courses Index");
      Course.find({})
          .then(courses => {
              console.log("Course found:", courses);
              res.render("courses/index", {
                  courses: courses
              });
          })
          .catch(error => {
              console.log(`Error fetching courses: ${error.message}`);
              res.redirect("/");
          });
  },
  indexView: (req, res) => {
    res.render("courses/index");
}, 
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    console.log("Request Body:", req.body); // Log the request
    try {
      let courseParams = {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        ingredient: req.body.ingredient,
        imageLink: req.body.imageLink,
      };
      Course.create(courseParams)
        .then(course => {
          req.flash("success", `${course.name}'s account created
➥ successfully!`);
          res.locals.redirect = "/courses";
          res.locals.course = course;
          next();
        })
        .catch(error => {
          console.log(`Error saving course: ${error.message}`);
          res.locals.redirect = "/courses/new";
          req.flash("error",`Failed to create dish account because: ➥${error.message}.`);
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
    let courseId = req.params.id;
    Course.findById(courseId)
        .then(course => {
          res.locals.course = course;
          next(); 
        })
        .catch(error => {
          console.log(`Error fetching course by ID: ${error.message}`);
          next(error);
        });
      },
  showView: (req, res) => {
    res.render("courses/show");
  },
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
        .then(course => {
            res.render("courses/edit", { course: course });
        })
        .catch(error => {
            console.log(`Error fetching course by ID for editing: ${error.message}`);
            next(error);
        });
  },
  update: (req, res, next) => {
    const courseId = req.params.id;
    const courseParams = {
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        ingredient: req.body.ingredient,
        imageLink: req.body.imageLink,
    };
    Course.findByIdAndUpdate(courseId, { $set: courseParams }, { new: true }) // Use { new: true } to return the updated course
      .then(course => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course; // Pass the updated course to the view
        next();
      })
      .catch(error => {
        console.log(`Error updating course: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findOneAndDelete({ _id: courseId })
        .then(() => {   
          res.locals.redirect = "/courses";
          next();
        })
        .catch(error => {
            console.log(`Error deleting course by ID: ${error.message}`);
            next(); 
          });
        },
};