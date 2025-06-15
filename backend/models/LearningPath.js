const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    topic: String,
    description: String,
    resources: [String],          // e.g. YouTube links, PDFs, URLs
    week: Number
  },
  { _id: false }
);

const learningPathSchema = new Schema(
  {
    ownerProfile: { type: Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    careerGoal:   String,
    totalWeeks:   Number,
    generatedAt:  { type: Date, default: Date.now },
    lessons:      [lessonSchema]   // flattened structure for easy rendering
  },
  { timestamps: true }
);

module.exports = mongoose.model('LearningPath', learningPathSchema);
