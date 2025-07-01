import axiosInstance from '../../config/axiosConfig';
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function AddItemPage() {
  const [productKey, setProductKey] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [productCategory, setProductCategory] = useState("concert");
  const [productDimension, setProductDimension] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages,setProductImages] = useState([]);
  const navigate = useNavigate();

  async function handleAddItem() {
    const promises= []

    for(let i=0; i<productImages.length;i++){
      console.log(productImages[i]);
      const Promise = mediaUpload(productImages[i])
      promises.push(Promise);

      //---Only 5 images can upload---
      // if(i==5){
      //   toast.error("You can only upload 25 images at at a time")
      //   break;
      // }
    }

   
      console.log( productKey,productName,productPrice,productCategory,productDimension,productDescription);
    const token = localStorage.getItem("token")
  

    if(token){
        try{

    //---promises run  . then methode---

    // Promise.all(Promises).then((result)=>{
    //   console.log(result)

    // }).catch((err)=>{
    //   toast.error(err)
    // });

    const imageUrls = await Promise.all(promises);  //async awit methode (get image urls)
    
      const result= await axiosInstance.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`,{
            key:productKey,
            name:productName,
            price:productPrice,
            category:productCategory,
            dateAdded:eventDate,
            timeAdded:eventTime,
            description:productDescription,
            dimension:productDimension,
            image : imageUrls  //transfer images to backend
        },{
            headers :{
                Authorization : "Bearer "+ token
            }
        });
        toast.success(result.data.message);
        navigate("/admin/items");

    }catch(err){
        toast.error("product not added ");
        
    }
        
    }else{
        toast.error("You are not authorized to do action")
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center p-4">
    <h1 className="text-lg font-bold mb-4">Add Items</h1>
    <div className="w-[400px] border p-4 flex flex-col items-center gap-2 rounded-lg shadow-md ">
      <input 
        type="text"
        placeholder="Event Key"
        value={productKey}
        onChange={(e) => setProductKey(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />
      <input
        type="text"
        placeholder="Event Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />
      <input
        type="number"
        placeholder="Product Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        className="w-[300px] p-2 border rounded placeholder-gray-500"
      />


   <input
        type="text"
        placeholder="Event Date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />

<input
        type="text"
        placeholder="Event Time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />







      <select
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
        className="w-[300px] p-2 border rounded placeholder-gray-500"
      >
        <option value="Concert">Concert</option>
        <option value="Theratre">Theratre</option>
        <option value="Family & Others">Family & Others</option>
      </select>
      <input
        type="text"
        placeholder="Event Venue"
        value={productDimension}
        onChange={(e) => setProductDimension(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />
      <input
        type="text"
        placeholder="Event Description"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        className="w-full p-2 border rounded placeholder-gray-500"
      />
      <input
        type="file"
        multiple
        onChange={(e) => {
          setProductImages(e.target.files);
        }}
        className="w-full p-2 border rounded "
      />
      <button
        onClick={handleAddItem}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
      <button
        onClick={() => {
          navigate("/admin/items");
        }}
        className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cancel
      </button>
    </div>
  </div>
  );
  
}
