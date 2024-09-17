import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    session: {          // the current Position field will be read only for the user and its value will be determined upon the session field. Like if user selects 24 session then the position field will be General Member and if he selects 23 then it will be executive member and for 22 it will be Assitent Deirector and so on. and for 21 it will be Cabinet
        type: Number,
    },
    team: {
        type: String,
    },
    department: {
        type: String,
    },
    img:
    {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    about: {
        type: String,
    },
    currentPosition: {
        type: String,
        default:"General Member"
    },
    socialMedia: [
        {
            name: {
                type: String,
            },
            link: {
                type: String,
            }
        }
    ],
    career: [       // career field will only come in when the admin is editing the user not in register form
        {
            team: {
                type: String,
            },
            stage: {
                type: String,
            }
        }
    ]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model('User', userSchema);