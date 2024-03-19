import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { invoke } from "@tauri-apps/api";
import { Alert, Fab, LinearProgress } from "@mui/material";
import ForwardSelectableImageList, { SelectableImage } from "./ForwardSelectableImageList";
import shortid from 'shortid';
import CaptionToolBar from "./ForwardCaptionList";
import EditNoteIcon from '@mui/icons-material/EditNote';

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
  const data = useRef<{ loading: boolean, stop: boolean, images: { src: string, width: number, height: number, id: number }[], labels: { content: string, cnt: number }[] }>({
    loading: false, stop: false,
    images: [],
    labels: [],
  });


  // 进度条
  const [progress, setProgress] = useState(100);
  // 展示的标签
  // const [labels, setLabels] = useState<{ content: string, selected: boolean, cnt: number }[]>([]);
  const [warning, setWarning] = useState('');
  const [cols, setCols] = useState(6);


  async function loadImages(imagedir: string) {
    // 清空原始数据
    imageList.current.setImages([]);
    data.current.images = [];
    data.current.labels = [];

    // 第一步,获取所有的图片路径
    let image_path_list: { extension: string, filename: string, filepath: string, stem: string }[] = await invoke("glob_images", { imagedir });
    const total = image_path_list.length;


    const stem_list = image_path_list.map((item) => item.stem);
    const dup = dumplicated(stem_list);
    const rowHeight = 180;


    if (dup.length > 0) {
      setWarning(`more than one file with name '${dup.toString()}'`);
    }


    let current = 0;

    const _labels = new Map<string, number>();

    // 加载所有图片的缩略图和标签
    for (const imagePath of image_path_list) {
      // 这里返回的数据不包含 id
      const image: { src: string, width: number, height: number, captions: string[] } = await invoke("load_image", { imagePath: imagePath.filepath, rowHeight, captionExt: 'txt' });

      const image_id = shortid.generate();

      // 完整的数据保存在这里, images 中保存过滤得到的数据
      data.current.images.push({ ...image, id: current });
      const current_image: SelectableImage = { src: image.src, isSelected: false, id: image_id };

      imageList.current?.setImages((prev: []) => [...prev, current_image]);

      // 加载字幕
      for (const caption of image.captions) {
        // 统计标签的频率
        const cnt = (_labels.get(caption) || 0) + 1;
        _labels.set(caption, cnt);
      }

      current += 1;
      setProgress(current / total * 100);

      // 增加一个检查是否中止的逻辑.
      if (data.current.stop) {
        data.current.stop = false;
        setProgress(100);
        break;
      }

    }

    for(const [content, cnt] of _labels.entries()) {
      data.current.labels.push({ content, cnt });
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
    <div style={{ marginLeft: 0, marginTop: 10, marginRight: 0, marginBottom: 0, border: 0 }}>

      {/* warning 放里边 */}
      {
        warning.length > 0 ? <Alert severity="warning">{warning}</Alert> : ''
      }

      {/* 进度条或工具栏 */}
      {
        progress < 100 ? <LinearProgress variant="determinate" value={progress} /> : <CaptionToolBar labels={data.current.labels} onSelectAll={(selectall) => {
          if(selectall) { imageList.current.selectAll(); } else { imageList.current.unselectAll(); }
        }} onChangeCols={(cols) => setCols(cols) }
        
        />
      }

      <ForwardSelectableImageList cols={cols} variant="masonry" ref={imageList} />


      {
        progress < 100 ? '' : <Fab color="secondary" variant="extended" aria-label="edit" style={{ position: 'fixed', right: 10, bottom: 10 }}>
          编辑已选图片
          <EditNoteIcon />
        </Fab>
      }
    </div>

  );
})

export default ForwardImageGallery;




