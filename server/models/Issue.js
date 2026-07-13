const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'Pothole',
        'Garbage',
        'Water Leak',
        'Streetlight Damage',
        'Other',
      ],
    },
    description: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Reported', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Reported',
    },
    assignedTo: {
      type: String,
      enum: ['BBMP', 'BWSSB', 'BESOM', 'ADMIN', 'USER', null],
      default: null,
    },
    image: { type: String },
    resolutionImage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
