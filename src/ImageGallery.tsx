import { Alert, Fab, ImageList, LinearProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import EditNoteIcon from '@mui/icons-material/EditNote';
import SelectableImageItem from "./SelectableImageItem";
import CaptionToolBar from "./CaptionToolBar";
import { useDispatch } from "react-redux";
import { deletebyindex } from "./app/alertMsgSlice";
import { ImageState } from "./app/imageListSlice";
import { selectImage, unselectImage, openAllFilterImages, openImage as openOneImage } from "./app/imageListSlice";
import LightBox from "./LightBox";



export default function ImageGallery() {
  const dispatch = useDispatch();

  // selector
  const alerts = useSelector((state: RootState) => state.alert.alerts);
  const progress = useSelector((state: RootState) => state.imagedir.progress);
  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isFiltered));
  
  
  const [cols, setCols] = useState(8);
  

  return (<div style={{ marginLeft: 0, marginTop: 10, marginRight: 0, marginBottom: 0, border: 0 }}>

    {
      alerts.map((alert, index) => (<Alert key={index} severity={alert.severity} onClose={() => dispatch(deletebyindex(index))}>{alert.message}</Alert>))
    }

    {/* 进度条或工具栏 */}
    {
      progress < 100 ? <LinearProgress variant="determinate" value={progress} /> : <CaptionToolBar
        onChangeCols={(cols) => setCols(cols)} />
    }

    {
      images.length > 0 ? <ImageList variant="masonry" cols={cols} gap={4} style={{ marginTop: 0 }} >

        {images.map((item) => (
          <SelectableImageItem image={item} key={item.id} 
            onImageOpen={openImage} 
            onImageSelect={(image) => dispatch(selectImage(image.id))} 
            onImageUnselect={(image) => dispatch(unselectImage(image.id))} />
        ))}

      </ImageList> : '没有可展示的图片'
    }




    {
      progress < 100 ? '' : <Fab color="secondary" variant="extended" aria-label="edit" style={{ position: 'fixed', right: 10, bottom: 10 }}>
        编辑已选图片
        <EditNoteIcon />
      </Fab>
    }

    {/* LightBox 放这里 */}
    <LightBox />
  </div>);




  function openImage(image: ImageState) {
    // 打开所有过滤得到的图片
    dispatch(openAllFilterImages());
    dispatch(openOneImage(image.id));
  }
}


