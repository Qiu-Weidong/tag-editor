import { Toolbar } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import SelectableImageList from "./SelectableImageList";



function App() {




  return (
    <div>
      {/* 导航条 */}
      <Header />

      {/* 占位 */}
      <Toolbar variant="dense"></Toolbar>

      {/* 正式内容 */}
      <Routes>
        <Route path="/gallery" element={<SelectableImageList cols={6}/>}></Route>
      </Routes>


    </div>
  );
}


export default App;




