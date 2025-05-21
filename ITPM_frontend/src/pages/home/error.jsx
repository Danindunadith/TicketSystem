import { Link } from "react-router-dom";

export default function ErrorNotFound(){
    return(
        <div>
            <h1>404 Error : Page Not Found</h1>
            <Link className= "bg-[#f0ad38] p-1 "to="/">Go back Home</Link>
        </div>
    )
}