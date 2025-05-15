import express from 'express';
import {
  createPetition,
  getPetitions,
  getPetitionById,
  updatePetition,
  deletePetition,
  votePetition,
  getUserPetitions,
  getUserVotedPetitions,
} from '../controllers/petitionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPetitions)
  .post(protect, createPetition);

router.get('/user', protect, getUserPetitions);
router.get('/voted', protect, getUserVotedPetitions);

router.route('/:id')
  .get(getPetitionById)
  .put(protect, updatePetition)
  .delete(protect, deletePetition);

router.post('/:id/vote', protect, votePetition);

export default router;