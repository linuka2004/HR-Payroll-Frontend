import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";


export default function HomePage() {
    return (
      <div>
        <div className="w-full h-full overflow-y-scroll max-h-full">
          <Header/>
            <div className="w-full min-h-[calc(100%-80px)]">
              <Routes>
                <Route path="/" element={<h1>home</h1>} />
                <Route path="/products" element={<h1>products</h1>} />
                <Route path="/about" element={<h1>about</h1>} />
                <Route path="/contact" element={<h1>contact</h1>} />
                <Route path="/*" element={<h1>Page Not Found</h1>} />
              </Routes>
            </div>
            {/* <Footer /> */}
        </div>
        <Footer />
        </div>
    )
}