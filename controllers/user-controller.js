const { User } = require('../models');

const userController = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get user by ID
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json(userData);
            });
    },

    // create a new user
    createUser({ body }, res) {
        User.create(body)
            .then(userData => {
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    // update a user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json({ message: 'The user is updated.', userData });
            })
            .catch(err => res.status(400).json(err));
    },

    // delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json({ message: 'The user is deleted.', userData });
            })
            .catch(err => res.status(400).json(err));
    },

    // add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json({ message: `The user is added to your friend list.`, userData });
            })
            .catch(err => res.status(400).json(err));
    },

    // delete a friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json({ message: "The user is removed from your friend list.", userData });
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;