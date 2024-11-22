import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your full name"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        index: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password must be at least 6 characters"],
    },
    image: {
        type: String,
        default: "https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    favoriteList: [{
        type: mongoose.Schema.ObjectId,
        ref: "Movie",
    },], 
    watchList: [{
        type: mongoose.Schema.ObjectId,
        ref: "Movie",
    },],
  },
  {
    timestamps: true
  });

  export default mongoose.model("User", userSchema);