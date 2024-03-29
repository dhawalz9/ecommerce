import express from "express";
import {registerController, loginController, testController, forgotPasswordController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/register",registerController)

// LOGIN - post
router.post("/login",loginController);

// Forgot password - post
router.post("/forgot-password",forgotPasswordController)

router.get("/test",requireSignIn,isAdmin,testController);

// protected route auth
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})

router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

export default router