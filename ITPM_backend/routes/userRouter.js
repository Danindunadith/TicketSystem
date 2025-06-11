import express from "express";
import { deleteUser, getUsers, loginUser, registerUser, updateUser, getUserByEmail, getUserCount } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.get("/", getUsers);
userRouter.post("/login", loginUser);
userRouter.get("/:email", getUserByEmail);
userRouter.put("/:email", updateUser);
userRouter.delete("/:email", deleteUser);
userRouter.get('/user/count', getUserCount);
export default userRouter;
