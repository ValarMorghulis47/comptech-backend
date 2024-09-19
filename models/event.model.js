import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    eventCover: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    eventPics: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // Assuming time is stored as a string in HH:mm format
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    spokesPerson: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        },
        socials: [
            {
                name: {
                    type: String,
                },
                url: {
                    type: String,
                }
            }
        ]
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    collaboration: {
        type: String,
    },
    keyPoints: [
        {
            name: {
                type: String,
            },
            explanation: {
                type: String,
            }
        }
    ]
}, {
    timestamps: true
});

export const Event = mongoose.model('Event', eventSchema);
