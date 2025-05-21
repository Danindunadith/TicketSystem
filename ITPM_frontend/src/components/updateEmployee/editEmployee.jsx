import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditEmployee = () => {

    const employees = {
        empname: "",
        empcategory:"",
        emppassword: "",
        empdate: "",
        empdept: "",
        empage:""
    }

    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(employees);

    const inputChangeHandler = (e) =>{
        const {name, value} = e.target;
        setEmployee({...employee, [name]:value});
        console.log(employee);
    }

    useEffect(()=>{
        axios.get(`http://localhost:8000/api/employee/getoneemployee/${id}`)
        .then((response)=>{
            setEmployee(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[id])

    const submitForm = async(e)=>{
        e.preventDefault();
       await axios.put(`http://localhost:8000/api/employee/updateemployee/${id}`,employee)
       .then((response)=>{
        toast.success(response.data.msg, {position:"top-right"} )
        navigate("/employee")
       }).catch(error => console.log(error))
    }

    return (
        <div className='addOrder'>
            <Link to={"/employee"}>Back</Link>
            <h3>Add Employee</h3>
            <form className='addOrderForm' onSubmit={submitForm}>
                <div className="inputGroup">
                    <label htmlFor="name">Employee Name</label>
                    <input 
  type="text" 
  onChange={inputChangeHandler}  
  id="empname" 
  name="empname" 
  autoComplete='off' 
  placeholder='Enter Employee Name' 
  value={employee.empname} 
/>

                </div>

                <div className="inputGroup">
                    <label htmlFor="brand">Password</label>
                    <input type="text" onChange={inputChangeHandler} id="emppassword" name="emppassword" autoComplete='off' placeholder='Enter Password' value={employee.emppassword}/>
                </div>
                <div className="inputGroup">
                    <label htmlFor="brand">Joined Date</label>
                    <input type="date" onChange={inputChangeHandler} id="empdate" name="empdate" autoComplete='off' placeholder='Enter Date'value={employee.empdate} />
                </div>
                
                <div className="inputRow">
    {/* Job Title */}
    <div className="inputGroup">
        <label htmlFor="empcategory">Job Title</label>
        <select onChange={inputChangeHandler} id="empcategory" name="empcategory" value={employee.empcategory}>
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
        <select onChange={inputChangeHandler} id="empdept" name="empdept" value={employee.empdept}>
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
                    <input type="quantity" onChange={inputChangeHandler} id="empage" name="empage" autoComplete='off' placeholder='Enter Age' value={employee.empage}/>
                </div>




                <div className="inputGroup">
                    <button type="submit">Edit Details</button>
                </div>
            </form>
        </div>
    )
}

export default EditEmployee