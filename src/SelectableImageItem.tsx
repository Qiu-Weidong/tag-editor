import { useState } from "react";
import { IconButton, ImageListItem } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ImageState } from "./app/imageListSlice";


// 我需要一个 onOpen 事件以便打开图片
export default function SelectableImageItem(props: { 
  image: ImageState,
  onImageSelect: (image: ImageState) => void, 
  onImageUnselect: (image: ImageState) => void,
  onImageOpen: (image: ImageState) => void,
}) {

  const [hovered, setHovered] = useState(false);


  function clickImage() {
    if (props.image.isSelected)
      props.onImageUnselect(props.image);
    else
      props.onImageSelect(props.image);
  }


  return (<ImageListItem key={props.image.id} >
    <img
      srcSet={`${props.image.src}`}
      src={`${props.image.src}`}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      key={props.image.id}
      onClick={clickImage}
      onDoubleClick={() => props.onImageOpen(props.image)}
    />


    {/* 盖在 img 上方 */}
    {
      hovered ? <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom,  rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.25) 30%, rgba(0,0,0,0) 75%)',
        pointerEvents: 'none'
      }}></div> : ''
    }
    {
      props.image!.isSelected ? <IconButton
        onClick={() => props.onImageUnselect(props.image)}
        color='secondary' style={{ position: 'absolute', top: 0, left: 0 }}>
        <CheckCircleIcon />
      </IconButton> : ''
    }

  </ImageListItem>);
}





