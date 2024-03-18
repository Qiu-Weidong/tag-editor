import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { invoke } from "@tauri-apps/api";
import { Alert, Box, Button, Chip, LinearProgress } from "@mui/material";
import ForwardSelectableImageList, { SelectableImage } from "./ForwardSelectableImageList";
import shortid from 'shortid';



function dumplicated(arr: string[]): string[] {
  let result: Set<string> = new Set();
  const set = new Set<string>();
  arr.forEach((item) => {
    if (set.has(item)) {
      result.add(item);
    } else {
      set.add(item);
    }
  });
  return [...result];
}





const ForwardImageGallery = forwardRef(function ImageGallery(props: any, ref: any) {
  const imageList = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    // 暴露两个函数供父级组件调用
    refresh, stop,
  }));


  // 相当于在这里定义页面相关的数据, 和渲染无关,无需设置为state
  const data = useRef<{ loading: boolean, stop: boolean, images: { src: string, width: number, height: number, id: number }[], labels: Map<string, number> }>({
    loading: false, stop: false,
    images: [],
    labels: new Map<string, number>(),
  });


  // 进度条
  const [progress, setProgress] = useState(100);
  // 展示的标签
  const [labels, setLabels] = useState<{ content: string, selected: boolean, cnt: number }[]>([]);
  const [warning, setWarning] = useState('');



  const rowHeight = 180;


  async function loadImages(imagedir: string) {
    // 清空原始数据
    imageList.current.setImages([]);
    data.current.images = [];
    data.current.labels.clear();

    // 第一步,获取所有的图片路径
    let image_path_list: { extension: string, filename: string, filepath: string, stem: string }[] = await invoke("glob_images", { imagedir });
    const total = image_path_list.length;


    const stem_list = image_path_list.map((item) => item.stem);
    const dup = dumplicated(stem_list);
    if (dup.length > 0) {
      setWarning(`more than one file with name '${dup.toString()}'`);
    }


    let current = 0;

    // 加载所有图片的缩略图和标签
    for (const imagePath of image_path_list) {
      // 这里返回的数据不包含 id
      const image: { src: string, width: number, height: number, captions: string[] } = await invoke("load_image", { imagePath: imagePath.filepath, rowHeight, captionExt: 'txt' });

      const image_id = shortid.generate();

      // 完整的数据保存在这里, images 中保存过滤得到的数据
      data.current.images.push({ ...image, id: current });
      const current_image: SelectableImage = { src: image.src, isSelected: false, id: image_id };

      imageList.current?.setImages((prev: []) => [...prev, current_image]);

      console.log(current_image);

      // 加载字幕
      for (const caption of image.captions) {
        // 统计标签的频率
        const cnt = (data.current.labels.get(caption) || 0) + 1;
        data.current.labels.set(caption, cnt);
      }
      // 更新界面, 即更新 state
      setLabels(Array.from(data.current.labels.entries()).map(([content, cnt]) => { return { content, cnt, selected: false } }));


      current += 1;
      setProgress(current / total * 100);

      // 增加一个检查是否中止的逻辑.
      if (data.current.stop) {
        data.current.stop = false;
        setProgress(100);
        break;
      }

    }
  }

  function refresh() {
    if (!data.current.loading) {
      const imagedir = localStorage.getItem('path') || '';
      data.current.loading = true;
      props.onLoadingChange(data.current.loading);
      loadImages(imagedir).then(() => {
        data.current.loading = false;
        props.onLoadingChange(data.current.loading);
      }).catch(err => console.error(err));
    }
  }


  function stop() {
    data.current.stop = true;
  }

  return (
    <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
      {
        progress < 100 ? <LinearProgress variant="determinate" value={progress} /> : ''
      }
      {
        warning.length > 0 ? <Alert severity="warning">{warning}</Alert> : ''
      }

      {/* 过滤器 */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }} component="ul">
        {
          labels.map((label, id) => <li key={id} style={{ margin: 2 }}>
            <Chip label={label.content} size="small" variant="filled" color="success"></Chip>
          </li>)
        }
      </Box>

      <Button onClick={() => imageList.current.selectAll()}>select all</Button>

      {/* 图集 */}
      {/* <Gallery images={images} rowHeight={rowHeight} /> */}
      <ForwardSelectableImageList ref={imageList} />


    </div>
  );
})

export default ForwardImageGallery;




