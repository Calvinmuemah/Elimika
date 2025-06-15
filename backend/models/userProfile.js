const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProfileSchema = new Schema(
  {
    academicLevel: {
      type: String,
      enum: [
        'High School Student',
        'Undergraduate Student',
        'Graduate Student',
        'Working Professional',
        'Self-Learner'
      ],
      default: null
    },

    careerInterests: [String],

    availableStudyTime: {
      hoursPerWeek: String
    },

    academicGrades: [
      {
        subject: String,
        grade: String,
        gradingSystem: String                // "A‑F", "Percentage", "GPA"
      }
    ],

    selfAssessments: [
      {
        skill: String,
        proficiency: {
          type: String,
          enum: ['No experience', 'Beginner', 'Intermediate', 'Advanced']
        }
      }
    ],

    learningStyles: [
      {
        type: String,
        enum: ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic']
      }
    ],

    preferredResources: [String],

    // --- Internal state ---
    isOnboarded:   { type: Boolean, default: false },
    currentLearningPathId: { type: Schema.Types.ObjectId, ref: 'LearningPath' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
