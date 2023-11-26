const bcrypt = require("bcrypt");
const mongoose = require("mongoose"),
    {Schema} = mongoose,
    userSchema = new Schema({
        name: {
            first: {
              type: String,
              trim: true
          }, last: {
              type: String,
              trim: true }
          },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true
          },
        courses: [{type: Schema.Types.ObjectId, ref: "Course"}],
        order: [{type: Schema.Types.ObjectId, ref: "Order"}],
        temporder: [
            {
              type: Schema.Types.ObjectId,
              ref: "Order",
            },
          ],
    }, 
    {
        timestamps: true
    });

userSchema.virtual("fullName")
    .get(function() {
    return `${this.name.first} ${this.name.last}`;
});

// userSchema.pre("save", function(next) {
//     let user = this;
//     bcrypt.hash(user.password, 10).then(hash => {
//       user.password = hash;
//       next();
//     })
//       .catch(error => {
//         console.log(`Error in hashing password: ${error.message}`);
//         next(error);
//     }); 
// });
userSchema.pre("save", function(next) {
  let user = this;
  // Check if the password field is modified
  if (!user.isModified("password")) {
      return next();
  }
  // No hashing, directly assign the password to the user object
  user.password = user.password;
  next();
});
userSchema.methods.passwordComparison = function(inputPassword){
    let user = this;
    //return bcrypt.compare(inputPassword, user.password);
    return inputPassword === user.password;
};

module.exports = mongoose.model("User", userSchema);