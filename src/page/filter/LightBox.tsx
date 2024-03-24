import { CircularProgress, Fab, IconButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ImageState } from "../../app/imageListSlice";



export default function LightBox(props: {
  images: ImageState[],
  defaultShowIndex: number,
  onClose: () => void,
}) {
  const [currentImage, setCurrentImage] = useState<{ index: number, src: string | undefined }>({ index: props.defaultShowIndex, src: undefined });
  useEffect(() => { loadImageByIndex(props.defaultShowIndex) }, [props.defaultShowIndex]);



  return (<div style={{
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }} 
  autoFocus
  onKeyDown={(event) => {
    if (event.key === 'ArrowLeft') {
      prevImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    }
  }} 
  tabIndex={-1}
  >



    <Fab style={{ position: 'absolute', left: 20, }} onClick={prevImage} color="warning" size="small"><ChevronLeftIcon /></Fab>


    {
      currentImage.src ? <img src={currentImage.src} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <CircularProgress />
    }


    <Fab style={{ position: 'absolute', right: 20, }} onClick={nextImage} color="warning" size="small" ><ChevronRightIcon /></Fab>


    <IconButton style={{ position: 'absolute', right: 20, top: 5, }} onClick={props.onClose} color="info"> <CloseIcon /> </IconButton>
  </div>
  );



  async function loadImageByIndex(index: number) {
    setCurrentImage((current) => ({ ...current, src: undefined }));

    const image = props.images[index];

    if (!image) return;

    // 然后根据 image.path 加载原始图像
    const result: { src: string, filename: string, width: number, height: number, path: string } = await invoke("load_image", { imagePath: image.path });
    setCurrentImage({
      src: result.src, index
    });
  }

  async function nextImage() {

    const index = ((currentImage?.index ?? -1) + 1) % props.images.length;
    loadImageByIndex(index);
  }

  async function prevImage() {
    const index = ((currentImage?.index ?? 1) + props.images.length - 1) % props.images.length;
    loadImageByIndex(index);
  }
}



