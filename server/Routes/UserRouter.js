import express from 'express';
import { registerUser, 
         loginUser, 
         updateUserProfile, 
         deleteUserProfile, 
         changeAvatar,
         changeImage,
         changeUserPassword, 
         deleteUser,
         getUsers} from '../Controllers/UserController.js';
import { protect, admin } from '../middlewares/Auth.js';
const router = express.Router(); 
// *********** PUBLIC ROUTES *********** //

router.post("/", registerUser);
router.post("/login", loginUser);

// *********** PRIVATE ROUTES *********** //
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.patch("/avatar", protect, changeAvatar);
router.patch("/image", protect, changeImage);
// *********** ADMIN ROUTES *********** //
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);
export default router;