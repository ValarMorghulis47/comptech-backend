import jwt from 'jsonwebtoken';

const generateTokenFromid = (user_id) => {
    return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JW_TOKEN_EXPIRES_TIME),
    })
}

export { generateTokenFromid };