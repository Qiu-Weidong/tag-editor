import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import ImageGallery from "./page/filter/ImageGallery";


function App() {




  return (
    <>
      {/* 导航条 */}
      <Header />

      {/* 占位 */}
      {/* <Toolbar variant="dense"></Toolbar> */}

      {/* 正式内容 */}
      <Routes>
        <Route path="/gallery" element={<ImageGallery />}></Route>
        
      </Routes>


    </>
  );
}


export default App;




