import { useState } from "react";
import { IconButton, ImageList, ImageListItem } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from "react-redux";
import { selectImage, unselectImage } from "./app/imageListSlice";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";


// 我需要一个 onOpen 事件以便打开图片
function SelectableImageItem(props: { imageid: string }) {
  const image = useSelector((state: RootState) =>
    state.images.images.find((image) => image.id === props.imageid));
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();


  function clickImage() {
    if (image!.isSelected)
      dispatch(unselectImage(image!.id));
    else
      dispatch(selectImage(image!.id));
  }


  return (<ImageListItem key={props.imageid} >
    <img
      srcSet={`${image!.src}`}
      src={`${image!.src}`}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      key={image!.id}
      onClick={clickImage}
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
      image!.isSelected ? <IconButton
        onClick={() => dispatch(unselectImage(image!.id))}
        color='secondary' style={{ position: 'absolute', top: 0, left: 0 }}>
        <CheckCircleIcon />
      </IconButton> : ''
    }

  </ImageListItem>);
}



export default function SelectableImageList(props: { cols: number }) {
  // 注意,这里应该得到过滤之后的结果, 
  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isFiltered));

  return (
    <>
      {
        images.length > 0 ? <ImageList variant="masonry" cols={props.cols} gap={4} style={{ marginTop: 0 }} >

          {images.map((item) => (
            <SelectableImageItem imageid={item.id} key={item.id} />
          ))}

        </ImageList> : '没有可展示的图片'
      }

    </>
  );
}




