import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { CircularProgress, IconButton } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { closeAllImages } from "./app/imageListSlice";
import { useState } from "react";
import { invoke } from "@tauri-apps/api";



export default function LightBox() {
  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isOpen));

  const [currentImage, setCurrentImage] = useState<{ id: string, index: number, src: string } | undefined>(undefined);
  


  const dispath = useDispatch();


  return (
    <>
      {
        images.length > 0 ? <div style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <IconButton style={{ position: 'absolute', right: 15, top: 5, }}  onClick={() => 
            {dispath(closeAllImages()); setCurrentImage(undefined);}}> <CloseIcon /> </IconButton>
          

          <IconButton style={{ position: 'absolute', left: 15, }} onClick={prevImage} ><ChevronLeftIcon /></IconButton>
          {
            currentImage ? <img src={currentImage.src}  style={{ maxWidth: '100%', maxHeight: '100%' }} />: <CircularProgress />
          }
          

          <IconButton style={{ position: 'absolute', right: 15, }} onClick={nextImage} ><ChevronRightIcon /></IconButton>



        </div> : ''
      }
    </>
  );



  async function loadImageByIndex(index: number) {
    setCurrentImage(undefined);

    const image = images[index];

    if(! image) return;
    // 然后根据 image.path 加载原始图像
    const result: { src: string, filename: string, width: number, height: number, path: string } = await invoke("load_image", { imagePath: image.path });
    setCurrentImage({
      src: result.src, id: image.id, index
    });
  }

  async function nextImage() {

    const index = ((currentImage?.index ?? -1) + 1) % images.length;
    loadImageByIndex(index);
  }

  async function prevImage() {
    const index = ((currentImage?.index ?? 1) + images.length -1) % images.length;
    loadImageByIndex(index);
  }
}



