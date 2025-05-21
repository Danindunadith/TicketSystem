import { useState } from "react"
import mediaUpload from "../utils/mediaUpload"

export default function Testing(){

    const[file,setFile] = useState(null)

    function uploadFile(){

      console.log(file)
        mediaUpload(file).then((url)=>{
          console.log(url)
        })
        
    }

    return(
    <div className="w-full flex flex-col justify-center items-center h-screen">
       <input type="file" multiple onChange={(e)=>{setFile(e.target.files[0])}} />
       <button  onClick ={uploadFile} className="w-[300px] flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg shadow-md tracking-wide  cursor-pointer hover:bg-blue-600 transition text">
         Upload
       </button>
    </div>
    )
}