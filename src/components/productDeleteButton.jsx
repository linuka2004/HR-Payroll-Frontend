import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ProductDeleteButton(props) {

  const productID = props.productID;
  const reload = props.reload;
  const [isMessageOpen, setIsMessageOpen] =  useState(false);
  const[isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(){
    setIsDeleting(true);
    const token = localStorage.getItem("token");
      axios
        .delete(import.meta.env.VITE_BACKEND_URL + "/products/" + productID, {
            headers:{
               authorization: `Bearer ${token}`
               }
            }).then(
                        ()=>{
                          toast.success("Product deleted successfully.");
                          setIsDeleting(false);
                          setIsMessageOpen(false);
                          reload();
                        }
            ).catch(()=>{
              toast.error("Error deleting product.");
              setIsDeleting(false);
            })
    
  }

  return (
    <>
    <button onClick={()=>{setIsMessageOpen(true)}} className="w-[100px] bg-red-600 text-white flex justify-center items-center p-2 rounded-lg cursor-pointer hover:bg-red-700 transition-all">
      Delete
    </button>
    {isMessageOpen && <div className="w-[100vw] fixed inset-0 z-[9999] top-0 left-0 h-screen bg-black/40 flex justify-center items-center"><div className="w-[600px] h-[300px] bg-primary rounded-2xl relative flex justify-center items-center flex-col p-10 shadow-xl">
      <button onClick={()=>{setIsMessageOpen(false)}} className="w-[40px] h-[40px] bg-red-600 text-white rounded-full text-xl font-bold cursor-pointer hover:bg-red-800 absolute right-[-35px] top-[-35px]">
        X
      </button>
      <h1 className="text-2xl mb-6 text-center">Are you sure you want to delete this product {productID}?</h1>
      <div className="w-full flex justify-center gap-10">
        <button
          disabled={isDeleting}
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-900 transition">
            Delete
          </button>
        <button
        onClick={()=>{setIsMessageOpen(false)}}
          className="bg-secondary text-primary px-4 py-2 rounded hover:bg-accent transition">
            Cancel
          </button>
      </div>
    </div></div>}

    </>
  );
}

/*<button onClick={
                    ()=>{
                      const token = localStorage.getItem("token");
                      axios.delete(import.meta.env.VITE_BACKEND_URL + "/products/" + item.productID, {
                        headers:{
                          authorization: `Bearer ${token}`
                        }
                      }).then(
                        ()=>{
                          toast.success("Product deleted successfully.");
                          setLoaded(false); // To reload the products list
                        }
                      )
                    }
                  } className="w-[100px] bg-red-600 text-white flex justify-center items-center p-2 rounded-lg cursor-pointer hover:bg-red-700 transition-all">
                    Delete
                  </button>
*/