import bcrypt from 'bcrypt';
import User from '../models/user.js';

const register = async (userData) => {
    const { email, name, password } = userData;

    let user = await User.findOne({ email });

    if (user) {
        throw new Error('User already exists');
    }

    user = new User({
        name,
        email,
        password
    });

    await user.save();

    return user;
};

const login = async (userData) => {
    const { email, password } = userData;

    let user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const isMatch = password == user.password;

    if (!isMatch) {
        throw new Error('Invalid Credentials');
    }

    return user;
};

export default { register, login };