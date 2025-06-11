import express from "express";
import { createemployee,getAllemployee,deleteEmployee,getOneEmployee,updateemployee,getEmployeeCount } from "../controllers/employeeController.js";

const route = express.Router();


route.post("/createemp", createemployee);
route.get("/getallemp", getAllemployee);
route.get("/getoneemployee/:id", getOneEmployee);
route.put("/updateemployee/:id", updateemployee);
route.delete("/deleteemp/:id", deleteEmployee);
route.get("/count", getEmployeeCount);

export default route;