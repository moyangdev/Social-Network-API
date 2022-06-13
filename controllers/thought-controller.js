const { Thought, User } = require('../models');

const thoughtController = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get thought by ID
    getThoughtsById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ createdAt: 'desc' })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought is found with that ID.' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    // create a new thought
    createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought is found with that ID.' });
                    return;
                }
                res.json({ message: 'Your thought is added!', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },
    
    // update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought is found with that ID.' });
                    return;
                }
                res.json({ message: 'Your thought is updated.', thoughtData });
            })
            .catch(err => res.status(400).json(err));
    },

    // delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought is found with that ID.' });
                    return;
                }
                return User.findOneAndUpdate(
                    { username: thoughtData.username },
                    { $pull: { thoughts: { id: req.params.id } } },
                    { new: true, runValidators: true }
                )
                    .then(thoughtData => {
                        res.json({ message: 'Your thought is deleted.', thoughtData });
                    });
            })
            .catch(err => res.status(400).json(err));
    },

    // create a reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true, runValidators: true }
        )        
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No thought is found with that ID.' });
                    return;
                }
                res.json({ message: 'Your reaction is added.' });
            })
            .catch(err => res.status(400).json(err));
    },

    // delete a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'No reaction is found with that ID.' });
                    return;
                }
                res.json({ message: 'Your reaction is removed.' });
            })
            .catch(err => res.status(400).json(err));
    },
};

module.exports = thoughtController;