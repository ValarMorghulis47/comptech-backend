import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    team: {
        type: String,
        required: true
    },
    session: {
        type: Number,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
});

export const Team = mongoose.model('Team', teamSchema);