import { Divider, Grid, IconButton, ImageList, ImageListItem, Paper, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ImageState } from "../../app/imageListSlice";
import { useState } from "react";
import LightBox from "../filter/LightBox";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from "react-router-dom";
import CaptionEditor from "./CaptionEditor";


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


function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(element => array2.includes(element));
}



export default function CaptionEditPage() {
  const navigate = useNavigate();


  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isSelected));
  const labels = useSelector((state: RootState) => state.images.labels);

  const [openImageIndex, setOpenImageIndex] = useState<number | undefined>(undefined);

  let commonCaptions = labels.map(label => label.content);
  images.forEach(image => commonCaptions = intersection(commonCaptions, image.captions));
  console.log('commonCaptions', commonCaptions);
  const commonLabels = labels.filter(label => commonCaptions.includes(label.content));





  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '97vh' }}>
      <Grid container spacing={0.5} style={{ flexGrow: 1, maxHeight: '100%' }}>
        <Grid item xs={7} md={8} style={{ maxHeight: '100%',  }} >
          <div style={{ maxHeight: '100%', position: 'relative', height: '100%' }}>
            <Paper style={{ height: '100%', overflow: 'auto', }} elevation={8}>
              <ImageList variant="masonry" cols={8} gap={4} >
                {
                  images.map(image => <ImageItem image={image} onImageClick={(image) => {
                    const index = images.findIndex(img => image.id === img.id);
                    console.log('fuck you', index);
                    if (index >= 0) { setOpenImageIndex(index) }
                  }} />)
                }
              </ImageList>
            </Paper>
            {/* 盖在上面 */}
            {
              openImageIndex !== undefined ? <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', }}>
                <LightBox images={images} defaultShowIndex={(openImageIndex ?? 0)} onClose={() => setOpenImageIndex(undefined)}
                  onNext={(_before, _after) => { }} onPrev={(_before, _after) => { }}
                />
              </div> : ''
            }
          </div>

        </Grid>
        <Grid item xs={5} md={4} style={{ textAlign: 'center' }}>
          <Stack
            direction="row" justifyContent="center" spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <IconButton onClick={() => navigate("/app/gallery")}><ArrowBackIcon /></IconButton>
            <IconButton><HomeIcon /></IconButton>
            <IconButton><SettingsIcon /></IconButton>
            <IconButton><HelpIcon /></IconButton>
            <IconButton><FilterAltIcon /></IconButton>
          </Stack>


          {/* 公有标签 */}
          <CaptionEditor captions={commonLabels} onAddCaption={(caption: string) => { }} onRemoveCaption={(caption: string) => { }} onChangeCaption={(before: string, after: string) => { }} />
          {/* 所有标签 */}
        </Grid>
      </Grid>
    </div>
  );
}











