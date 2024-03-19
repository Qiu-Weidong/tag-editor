import { IconButton } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { forwardRef, useImperativeHandle, useState } from 'react';



export type SelectableImage = {
  src: string, isSelected: boolean, id: string,
};





function SelectableImageItem(props: { select: (index: string, isSelected: boolean) => void, image: SelectableImage }) {
  // 标记是否鼠标滑过
  const [hovered, setHovered] = useState(false);

  function clickImage() {
    props.select(props.image.id, !props.image.isSelected);
  }

  return (<ImageListItem key={props.image.id} >
    <img
      srcSet={`${props.image.src}`}
      src={`${props.image.src}`}
      loading="lazy"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={clickImage}
      key={props.image.id}
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
      props.image.isSelected ? <IconButton color='secondary' onClick={clickImage} style={{ position: 'absolute', top: 0, left: 0 }}>
        <CheckCircleIcon />
      </IconButton> : ''
    }

  </ImageListItem>);
}








const ForwardSelectableImageList = forwardRef(function SelectableImageList(props: {cols: number, variant: 'woven' | 'masonry' }, ref: any) {
  useImperativeHandle(ref, () => ({
    // 暴露两个函数供父级组件调用
    selectAll, unselectAll, getSelectedImages, setImages, getImages, getUnSelectedImages
  }));

  const [images, setImages] = useState<SelectableImage[]>([]);

  function select(index: string, isSelected: boolean) {
    // 一定要改变其引用
    setImages((prev) => {
      return prev.map((image) => {
        if (image.id == index) {
          return { ...image, isSelected };
        } else {
          return image;
        }
      });
    });
  }

  // 暴露给父节点使用的函数
  function selectAll() {
    setImages((prev) =>
      prev.map((item) => { return { ...item, isSelected: true }; })
    )
  }

  function unselectAll() {
    setImages((prev) => 
      prev.map((item) => { return { ...item, isSelected: false }; })
    )
  }

  function getSelectedImages() {
    return images.filter((item) => item.isSelected);
  }

  function getImages() {
    return images;
  }

  function getUnSelectedImages() {
    return images.filter((item) => !item.isSelected);
  }

  return (

      <ImageList variant="masonry" cols={props.cols} gap={4} style={{ marginTop: 0 }} >

        {images.map((item) => (
          <SelectableImageItem image={item} select={select} key={item.id} />
        ))}

      </ImageList>
    // </div>
  );
});

export default ForwardSelectableImageList;


