import { useState } from "react";

export default function test() {

  const [count, setCount] = useState(0)
  const [status, setStatus] =  useState("😥")

  //let count = 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <div className="w-[400px] h-[300px] shadow-2xl flex justify-center items-center">
        <button className="w-[100px] h-[50px] bg-red-600 text-white" 
        onClick={()=>{
          // console.log("Decrement Clicked")
          // count = count - 1;
          // console.log(count)
          setCount(count-1);
        }}>
          Decrement</button>

        <h1 className="w-[100px] h-[50px] text-[30px] text-center">{count}</h1>

        <button onClick={()=>{
          // console.log("Increment Clicked")
          // count = count + 1;
          // console.log(count)
          setCount(count+1);
        }} className="w-[100px] h-[50px] bg-blue-600 text-white">Increment</button>
      </div>
      <div className="w-[400px] h-[300px] shadow-2xl flex justify-center items-center flex-col">
          <span className="h-[30px] text-2xl font-bold">
            {/* 😥😉 */}
            {status}
          </span>
          <div className="w-full h-[50px] border flex justify-center items-center">
            <button className="w-[100px] text-white h-full bg-red-600" onClick={()=>{
              setStatus("😥")
            }}>OFF</button>
            <button className="w-[100px] text-white h-full bg-green-600" onClick={()=>{
              setStatus("😉")
            }}>ON</button>
          </div>
        </div>  
    </div>
  )
}