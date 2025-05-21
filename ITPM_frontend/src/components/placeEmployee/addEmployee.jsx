import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./addEmployee.css";
import axios from "axios";
import toast from 'react-hot-toast';



const AddEmployee = () => {

    const employees = {
        empname:"",
        empcategory:"",
        emppassword:"",
        empdate:"",
        empdept:"",
        empage:"",
    }

    const [employee, setEmployee] = useState(employees);
    const navigate = useNavigate();

    const inputHandler = (e) =>{
        const {name, value} = e.target;
        setEmployee({...employee, [name]:value});
        
        
    }

    const submitForm = async(e) =>{
       e.preventDefault();
       await axios.post("http://localhost:3002/api/employee/createemp",employee)
       .then((response)=>{
        toast.success(response.data.msg, {position:"top-right"} )
        /*Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });*/
        navigate("/employee")
       }).catch(error => console.log(error))
        
    }
    return (
        <div className='addOrder'>
            <Link to={"/viewproduct"}>Back</Link>
            <h3>Add Employee</h3>
            <form className='addOrderForm' onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Employee Name</label>
                    <input type="text" onChange={inputHandler}  id="empname" name="empname" autoComplete='off' placeholder='Enter Employee Name' />
                </div>

                <div className="inputGroup">
                    <label htmlFor="brand">Password</label>
                    <input type="text" onChange={inputHandler} id="emppassword" name="emppassword" autoComplete='off' placeholder='Enter Password' />
                </div>
                <div className="inputGroup">
                    <label htmlFor="brand">Joined Date</label>
                    <input type="date" onChange={inputHandler} id="empdate" name="empdate" autoComplete='off' placeholder='Enter Date' />
                </div>
                
                <div className="inputRow">
    {/* Job Title */}
    <div className="inputGroup">
        <label htmlFor="empcategory">Job Title</label>
        <select onChange={inputHandler} id="empcategory" name="empcategory">
            <option value="">Select Title</option>
            <option value="IT Help Desk Technician">IT Help Desk Technician</option>
            <option value="Systems Administrator">Systems Administrator</option>
            <option value="Media Planner">Media Planner</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Accountant">Accountant</option>
            <option value="Trainees">Trainees</option>
            <option value="Senior Manager">Senior Manager</option>
        </select>
    </div>

    {/* Department */}
    <div className="inputGroup">
        <label htmlFor="empdept">Department</label>
        <select onChange={inputHandler} id="empdept" name="empdept">
            <option value="">Select Department</option>
            <option value="IT Department">IT Department</option>
            <option value="Finance Department">Finance Department</option>
            <option value="Sales Department">Sales Department</option>
            <option value="Marketing Department">Marketing Department</option>
            <option value="Events Department">Events Department</option>
            <option value="HR Department">HR Department</option>
            <option value="Admin Department">Admin Department</option>
        </select>
    </div>
</div>


                <div className="inputGroup">
                    <label htmlFor="quantity">Age</label>
                    <input type="quantity" onChange={inputHandler} id="empage" name="empage" autoComplete='off' placeholder='Enter Age' />
                </div>




                <div className="inputGroup">
                    <button type="submit">Add To System</button>
                </div>
            </form>
        </div>
    )
}

export default AddEmployee