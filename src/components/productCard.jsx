// export default function productCard(props){

//   const product = props.product;

//   console.log (props.name);
//   return (
//     <div className="w-[300px] h-[400px] m-4 shadow-2xl  bg-red-600">
//         <div className="w-full h-[250px] relative">
//           <img 
//             src={product.images[1]} 
//             className="w-full h-full absolute bg-white object-cover"
//          />
//           <img 
//             src={product.images[0]} 
//             className="w-full h-full absolute bg-white hover:opacity-0 transition-300 object-cover"
//          />

//         </div>
        
//         <div className="w-full h-[150px] p-2 flex flex-col bg-red-400">
//           <h1 className="text-center font-semibold text-lg">{product.name}</h1>
//         </div>
//         <div className="w-full flex flex-row">
//           {
//             product.labelledPrice
//           }
//         </div>
//       </div>
//   );

// }
// import { Link } from "react-router-dom";

// export default function ProductCard(props) {

//     const product = props.product;
    
// //meke view details hdpu het tikak oluwe thiyagann.
// 	return (
// 		<Link to={"/overview/" + product.productID} className="w-[300px] h-[400px]  m-4 shadow-2xl cursor-pointer relative hover:[&_.buttons]:opacity-100 hover:[&_.primary-image]:opacity-0">

// 			<div className="w-full h-[250px]  relative">
// 				<img
// 					src={product.images[1]}
// 					className="w-full h-full absolute bg-white object-cover"/>
// 				<img
// 					src={product.images[0]}
// 					className="w-full h-full absolute bg-white primary-image transition-opacity duration-500 object-cover"/>
// 			</div>
			
// 			<div className="w-full h-[150px] p-2 flex flex-col  justify-between" /*//justify-between kiyanne puluwn tharam athin thiyen ek div ek athule.*/> 
// 				<h1 className="text-center text-lg">{product.name}</h1> 
// 				<div className="w-full flex flex-col items-center">
// 					{
// 						product.labelledPrice > product.price &&
// 						<h2 className="text-secondary/80 line-through decoration-gold/70 decoration-2 mr-2">
// 							LKR. {product.labelledPrice.toFixed(2)}
// 						</h2>
// 					}
// 					<h2 className="text-accent font-semibold text-2xl">
// 						LKR. {product.price.toFixed(2)}
// 					</h2>

// 				</div>
// 			</div>

// 			<div className="w-full h-[150px] bottom-0 opacity-0 absolute buttons bg-accent flex flex-row gap-4 justify-center items-center transition-opacity duration-300">
// 				<button  className="border-2 border-white text-white hover:bg-accent hover:text-white transition-colors duration-150 h-[50px] w-[150px] flex justify-center items-center">View Details</button >
// 			</div>
			
// 		</Link>
// 	);

// }

import { Link } from "react-router-dom";

export default function ProductCard(props) {
  console.log(props.name);
  const product = props.product;

  return (
    <Link to={"/overview/" + product.productID} >
      {/* <h1></h1>
      <img src={props.image} />
      <p>{props.price}</p> */}

      <div className="w-[300px] h-[400px]  m-4 shadow-2xl cursor-pointer relative hover:[&_.buttons]:opacity-100 hover:[&_.primary-image]:opacity-0">
        <div className="w-full h-[250px]  relative">
          <img
            src={product.images[1]}
            className="w-full h-full absolute bg-white object-cover"/>
          <img
            src={product.images[0]}
            className="w-full h-full absolute bg-white primary-image transition-opacity duration-500 object-cover"/>
        </div>
        
        <div className="w-full h-[150px] p-2 flex flex-col  justify-between">
          <h1 className="text-center text-lg">{product.name}</h1>
          <div className="w-full flex flex-col items-center">
            {
              product.labelledPrice > product.price &&
              <h2 className="text-secondary/80 line-through decoration-gold/70 decoration-2 mr-2">
                LKR. {product.labelledPrice.toFixed(2)}
              </h2>
            }
            <h2 className="text-accent font-semibold text-2xl">
              LKR. {product.price.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="w-full h-[150px] bottom-0 opacity-0 absolute buttons bg-white flex flex-row gap-4 justify-center items-center transition-opacity duration-300">
          <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-150 h-[50px] w-[150px] flex justify-center items-center cursor-pointer">View Details</button>
        </div>
      </div>
    </Link>
  );
}
