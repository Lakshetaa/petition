import mongoose from 'mongoose';

const petitionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    voteGoal: {
      type: Number,
      required: true,
      default: 100,
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Petition = mongoose.model('Petition', petitionSchema);