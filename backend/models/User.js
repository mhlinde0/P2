import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, //constraint for username
    email: { type: String, required: true, unique: true },//constraint for email
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);//model creation

export default User; //ES model
