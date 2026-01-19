
export default function TestPage(){

  return(
    <div className="w-full h-full flex justify-center items-center bg-red-600 lg:bg-green-600">
      Test Page
    </div>
  )
}


// import { useState } from "react";

// import uploadFile from "../utils/mediaUpload";



// export default function TestPage(){

//   const [file, setFile] = useState(null);

//   async function handleUpload(){
//     const url = await uploadFile(file);
//     console.log(url);
//   }

//   return(
//     <div className="w-full h-full flex justify-center items-center">
//       <input type="file" 
//       onChange={(e)=>{
//         setFile(e.target.files[0]);
//       }}/>
//       <button className="bg-red-600 p-2 text-white rounded-xl" onClick={handleUpload}>Upload</button>
//     </div>
//   )
// }
