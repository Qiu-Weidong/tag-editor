import { Grid, ImageList, ImageListItem } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ImageState } from "../../app/imageListSlice";
import { useState } from "react";


function ImageItem(props: {
  image: ImageState,
  onImageClick: (image: ImageState) => void,
}) {
  const [hovered, setHovered] = useState(false);

  return (<ImageListItem key={props.image.id} >
    <img
      srcSet={`${props.image.src}`}
      src={`${props.image.src}`}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      key={props.image.id}
      onClick={() => props.onImageClick(props.image)}
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


  </ImageListItem>);
}

export default function CaptionEditor() {
  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isSelected));


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '97vh' }}>
      <Grid container spacing={0.5} style={{ flexGrow: 1, maxHeight: '100%' }}>
        <Grid item xs={7} md={8} style={{ maxHeight: '100%', position: 'relative' }} >
          <div style={{ height: '100%', overflow: 'auto',  }}>
            <ImageList variant="masonry" cols={8} gap={4} >
              {
                images.map(image => <ImageItem image={image} onImageClick={(_image) => { }} />)
              }
            </ImageList>


          </div>
          {/* 盖在上面 */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)' }}>
          </div>

        </Grid>
        <Grid item xs={5} md={4}>
        </Grid>
      </Grid>
    </div>
  );
}











