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
  const currentOpenImageId = useSelector((state: RootState) => state.images.currentOpenImage);
  let index = images.findIndex(image => image.id === currentOpenImageId);
  if(index < 0) index = 0;
  if(index >= images.length) index %= images.length;

  const [currentImage, setCurrentImage] = useState<{ id: string, index: number, src: string } | undefined>(undefined);
  
  if(! currentImage)
  loadImageByIndex(index);
  // useEffect(() =>  {loadImageByIndex(index);} , []);

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
          <IconButton style={{ position: 'absolute', right: 0, top: 0, }}  onClick={() => 
            {dispath(closeAllImages()); setCurrentImage(undefined);}}> <CloseIcon /> </IconButton>
          

          <IconButton style={{ position: 'absolute', left: 0, }} ><ChevronLeftIcon /></IconButton>

          {/* <img src="https://images.unsplash.com/photo-1549388604-817d15aa0110" style={{ width: 300, }} /> */}
          {
            currentImage ? <img src={currentImage.src}  style={{ maxWidth: '100%', maxHeight: '100%' }} />: <CircularProgress />
          }
          

          <IconButton style={{ position: 'absolute', right: 0, }} ><ChevronRightIcon /></IconButton>



        </div> : ''
      }
    </>
  );



  async function loadImageByIndex(index: number) {
    const image = images[index];

    if(! image) return;
    // 然后根据 image.path 加载原始图像
    const result: { src: string, filename: string, width: number, height: number, path: string } = await invoke("load_image", { imagePath: image.path });
    console.log('result', result);
    setCurrentImage({
      src: result.src, id: image.id, index
    });
  }
}



