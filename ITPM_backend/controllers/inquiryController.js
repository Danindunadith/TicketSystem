import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req,res){

    try{
        if(isItCustomer(req)){
            
            const data = req.body;
            data.email = req.user.email;
            data.phone = req.user.phone;

            let id = 0;

            const inquiries = await Inquiry.find().sort({id :-1}).limit(1);

            if(inquiries.length == 0){
                id = 1;
            }else{
                id = inquiries[0].id + 1;
            }
            data.id=id;

            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save() //me response eke thiyenne save una vidiya
           
            res.json({
                message: " inquiry added succesfully",id:response.id
                
            })
        }

    }catch(e){
        
        res.status(500).json({
            message : "Failed add inquiry"
        })

    }
}

export async function getInquiries(req,res){
    try{
        
        if(isItCustomer(req)){
            const inquiries = await Inquiry.find({email:req.user.email});
            res.json(inquiries);
            return;
        }else if(isItAdmin(req)){
            const inquiries = await Inquiry.find();
            res.json(inquiries);
        }else{
            res.status(500).json({
                message :"you are not authorized perform this action"
            })
        }
    }catch(e){
        res.status(500).json({
            message : "failed to get requiries"
        })
    }
}

export async function deleteInquiries(req,res){
    try{
        if(isItAdmin(req)){

            const id = req.params.id;

            await Inquiry.deleteOne({id:id});
            res.json({
                message :"successfully delete inquiries"
            })
        }else if(isItCustomer(req)){
            
            const id = req.params.id;
            const inquiry = await Inquiry.findOne({id:id});

            if(inquiry == null){
                res.status(404).json({
                    message : "Inquiry not found"
                })
                return;
            }else{
                if(inquiry.email == req.user.email){
                    await Inquiry.deleteOne({id:id});
                    res.json({
                        message :"inquiry deleted successfully"
                    })
                    return;
                }else{
                    res.status(403).json({
                        message :"you are not authorized perform this action"
                    })
                    return;
                }
            }
        }else{
            res.json({
                message: "You are not authorized perform this action"
            })
            return
        }
    }catch{
        res.status(500).json({
            message : "failed delete inquiries"
        })
    }
}

export async function updateInquiry(req,res){
    try{
        if(isItAdmin(req)){
            const id = req.params.id;
            const data = req.body;

            const inquiry = await Inquiry.updateOne({id:id},data);
            res.json({
                message: "Inquiry updated successfully"
            })

        }else if(isItCustomer(req)){
            const id = req.params.id;
            const data = req.body;

            const inquiry =  await Inquiry.findOne({id:id});

            if(inquiry == null){
                res.status(404).json({
                    message : "Inquiry not found"
                })
            }else{
                if(inquiry.email == req.user.email){
                    await Inquiry.updateOne({id:id},{message : data.message}); //data wala message eka pamanak user ta edit karanna dei
                    res.json({
                        message: "Inquiry updated successfully"
                    })
                    return;
                }else{
                    res.status(403).json({
                        message: "you are not authorized perform this action"
                    })
                    return;
                }
            }

        }else{
            res.status(403).json({
                message:" you are not authorized to perform this action"
            })
        }

    }catch(e){
       
        res.status(500).json({
            message: "failed to update inquiry"
        })
    }
}