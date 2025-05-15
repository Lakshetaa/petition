import { Petition } from '../models/petitionModel.js';

// @desc    Create a new petition
// @route   POST /api/petitions
// @access  Private
export const createPetition = async (req, res) => {
  try {
    const { title, description, category, voteGoal } = req.body;

    const petition = await Petition.create({
      user: req.user._id,
      title,
      description,
      category,
      voteGoal,
    });

    res.status(201).json(petition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all petitions
// @route   GET /api/petitions
// @access  Public
export const getPetitions = async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = category ? { category } : {};
    
    const petitions = await Petition.find(filter)
      .populate('user', 'username fullName')
      .sort({ createdAt: -1 });
    
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single petition
// @route   GET /api/petitions/:id
// @access  Public
export const getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('user', 'username fullName')
      .populate('votes.user', 'username fullName');

    if (petition) {
      res.json(petition);
    } else {
      res.status(404);
      throw new Error('Petition not found');
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update a petition
// @route   PUT /api/petitions/:id
// @access  Private
export const updatePetition = async (req, res) => {
  try {
    const { title, description, category, voteGoal } = req.body;

    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      res.status(404);
      throw new Error('Petition not found');
    }

    // Check if user owns the petition
    if (petition.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this petition');
    }

    petition.title = title || petition.title;
    petition.description = description || petition.description;
    petition.category = category || petition.category;
    petition.voteGoal = voteGoal || petition.voteGoal;

    const updatedPetition = await petition.save();
    res.json(updatedPetition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a petition
// @route   DELETE /api/petitions/:id
// @access  Private
export const deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      res.status(404);
      throw new Error('Petition not found');
    }

    // Check if user owns the petition
    if (petition.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this petition');
    }

    await Petition.deleteOne({ _id: req.params.id });
    res.json({ message: 'Petition removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Vote on a petition
// @route   POST /api/petitions/:id/vote
// @access  Private
export const votePetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      res.status(404);
      throw new Error('Petition not found');
    }

    // Check if user already voted
    const alreadyVoted = petition.votes.find(
      (vote) => vote.user.toString() === req.user._id.toString()
    );

    if (alreadyVoted) {
      res.status(400);
      throw new Error('Petition already voted');
    }

    petition.votes.push({ user: req.user._id });

    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's petitions
// @route   GET /api/petitions/user
// @access  Private
export const getUserPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's voted petitions
// @route   GET /api/petitions/voted
// @access  Private
export const getUserVotedPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find({
      'votes.user': req.user._id,
    }).populate('user', 'username fullName');
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};