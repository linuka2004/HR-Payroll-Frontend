import { useState } from "react";

export default function ImageSlider(props) {
  const images = props.images;
  const [activeIndex, setActiveIndex] = useState(0);
  return(
    <div className="w-full flex flex-col items-center">
      <img src={images[activeIndex]} className="w-[80%] h-[500px] object-contain"/*object-contain eken wenne mulu full image ekama dagannawa|| hbai object-cover eken wenne image eke meda tika mainly enn crop krgnnwa*/ />
      <div className="w-full h-[100px] flex flex-row justify-center items-center gap-4">
        {
          images.map(
            (image, index)=>{
              return(
              <img src={images[index]} className={"w-[90px] h-[90px] object-cover rounded-lg border-2 border-accent"+((activeIndex==index)?"border-2 border-amber-400":" ")} onClick={
                ()=>{
                  setActiveIndex(index);
                }
              }/>
          )}
          )
        }
      </div>
    </div>
  )
}