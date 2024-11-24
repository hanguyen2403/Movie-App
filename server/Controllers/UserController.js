import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middlewares/Auth.js';
// @desc Register user
// @route POST /api/users/
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body
    try{
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400);
            throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //else create User
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        //if user is created successfully send user data and token to client
        if (user){
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400);
            throw new Error("Invalid user data");
        }

    } catch (error){
        res.status(400).json({message: error.message});
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))){
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error){
        res.status(400).json({message: error.message});
    }
});

// ********* PRIVATE CONTROLLERS *********

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const {fullName, email, image} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user){
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.image = image || user.image;

            const updateUser = await user.save();

            res.json({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                image: updateUser.image,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id),
            })
        }
        else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error){
        res.status(400).json({message: error.message});
    }
});

// @desc    Detele user profile
// @route   DELETE /api/users
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
    try {
        // Await the result of findById to get the actual user document
        const user = await User.findById(req.user._id);
        
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error("Admin cannot delete account");
            }
            // Use user.deleteOne() instead of user.remove()
            await user.deleteOne();
            res.json({ message: "User removed successfully" });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//desc Change user avatar
//@route PATCH /api/users/avatar
//@access Private
const changeAvatar = asyncHandler(async (req, res) => {
    const {avatar} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user){
            user.avatar = avatar || user.avatar;
            const updateUser = await user.save();
            res.json({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                avatar: updateUser.avatar,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id),
            })
        }}
    catch (error){
        res.status(400).json({message: error.message});
    }
});
const changeImage = asyncHandler(async (req, res) => {
    const {image} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user){
            user.image = image || user.image;
            const updateUser = await user.save();
            res.json({
                _id: updateUser._id,
                fullName: updateUser.fullName,
                email: updateUser.email,
                image: updateUser.image,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser._id),
            })
        }}
    catch (error){
        res.status(400).json({message: error.message});
    }
}); 

//@desc Change user password
//@route PUT /api/users/password
//@access Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user){
            if (await bcrypt.compare(oldPassword, user.password)){
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(newPassword, salt);
                await user.save();
                res.json({message: "Password changed successfully"});
            } else {
                res.status(401);
                throw new Error("Invalid old password");
            }
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error){ 
        res.status(400).json({message: error.message});
    }

});

//*****************ADMIN CONTROLLER *****************

// @desc Get all users
const getUsers = asyncHandler(async (req, res) => {
    try{
        const users = await User.find({});
        res.json(users);
    } catch (error){
        res.status(400).json({message: error.message});
    }
});
// @desc delete user
// @router DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error("Admin cannot be deleted");
            }
            await user.remove();
            res.json({ message: "User removed successfully" });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
export {registerUser, 
        loginUser, 
        updateUserProfile, 
        deleteUserProfile,
        changeAvatar, 
        changeImage,
        changeUserPassword, 
        deleteUser, 
        getUsers};