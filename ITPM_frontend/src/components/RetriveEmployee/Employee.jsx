import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from '../../config/axiosConfig';
import toast from "react-hot-toast";
import "./Employee.css";


const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredEmployees, setFilteredEmployees] = useState([]); // State for filtered products

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("employee/getallemp");
      setEmployees(response.data);
      setFilteredEmployees(response.data); // Initially, all products are displayed
    };

    fetchData();
  }, []);

  // Filter products based on the search term
  
  useEffect(() => {
    const results = employees.filter((employee) =>
      employee.empname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.empcategory.toLowerCase().includes(searchTerm.toLowerCase()) 
    
    );
    setFilteredEmployees(results);
  }, [searchTerm, employees]);



  const deleteEmployee = async (employeeId) => {
    await axiosInstance.delete(`employee/deleteemp/${employeeId}`)
      .then((response) => {
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== employeeId));
        toast.success(response.data.msg, { position: 'top-right' });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='OrderTable'>
      <Link to={"/createemp"} className='addButton'>Add New Employee</Link>
      <h3>Employee List</h3>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, category, or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Employee_Id</th>
            <th>Employee Name</th>
            <th>Joined Date</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Age</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredEmployees.map((employee, index) => {
              return (
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.empname}</td>
                  <td>{employee.empdate}</td>
                  <td>{employee.empcategory}</td>
                  <td>{employee.empdept}</td>
                  <td>{employee.empage}</td>

                  <td className='actionButtons'>
                    <Link to={`/editemp/` + employee._id}>Edit</Link>
                  </td>

                  <td className='actionButtons'>
                    <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
                  </td>

                  
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default Employee;
