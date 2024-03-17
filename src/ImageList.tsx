import { IconButton, ImageListItemBar } from '@mui/material';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
// import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';

export default function MasonryImageList() {
  // 将 images 设置为状态 src, isSelected
  const [images, setImages] = useState<{ src: string, isSelected: boolean, id: number }[]>(itemData);

  function select(index: number) {
    setImages((prev) => {
      let item = prev.find((item) => item.id == index);
      if (item) {
        item.isSelected = !item.isSelected;
      }
      return prev;
    });
  }

  return (
    <Box >
      <ImageList variant="masonry" cols={4} gap={4}>

        {images.map((item) => (
          <MasonryImageItem image={item} select={select} />
        ))}

      </ImageList>
    </Box>
  );
}

// 按照序号往回更新即可
const itemData = [
  {
    src: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
    id: 1,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
    id: 2,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
    id: 3,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
    id: 4,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
    id: 5,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
    id: 6,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
    id: 7,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
    id: 8,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
    id: 9,
    isSelected: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
    id: 10,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
    id: 11,
    isSelected: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
    id: 12,
    isSelected: false,
  },
];


// select 属性是一个函数, 选择第 index 张图片
function MasonryImageItem(props: { select: (index: number) => void, image: { src: string, isSelected: boolean, id: number } }) {
  // 标记是否鼠标滑过
  const [hovered, setHovered] = useState(false);

  return (<ImageListItem key={props.image.id} >
    <img
      srcSet={`${props.image.src}`}
      src={`${props.image.src}`}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {props.select(props.image.id); setHovered((prev) => !prev);}}
    />

    {/* 分为两个 Bar 来展示 */}
    {
      // 这个考虑直接在 img 上面使用 css 实现, 而不是引入一个 ImageListItemBar
      hovered ? <ImageListItemBar
        // hover 的时候设置渐变, 没有hover的时候设置透明
        sx={{
          background:
            ('linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
              'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'),
          height: 36,
        }}
        position="top"
      /> : ''
    }
    {
      props.image.isSelected ? <ImageListItemBar
        sx={{
          background: 'transparent',
          height: 36,
        }}
        position="top"
        actionIcon={
          <IconButton color='secondary' onClick={() => {props.select(props.image.id); setHovered((prev) => !prev);}}>
            <CheckCircleIcon />
          </IconButton>
        }
        actionPosition="left"
      /> : ''
    }

  </ImageListItem>);
}




