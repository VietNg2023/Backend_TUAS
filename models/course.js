const mongoose = require("mongoose"),
    {Schema} = mongoose,
    courseSchema = new Schema({
        name: {
              type: String,
              trim: true
          },
        type: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            trim: true
        },  
        ingredient: {
            type: String,
            trim: true
        },
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model("Course", courseSchema);