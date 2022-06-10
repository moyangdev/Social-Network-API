const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Please provide a username.',
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: 'Please provide an email address.',
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
        },
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);


// count total number of friends
UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// create user model using UserSchema
const User = model('User', UserSchema);

module.exports = User;