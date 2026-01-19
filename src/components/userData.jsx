// export default function UserData() {
//   return(
//     <div>
//               <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" width="30px"/>
//               <span>Cart (0)</span>
//               <p>Linuka jayasinghe</p>
//               <button>Checkout</button>
//     </div>
//   );
// }



import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserData(){
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token != null){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response)=>{
                setUser(response.data);
            }).catch(()=>{
                setUser(null);
            })
        }
    },[])
    const [selectedOption, setSelectedOption] = useState("user");

    return (
        <>
            {
                user?
                <div className="w-[150px] flex flex-row">
                    <img src={user.image} referrerpolicy="no-referrer" className="w-[50px] rounded-full h-[50px]"/>
                    <select className="bg-transparent outline-none ml-2 mt- text-white" value={selectedOption}
                     onChange={
                        (e)=>{
                            
                            if(e.target.value == "logout"){
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }
                            setSelectedOption("user")
                        }
                    }>
                        <option className="bg-accent" value={"user"}>{user.firstName}</option>
                        <option className="bg-accent" value={"logout"}>Logout</option>
                    </select>
                </div>:
                <div className="w-[150px] flex flex-row">
                    <Link to="/login" className="mx-2 px-4 py-2 bg-white text-accent rounded-full">Login</Link>
                    <Link to="/register" className="mx-2 px-4 py-2 bg-white text-accent rounded-full">Register</Link>
                </div>
            }
        </>
    )


}

