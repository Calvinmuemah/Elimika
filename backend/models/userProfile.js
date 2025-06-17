const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      unique: true // Ensure one profile per user
    },

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
        gradingSystem: String
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

    isOnboarded: { type: Boolean, default: false },

    currentLearningPathId: { type: Schema.Types.ObjectId, ref: 'LearningPath' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
