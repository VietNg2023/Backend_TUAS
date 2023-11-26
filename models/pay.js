const mongoose = require('mongoose');
const { Schema } = mongoose;
const paySchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      course: { type: Schema.Types.ObjectId, ref: 'Course' },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Pay = mongoose.model('Pay', paySchema);

module.exports = Pay;
