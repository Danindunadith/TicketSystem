import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditPeople = () => {

    const peoples = {
        name: "",
        email:"",
        number: "",
        address: ""
    }

    const {id} = useParams();
    const navigate = useNavigate();
    const [people, setPeople] = useState(peoples);

    const inputChangeHandler = (e) =>{
        const {name, value} = e.target;
        setPeople({...people, [name]:value});
        console.log(people);
    }

    useEffect(()=>{
        axios.get(`http://localhost:3002/api/peoples/getonepeople/${id}`)
        .then((response)=>{
            setPeople(response.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[id])

    const submitForm = async(e)=>{
        e.preventDefault();
       await axios.put(`http://localhost:3002/api/peoples/updatepeople/${id}`,people)
       .then((response)=>{
        toast.success(response.data.msg, {position:"top-right"} )
        navigate("/admin/people")
       }).catch(error => console.log(error))
    }

    return (
        <div className='addOrder'>
            <Link to={"/people"}>Back</Link>
            <h3>Edit User</h3>
            <form className='addOrderForm' onSubmit={submitForm} >
                <div className="inputGroup">
                    <label htmlFor="brand">Name</label>
                    <input type="text" value={people.name} onChange={inputChangeHandler} id="name" name="name" autoComplete='off' placeholder='Brand' />
                </div>
                <div className="inputGroup">
                    <label htmlFor="model">Email</label>
                    <input type="text" value={people.email} onChange={inputChangeHandler} id="email" name="email" autoComplete='off' placeholder='Model' />
                </div>
                <div className="inputGroup">
                    <label htmlFor="quantity">Number</label>
                    <input type="quantity" value={people.number} onChange={inputChangeHandler} id="number" name="number" autoComplete='off' placeholder='Quantity' />
                </div>

                <div className="inputGroup">
                    <label htmlFor="quantity">Address</label>
                    <input type="quantity" value={people.address} onChange={inputChangeHandler} id="address" name="address" autoComplete='off' placeholder='Quantity' />
                </div>






                <div className="inputGroup">
                    <button type="submit">Edit User</button>
                </div>
            </form>
        </div>
    )
}

export default EditPeople