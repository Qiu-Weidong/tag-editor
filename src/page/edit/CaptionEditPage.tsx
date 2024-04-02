import { Divider, Grid, IconButton, ImageList, ImageListItem, Paper, Slider } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ImageState, LabelState } from "../../app/imageListSlice";
import { useState } from "react";
import LightBox from "../filter/LightBox";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useNavigate } from "react-router-dom";
import CaptionEditor from "./CaptionEditor";
import SaveIcon from '@mui/icons-material/Save';
import { ImageCaptionEditor } from "./CaptionEditor";


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




// 将有些功能函数写在这里
function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(element => array2.includes(element));
}

function getCommonCaptionsForSelectedImages(selectedImages: ImageState[], labels: LabelState[]): string[] {
  let commonCaptions = labels.map(label => label.content);
  selectedImages.forEach(image => commonCaptions = intersection(commonCaptions, image.captions));
  return commonCaptions.sort();
}

function getTotalCaptionsForSelectedImages(selectedImages: ImageState[]): string[] {
  let totalLabels = new Set<string>([]);
  selectedImages.forEach(image => totalLabels = new Set([...totalLabels, ...image.captions]));
  // const _totalLabels = labels.filter(label => totalLabels.has(label.content));
  return Array.from(totalLabels).sort();
}



export default function CaptionEditPage() {
  const navigate = useNavigate();


  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isSelected));
  const labels = useSelector((state: RootState) => state.images.labels);
  const defaultImageColumns = useSelector((state: RootState) => state.setting.defaultImageGalleryColumns);

  // openImageCaptions 和 openImageIndex 必须分为两个 state
  const [openImageIndex, setOpenImageIndex] = useState<number | undefined>(undefined);
  const [openImage, setOpenImage] = useState<ImageState | undefined>(undefined);


  const [cols, setCols] = useState(defaultImageColumns);




  // 计算得到所有已选图片共同的标签, 所有标签的交集
  const commonLabels = getCommonCaptionsForSelectedImages(images, labels);
  // 所有标签的并集
  const totalLabels = getTotalCaptionsForSelectedImages(images);



  return (
    <Grid container spacing={0.5} style={{ maxHeight: '100%', height: '97vh' }}>
      <Grid item xs={7} md={8} style={{ maxHeight: '100%', }} >
        <div style={{ maxHeight: '100%', position: 'relative', height: '100%' }}>
          <Paper style={{ height: '100%', maxHeight: '100%', overflow: 'auto', }} elevation={8}>
            {/* 在这里加一个 slider */}
            <Slider
              size="small"
              defaultValue={defaultImageColumns}
              min={4}
              max={16}
              aria-label="Small"
              valueLabelDisplay="off"
              style={{ marginLeft: 10, width: '50%' }}
              onChange={(_, newValue) => setCols(newValue as number)}
              value={cols}
            />
            <ImageList variant="masonry" cols={cols} gap={4} style={{ marginTop: 0 }}>
              {
                images.map(image => <ImageItem image={image} onImageClick={(image) => {
                  const index = images.findIndex(img => image.id === img.id);
                  if (index >= 0) { setOpenImageIndex(index); setOpenImage(images[index]); }
                }} />)
              }
            </ImageList>
          </Paper>
          {/* 盖在上面 */}
          {
            openImageIndex !== undefined ? <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', }}>
              <LightBox images={images} defaultShowIndex={(openImageIndex ?? 0)} onClose={() => setOpenImageIndex(undefined)}
                onNext={(_before, after) => {
                  setOpenImage(after);
                }} onPrev={(_before, after) => {
                  setOpenImage(after);
                }}
              />
            </div> : ''
          }
        </div>

      </Grid>


      <Grid item xs={5} md={4} style={{ overflowY: 'auto', overflowX: 'hidden', }}>

        {
          openImage === undefined || openImageIndex === undefined ? <>
            {/* 公有标签 */}
            <CaptionEditor captions={commonLabels} title="common captions" helpInfo=""
              onAddCaption={(caption: string) => { }} onRemoveCaption={(caption: string) => { }} onChangeCaption={(before: string, after: string) => { }}
              addable={true} />
            <Divider variant="middle" />
            {/* 所有标签 */}
            <CaptionEditor captions={totalLabels} title="total captions" helpInfo=""
              onAddCaption={(caption: string) => { }} onRemoveCaption={(caption: string) => { }} onChangeCaption={(before: string, after: string) => { }}
              addable={false} />
          </> : <ImageCaptionEditor image={openImage}
            onAddCaption={() => {}}
            onRemoveCaption={() => {}}
            onChangeCaption={() => {}} 
            title={"image captions"} helpInfo={""} />
        }




        <div style={{ position: 'absolute', right: 0 }}>
          <IconButton onClick={() => navigate("/filter")}><ArrowBackIcon /></IconButton>
          <IconButton onClick={() => navigate("/")} ><HomeIcon /></IconButton>
          <IconButton onClick={() => navigate("/settings")}><SettingsIcon /></IconButton>
          <IconButton onClick={() => navigate("/help")} ><HelpIcon /></IconButton>

          <IconButton size="small"><SaveIcon /></IconButton>
        </div>
      </Grid>
    </Grid>
  );
}











