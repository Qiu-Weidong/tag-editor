import { AppBar, Button, IconButton, InputAdornment, TextField, Toolbar } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { invoke } from "@tauri-apps/api";
import { push, back, forward, setProcessState, setImageLoaded } from "../../app/imageDirSlice";
import { clearImageList, pushImage, setLabels } from "../../app/imageListSlice";
import shortid from "shortid";
import { ImageState, LabelState } from "../../app/imageListSlice";
import { push as pushAlert, clearAlerts } from "../../app/alertMsgSlice";


export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 保存当前的 imagedir
  const imagedir = useSelector((state: RootState) => state.imagedir.currentDir) || '';
  const lastdir = useSelector((state: RootState) => state.imagedir.historyDir[state.imagedir.historyDir.length - 1] || null);
  const forwarddir = useSelector((state: RootState) => state.imagedir.cachedReturnDir[state.imagedir.cachedReturnDir.length - 1] || null);


  const ctl = useRef<{ loading: boolean, stop: boolean, init: boolean }>({ loading: false, stop: false, init: true });
  const [loading, setLoading] = useState(ctl.current.loading);
  const [disableTextField, setDisableTextField] = useState(true);
  const [errinfo, setErrInfo] = useState({ error: false, helperText: "" });
  const [inputValue, setInputValue] = useState(imagedir);

  const imageLoaded = useSelector((state: RootState) => state.imagedir.imageLoaded);
  if(! imageLoaded) {
    refresh(imagedir);
    dispatch(setImageLoaded(true));
  }



  const imageWidth = useSelector((state: RootState) => state.setting.thumbnailWidth);

  function checkStem(image_path_list: { extension: string, filename: string, filepath: string, stem: string }[]) {
    const counter = new Map<string, number>([]);
    for (const imagePath of image_path_list) {
      counter.set(imagePath.stem, (counter.get(imagePath.stem) || 0) + 1);
    }
    for (const [stem, cnt] of counter.entries()) {
      if (cnt > 1) {
        dispatch(pushAlert({
          severity: 'warning',
          message: `there are more than one '${stem}' in the directory.`
        }));
      }
    }
  }

  async function loadImages(imagedir: string) {
    // 第一步清空原始数据
    dispatch(clearImageList());


    const image_path_list: { extension: string, filename: string, filepath: string, stem: string }[] = await invoke("glob_images", { imagedir });
    // 这里就可以检查 stem 是否唯一, 不唯一则发出警告
    checkStem(image_path_list);


    let current = 0;
    const total = image_path_list.length;
    // 统计标签的频率
    const _labels = new Map<string, number>();

    for (const imagePath of image_path_list) {
      // 这里返回的数据不包含 id
      const image: { src: string, width: number, height: number, filename: string, path: string, captions: string[] } = await invoke("load_thumbnail_with_captions", { imagePath: imagePath.filepath, imageWidth: imageWidth, captionExt: 'txt' });

      // 给图片分配一个 id
      const image_id = shortid.generate();

      const _image: ImageState = { 
        src: image.src, 
        captions:image.captions, 
        id: image_id, 
        isSelected: false, 
        isFiltered: true, 
        isOpen: false,
        path: imagePath.filepath,
        filename: imagePath.stem,
      };
      dispatch(pushImage(_image));

      for (const caption of image.captions) {
        // 统计标签的频率
        const cnt = (_labels.get(caption) || 0) + 1;
        _labels.set(caption, cnt);
      }

      current += 1;
      dispatch(setProcessState(current / total * 100))

      // 增加一个检查是否中止的逻辑.
      if (ctl.current.stop) {
        ctl.current.stop = false;
        dispatch(setProcessState(100))
        break;
      }

    }


    // 将 _labels 转换为数组 
    const labels: LabelState[] = []
    for (const [label, frequency] of _labels.entries()) {
      labels.push({
        content: label,
        frequency,
      });
    }


    dispatch(setLabels(labels));
  }

  function refresh(imagedir: string) {
    if (!ctl.current.loading && imagedir) {
      setLoading(true);
      ctl.current.loading = true;
      loadImages(imagedir).then(() => {
        setLoading(false);
        ctl.current.loading = false;
      }).catch(err => console.error(err));
    }
  }


  function stoploading() {
    ctl.current.stop = true;
  }




  async function check_path() {
    invoke("check_path", { path: inputValue }).then(() => {
      setErrInfo({
        error: false,
        helperText: ''
      });

      setDisableTextField(true);
      dispatch(push(inputValue));
      refresh(inputValue);

    }).catch((err: string) => {
      setErrInfo({
        error: true,
        helperText: err
      });
    });
  }



  return (<AppBar position="fixed" color="default"  >
    <Toolbar variant="dense" >
      {/* 返回按钮 */}
      <IconButton disabled={(lastdir === null) || loading} onClick={() => {
        dispatch(back());
        if (lastdir) {
          setInputValue(lastdir);
          refresh(lastdir);
        }
      }}>
        <ChevronLeftIcon />
      </IconButton>

      <IconButton disabled={(forwarddir === null) || loading} onClick={() => {
        dispatch(forward());
        if (forwarddir) {
          setInputValue(forwarddir);
          refresh(forwarddir);
        }
      }} >
        <ChevronRightIcon />
      </IconButton>

      <IconButton onClick={() => {stoploading(); navigate("/settings");}}><SettingsIcon /></IconButton>
      <IconButton onClick={() => {stoploading(); navigate("/help");}}> <HelpIcon /> </IconButton>
      <IconButton onClick={() => {
        // 会主页之间要先将没有加载完成的stop了
        stoploading();
        dispatch(clearAlerts());
        navigate("/");
      }}>
        <HomeIcon />
      </IconButton>

      {/* 刷新按钮 */}
      {
        !loading ? <IconButton disabled={!disableTextField} onClick={() => refresh(imagedir)}>
          <RefreshIcon />
        </IconButton> : <IconButton onClick={stoploading}>
          <CloseIcon />
        </IconButton>
      }




      {/* 输入框(修改路径) */}
      <TextField variant="outlined" margin="dense" fullWidth size="small" hiddenLabel color="secondary"
        InputProps={{
          endAdornment: <InputAdornment position="end">
            {
              disableTextField ?
                <Button disabled={ctl.current.loading} onClick={() => setDisableTextField(false)}>修改</Button> :
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
  </AppBar>);
}


