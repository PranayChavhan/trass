import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique username"],
    unique: [true, "Username Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: [true, "Email Exist"],
  },
  firstName: {
    type: String,
    unique: false,
  },
  lastName: {
    type: String,
    unique: false,
  },
  profile: {
    profile_photo: String,
    background_img: String,
    aka_name: String,
    occupation: String,
    intro: String,
    qualification: String,
    achievements: [{
      image: String,
      title: String,
      description: String
    }],
    social_media: {
      linkedin: String,
      instagram: String,
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
