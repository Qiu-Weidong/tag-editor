import { Autocomplete, Avatar, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Slider, TextField } from "@mui/material";
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { LabelState } from "../../app/imageListSlice";
import { useDispatch } from "react-redux";
import { setImageList } from "../../app/imageListSlice";
import Divider from '@mui/material/Divider';
import { SelectAllOutlined } from "@mui/icons-material";
import { selectAllFilteredImages, unselectAllFilteredImages, openAllSelectedImages } from "../../app/imageListSlice";




export default function CaptionToolBar(props: {
  onChangeCols: (cols: number) => void,
}) {
  // 过滤的时候要用(所有图片)
  const images = useSelector((state: RootState) => state.images.images);
  // 所有标签
  const labels = useSelector((state: RootState) => state.images.labels);
  const defaultImageColumns = useSelector((state: RootState) => state.setting.defaultImageGalleryColumns);

  const dispatch = useDispatch();

  const sortMethodList = [
    (a: LabelState, b: LabelState): number => b.frequency - a.frequency,
    (a: LabelState, b: LabelState): number => a.frequency - b.frequency,
    (a: LabelState, b: LabelState): number => b.content.localeCompare(a.content),
    (a: LabelState, b: LabelState): number => a.content.localeCompare(b.content),
  ];

  const [showCaptionFilter, setShowCaptionFilter] = useState(false);
  const [sortMethod, setSortMethod] = useState(0);
  const [selectedLabels, setSelectedLabels] = useState<LabelState[]>([]);
  const [selectableLabels, setSelectableLabels] = useState<LabelState[]>(labels.slice().sort(sortMethodList[sortMethod]));

  return (
    <div>
      {/* 工具按钮, 如全选,设置列数等 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, padding: 0, }}>
        <Button color="info" size="small" startIcon={<SelectAllOutlined />} onClick={() => dispatch(selectAllFilteredImages())} >全选</Button>
        <Button color="info" size="small" startIcon={<DoDisturbIcon />} onClick={() => dispatch(unselectAllFilteredImages())}>全部取消</Button>
        {/* 占位 */}
        <div style={{ flexGrow: 0.9 }}></div>
        {/* 每行个数调节 */}
        <Slider
          size="small"
          defaultValue={defaultImageColumns}
          min={4}
          max={12}
          aria-label="Small"
          valueLabelDisplay="off"
          style={{ width: 100 }}
          onChange={(_, newValue) => props.onChangeCols(newValue as number)}
        />
        <Button size="small" variant="text" endIcon={<VisibilityIcon />} onClick={() =>
          dispatch(openAllSelectedImages())
        }>查看选中图片</Button>

        <Button size="small" variant="text" onClick={() => setShowCaptionFilter((prev) => !prev)}
          endIcon={!showCaptionFilter ? <ExpandMoreIcon /> : <ExpandLessIcon />}>根据标签过滤</Button>
      </div>

      {/* 标签过滤 */}
      {
        showCaptionFilter ? <div style={{ marginBottom: 5 }}>

          {/* 首先来一个 switch(正向过滤或负向过滤), 一个输入框(搜索标签, 自动补全),  一个下拉菜单(排序方式), 一个清除按钮(重置) */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {/* switch */}
            {/* <FormGroup>
              <FormControlLabel control={<Switch size='small' defaultChecked />} label="反向过滤" /></FormGroup> */}

            {/* 自动补全 */}
            <Autocomplete renderInput={(params) => {
              return <TextField {...params} label="检索标签" variant="standard" />
            }} style={{ flexGrow: 0.8 }}
              options={selectableLabels}
              onChange={(_, value) => { /**注意检查是否为空, 如果不为空则选择 e.target.value 这个标签 */
                if (value) {
                  onLabelSelected(value);
                }
              }}
              getOptionLabel={(label) => label.content} size='small'></Autocomplete>

            {/* 排序方式 */}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">排序方式</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={sortMethod}

                onChange={(e) => {
                  const index = e.target.value as number;
                  setSortMethod(index);
                  const sortMethod = sortMethodList[index];
                  setSelectableLabels((labels) => labels.slice().sort(sortMethod));
                  setSelectedLabels((labels) => labels.slice().sort(sortMethod));
                }}

                label="Age"
              >
                <MenuItem value={0}>频率(降序)</MenuItem>
                <MenuItem value={1}>频率(升序)</MenuItem>
                <MenuItem value={2}>字典(降序)</MenuItem>
                <MenuItem value={3}>字典(升序)</MenuItem>
              </Select>
            </FormControl>
            <IconButton size='small' onClick={() => { const _selectedLabels: LabelState[] = []; setSelectedLabels(_selectedLabels); updateImageListAndSelectableLabels(_selectedLabels); }}> <ClearAllIcon /> </IconButton>
          </div>

          {
            // 已选标签
            selectedLabels.map((label, key) => <Chip avatar={<Avatar>{label.frequency}</Avatar>} key={key} color="primary"
              clickable variant='filled' size='small' label={label.content} onClick={() => onLableUnselected(label)} onDelete={() => onLableUnselected(label)} />)
          }
          {
            selectedLabels.length > 0 ? <Divider style={{ marginTop: 2 }} /> : ''
          }

          {
            // 可选标签
            selectableLabels.map((label, key) => <Chip avatar={<Avatar>{label.frequency}</Avatar>} key={key}
              clickable variant='outlined' size='small' label={label.content} onClick={() => onLabelSelected(label)} />)
          }
        </div> : ''
      }
    </div>
  );


  function updateImageListAndSelectableLabels(selectedLabels: LabelState[]) {

    // 首先设置图片
    const filteredImages = images.map(image => {
      for (const label of selectedLabels) {
        if (!image.captions.includes(label.content)) {
          return { ...image, isFiltered: false };
        }
      }
      return { ...image, isFiltered: true };
    });

    // 成功设置了图片过滤
    dispatch(setImageList(filteredImages));

    // 获取所有的过滤图片的标签,并去除已选标签
    let caption_set = new Set<string>([]);
    filteredImages.forEach(image => {
      if (image.isFiltered) {
        caption_set = new Set([...caption_set, ...image.captions]);
      }
    });

    const _selectableLabels = [];
    const _selectedLabelsString = selectedLabels.map(label => label.content);
    for (const caption of caption_set) {
      if (!_selectedLabelsString.includes(caption)) {
        const label = labels.find((label) => label.content === caption);
        if (label) _selectableLabels.push(label);
      }
    }

    setSelectableLabels(_selectableLabels.slice().sort(sortMethodList[sortMethod]));
  }

  function onLabelSelected(label: LabelState) {
    // 不要等state更新,先保存一份预先更新的 selectedLabels
    const _selectedLabels = [...selectedLabels, label].sort(sortMethodList[sortMethod]);
    // 将该标签标记为选中
    setSelectedLabels(_selectedLabels);

    updateImageListAndSelectableLabels(_selectedLabels);
  }


  function onLableUnselected(label: LabelState) {
    const _selectedLabels = selectedLabels.filter(_label => _label !== label);
    setSelectedLabels(_selectedLabels);
    updateImageListAndSelectableLabels(_selectedLabels);
  }




}


