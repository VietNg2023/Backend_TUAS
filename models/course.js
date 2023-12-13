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
        imageLink: {
            type: String, // Assuming the image link is a URL
            trim: true
        },
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model("Course", courseSchema);