import User from "../models/user.js";
import bcrypt from "bcrypt";
import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";

export function registerUser (req,res){

    const data = req.body;
    data.password = bcrypt.hashSync(data.password,10)
    
    const newUser = new User(data)

    newUser.save().then(()=>{
        res.json({message : "User Registered successfully"})
    }).catch((error)=>{
        console.log(error)
        res.status(500).json({message : "User registered failed"})
    })
}

//user profile



export function loginUser(req,res){
    const data = req.body;
    

    User.findOne({
        email : data.email
    }).then((user)=>{

        if(user== null) {
            res.status(404).json({error: "User not found"})
        }else{
            const isPasswordCorrect = bcrypt.compareSync
            (data.password,user.password);

            if(isPasswordCorrect){
                const token = JsonWebToken.sign({
                    _id: user._id,
                    firstName : user.firstName,
                    lastName  : user.lastName,
                    email : user.email,
                    role : user.role,
                    profilePicture :user.profilePicture,
                    phone : user.phone,
                },process.env.JWT_SECRET)
                res.json({message : "Login successful",token : token, user:user});


            }else{
                res.status(404).json({error: "Login failed"});
            }
        }
    })

}


//users list

export async function getUsers(req,res){

    try{

        if(isItAdmin(req)){
          const users = await User.find();
          res.json(users);
        return;
        }else{
            const users =await User.find({availability:true});
            res.json(users);
            return;
        }
    }catch(e){
        res.status(500).json({
            message : "Failed to get product"
        })
    }
}

export async function getUserCount(req, res) {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user count" });
  }
}


//update

export async function updateUser(req,res){
    try {
        const email = req.params.email;
        const data = req.body;

        // Check if user is admin or updating their own profile
        if(isItAdmin(req) || (req.user && req.user.email === email)) {
            const result = await User.updateOne({email: email}, data);
            
            if (result.matchedCount === 0) {
                return res.status(404).json({
                    message: "User not found with the specified email"
                });
            }

            return res.json({
                message: "User updated successfully"
            });
        } else {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            message: "Failed to update user"
        });
    }
}


//delete

export async function deleteUser(req, res) {
    try {
        if (isItAdmin(req)) {
            const key = req.params.email;
            await User.deleteOne({ email: key }); // FIXED HERE
            res.json({
                message: "User deleted successfully"
            });
        } else {
            res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Failed to delete user"
        });
    }
}

export async function getUserByEmail(req, res) {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get user" });
    }
}

export function isItAdmin(req){

    let isAdmin=false;
    if(req.user != null && req.user.role == "admin"){
        isAdmin = true;
    }
    return isAdmin;
}

export function isItCustomer(req){

    let isCustomer=false;
    if(req.user != null && req.user.role == "customer"){
        isCustomer = true;
    }
    return isCustomer;
}
