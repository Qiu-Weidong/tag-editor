import { Divider, Grid, IconButton, ImageList, ImageListItem, Paper, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ImageState, LabelState } from "../../app/imageListSlice";
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




// 将有些功能函数写在这里
function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(element => array2.includes(element));
}

function getCommonCaptionsForSelectedImages(selectedImages: ImageState[], labels: LabelState[]): LabelState[] {
  let commonCaptions = labels.map(label => label.content);
  selectedImages.forEach(image => commonCaptions = intersection(commonCaptions, image.captions));
  const commonLabels = labels.filter(label => commonCaptions.includes(label.content));

  return commonLabels;
}

function getTotalCaptionsForSelectedImages(selectedImages: ImageState[], labels: LabelState[]): LabelState[] {
  let totalLabels = new Set<string>([]);
  selectedImages.forEach(image => totalLabels = new Set([...totalLabels, ...image.captions]));
  const _totalLabels = labels.filter(label => totalLabels.has(label.content));
  return _totalLabels;
}



export default function CaptionEditPage() {
  const navigate = useNavigate();


  const images = useSelector((state: RootState) => state.images.images.filter(image => image.isSelected));
  const labels = useSelector((state: RootState) => state.images.labels);

  const [openImageIndex, setOpenImageIndex] = useState<number | undefined>(undefined);

  // 计算得到所有已选图片共同的标签, 所有标签的并集
  const commonLabels = getCommonCaptionsForSelectedImages(images, labels);
  // 所有标签的交集
  const totalLabels = getTotalCaptionsForSelectedImages(images, labels);




  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '97vh' }}>
      <Grid container spacing={0.5} style={{ flexGrow: 1, maxHeight: '100%' }}>
        <Grid item xs={7} md={8} style={{ maxHeight: '100%', }} >
          <div style={{ maxHeight: '100%', position: 'relative', height: '100%' }}>
            <Paper style={{ height: '100%', overflow: 'auto', }} elevation={8}>
              <ImageList variant="masonry" cols={8} gap={4} >
                {
                  images.map(image => <ImageItem image={image} onImageClick={(image) => {
                    const index = images.findIndex(img => image.id === img.id);
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
        <Grid item xs={5} md={4} style={{ maxHeight: '100%' }}>
          <div style={{ maxHeight: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <Stack
              direction="row" justifyContent="center" spacing={2}
              divider={<Divider orientation="vertical" flexItem />}
            >
              <IconButton onClick={() => navigate("/filter")}><ArrowBackIcon /></IconButton>
              <IconButton onClick={() => navigate("/")}><HomeIcon /></IconButton>
              <IconButton onClick={() => navigate("/settings")}><SettingsIcon /></IconButton>
              <IconButton onClick={() => navigate("/help")}><HelpIcon /></IconButton>
              <IconButton onClick={() => navigate("/filter")}><FilterAltIcon /></IconButton>
            </Stack>


            {/* 公有标签 */}
            <Paper sx={{ margin: 1, padding: 1, }} elevation={8}>
              <CaptionEditor image={undefined}
                imageCnt={images.length} captions={commonLabels} onAddCaption={(caption: string) => { }} onRemoveCaption={(caption: string) => { }} onChangeCaption={(before: string, after: string) => { }}
                addable={true} />
            </Paper>

            {/* 所有标签 或 图片标签 */}
            <Paper sx={{ margin: 1, padding: 1, }} elevation={8}>
              {
                <CaptionEditor image={undefined}
                  imageCnt={undefined} captions={totalLabels} onAddCaption={(caption: string) => { }} onRemoveCaption={(caption: string) => { }} onChangeCaption={(before: string, after: string) => { }}
                  addable={false} />
              }</Paper>

          </div>
        </Grid>
      </Grid>
    </div>
  );
}











