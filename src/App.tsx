import { AppBar, Button, IconButton, InputAdornment, TextField, Toolbar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import { Route, Routes, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api";
import ForwardImageGallery from "./ForwardImageGallery";



function App() {
  const gallery = useRef<any>(null);


  // 用于绑定输入内容
  const [inputValue, setInputValue] = useState(localStorage.getItem('path') || 'error');
  const [disableTextField, setDisableTextField] = useState(true);
  const [errinfo, setErrInfo] = useState({ error: false, helperText: "" });


  // 导航栏需要定义一个 loading 的 state 以便决定使用刷新还是停止.
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    gallery.current?.refresh();
  }, []);

  async function check_path() {
    invoke("check_path", { path: inputValue }).then(() => {
      setErrInfo({
        error: false,
        helperText: ''
      });
      setDisableTextField(true);
      // 简单点,直接设置localstorage
      localStorage.setItem('path', inputValue);
    }).catch((err: string) => {
      setErrInfo({
        error: true,
        helperText: err
      });
    });
  }



  return (
    <div>
      {/* 导航条 */}
      <AppBar position="fixed" color="default"  >
        <Toolbar variant="dense" >
          {/* 返回按钮 */}
          <IconButton>
            <ChevronLeftIcon />
          </IconButton>

          <IconButton >
            <ChevronRightIcon />
          </IconButton>

          <IconButton onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>

          {/* 刷新按钮 */}
          {
            !loading ? <IconButton disabled={!disableTextField} onClick={() => gallery.current?.refresh()}>
              <RefreshIcon />
            </IconButton> : <IconButton onClick={() => gallery.current?.stop()}>
              <CloseIcon />
            </IconButton>
          }




          {/* 输入框(修改路径) */}
          <TextField variant="outlined" margin="dense" fullWidth size="small" hiddenLabel color="secondary"
            InputProps={{
              endAdornment: <InputAdornment position="end">
                {
                  disableTextField ?
                    <Button onClick={() => setDisableTextField(false)}>修改</Button> :
                    <Button onClick={() => check_path()}>完成</Button>
                }
              </InputAdornment>
            }}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            value={inputValue}
            disabled={disableTextField}
            helperText={errinfo.helperText}
            error={errinfo.error}
            onKeyDown={(e) => {
              // 还是检测一下回车
              if (e.key == 'Enter') {
                check_path();
              }
            }}
          ></TextField>

        </Toolbar>
      </AppBar>

      {/* 占位 */}
      <Toolbar variant="dense"></Toolbar>

      {/* 正式内容 */}
      <Routes>
        <Route path="/gallery" element={<ForwardImageGallery ref={gallery} onLoadingChange={setLoading} />}></Route>
      </Routes>


    </div>
  );
}


export default App;




