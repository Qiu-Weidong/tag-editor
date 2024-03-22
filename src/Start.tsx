import { Button, InputAdornment, TextField } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { push } from "./app/imageDirSlice";

function Start() {
  const dispatch = useDispatch();

  const [path, setPath] = useState("");
  const [errinfo, setErrInfo] = useState({ error: false, helperText: "" });

  const navigate = useNavigate();

  async function check_path_and_jump() {
    invoke("check_path", { path }).then(() => {
      setErrInfo({
        error: false,
        helperText: ''
      });

      // 将路径保存在 redux 中
      dispatch(push(path));

      // 跳转, 直接从这里跳转到 gallery
      navigate("/app/gallery");
    }).catch((err: string) => {
      setErrInfo({
        error: true,
        helperText: err
      });
    });
  }

  return (
    // 外层 div 负责将子元素居中
    <div className="container" >

      {/* 内层 div 放置实际元素 */}
      <div style={{ width: "100%" }}>
        {/* todo 放置图标 */}

        <TextField label="请输入文件夹路径"
          id="outlined-start-adornment"
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <Button onClick={check_path_and_jump}>导入</Button>
            </InputAdornment>,
          }}
          variant="standard"
          onChange={(e) => setPath(e.currentTarget.value)}
          fullWidth
          helperText={errinfo.helperText}
          error={errinfo.error}
        />
      </div>


      <img src="https://images.unsplash.com/photo-1549388604-817d15aa0110"
        style={{
          zIndex: -1,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }} />
      

    </div>
  );
}


export default Start;

