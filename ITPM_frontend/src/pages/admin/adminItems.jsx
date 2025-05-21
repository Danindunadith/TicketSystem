import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";



export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [itemsloaded, setItemsLoaded] = useState(false);
  const navigate =useNavigate()


  useEffect(() => {

    if(!itemsloaded){
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
        setItemsLoaded(true);
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }, [itemsloaded]);


  const handleDelete = (key) => {
    if(window.confirm("Are you sure You want to delete this item ?")){
    setItems(items.filter((item) => item.key !== key));
    const token = localStorage.getItem("token");

    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${key}`,{
      headers : {Authorization: `Bearer ${token}`},
    
    }).then((res)=>{
      console.log(res.data);
      setItemsLoaded(false);
   
    }).catch((err)=>{
      console.log(err);
    })
  }
  };

  return (
    <div className="w-full h-full p-6 flex items-center flex-col">
      {!itemsloaded && <div className="border-4 my-4 border-b-green-500 rounded-full animate-spin w-[100px] h-[100px]"></div>}
     {itemsloaded && <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border">Key</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Price ($)</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Dimension</th>
              <th className="p-3 border">date</th>
              <th className="p-3 border">Availability</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.key} className="hover:bg-gray-50">
                <td className="p-3 border text-center">{product.key}</td>
                <td className="p-3 border text-center">{product.name}</td>
                <td className="p-3 border text-center">${product.price.toFixed(2)}</td>
                <td className="p-3 border text-center">{product.category}</td>
                <td className="p-3 border text-center">{product.dimension}</td>
                <td className="p-3 border text-center">{product.dateAdded}</td>
                <td className="p-3 border text-center">
                  {product.availability ? (
                    <span className="text-green-600 font-semibold">Available</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  )}
                </td>
                <td className="p-3 border text-center space-x-2">
                  <button onClick={()=>{
                    navigate(`/admin/items/edit`, {state:product})
                  }} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.key)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
      <Link to="/admin/items/add" className="fixed right-4 bottom-4">
        <CiCirclePlus className="text-blue-500 text-6xl hover:text-blue-700 transition-all" />
      </Link>
    </div>
  );
}
