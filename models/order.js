const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  //user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  sessionId: { type: String, required: true }, // Add sessionId field
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
