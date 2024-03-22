import { Autocomplete, Avatar, Button, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Slider, TextField } from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { LabelState } from "./app/imageListSlice";
import { useDispatch } from "react-redux";
import { setImageList } from "./app/imageListSlice"; 




export default function CaptionToolBar(props: {
  onSelectAll: (selectedAll: boolean) => void, // 点击全选按钮时候触发
  onChangeCols: (cols: number) => void,
}) {
  // 过滤的时候要用
  const images = useSelector((state: RootState) => state.images.images);
  const dispatch = useDispatch();


  const [showCaptionFilter, setShowCaptionFilter] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [sortMethod, setSortMethod] = useState(0);

  // 排序方法
  const sortMethodList = [
    (a: LabelState, b: LabelState): number => b.frequency - a.frequency,
    (a: LabelState, b: LabelState): number => a.frequency - b.frequency,
    (a: LabelState, b: LabelState): number => b.content.localeCompare(a.content),
    (a: LabelState, b: LabelState): number => a.content.localeCompare(b.content),
  ];

  // 获取所有标签并排序
  const labels = useSelector((state: RootState) => state.images.labels);

  // 已选标签初始化为空
  const [selectedLabels, setSelectedLabels] = useState<LabelState[]>([]);
  const [selectableLabels, setSelectableLabels] = useState<LabelState[]>(labels.slice().sort(sortMethodList[sortMethod]));

  return (
    <div>
      {/* 工具按钮, 如全选,设置列数等 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, padding: 0, }}>
        {/* 全选按钮 */}
        <FormGroup style={{ alignSelf: 'flex-start' }}>
          <FormControlLabel control={<Checkbox color="secondary" size="small" checked={selectedAll} onChange={(e) => {
            // 通过 e.target.checked; 来判断是否选中 
            setSelectedAll(e.target.checked);
            props.onSelectAll(e.target.checked);
          }}
            icon={<CheckCircleOutlineIcon />} checkedIcon={<CheckCircleIcon />} />} label="全选" />
        </FormGroup>
        {/* 占位 */}
        <div style={{ flexGrow: 0.9 }}></div>
        {/* 每行个数调节 */}
        <Slider
          size="small"
          defaultValue={6}
          min={4}
          max={12}
          aria-label="Small"
          valueLabelDisplay="off"
          style={{ width: 100 }}
          onChange={(_, newValue) => props.onChangeCols(newValue as number)}
        />
        {/* 编辑 */}
        {/* <Button size="small" variant="text" endIcon={<EditNoteIcon />}>编辑已选图片</Button> */}
        <Button size="small" variant="text" endIcon={<VisibilityIcon />}>查看选中图片</Button>
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
              onChange={(_e: any) => { /**注意检查是否为空, 如果不为空则选择 e.target.value 这个标签 */ console.log(_e) }}
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
            <IconButton size='small'> <ClearAllIcon /> </IconButton>
          </div>

          {
            // 已选标签
            selectedLabels.map((label, key) => <Chip avatar={<Avatar>{label.frequency}</Avatar>} key={key} color="primary"
              clickable variant='filled' size='small' label={label.content} onClick={() => console.log(label)} />)
          }
          <br />
          {
            // 可选标签
            selectableLabels.map((label, key) => <Chip avatar={<Avatar>{label.frequency}</Avatar>} key={key}
              clickable variant='outlined' size='small' label={label.content} onClick={() => onLabelSelected(label) } />)
          }
        </div> : ''
      }
    </div>
  );

  
  function onLabelSelected(label: LabelState) {
    // 不要等state更新,先保存一份预先更新的 selectedLabels
    const _selectedLabels = [...selectedLabels, label];

    // 将该标签标记为选中
    setSelectedLabels(_selectedLabels);

    // 首先设置图片
    const filteredImages = images.map(image => {
      for(const label of _selectedLabels) {
        if(! image.captions.includes(label.content)) {
          return {...image, isFiltered: false};
        }
      }
      return { ...image, isFiltered: true };
    });

    // 成功设置了图片过滤
    dispatch(setImageList(filteredImages));
    
    // 获取所有的过滤图片的标签,并去除已选标签
    let caption_set = new Set<string>([]);
    filteredImages.forEach(image => {
      if(image.isFiltered) {
        caption_set = new Set([...caption_set, ...image.captions]);
      }
    });

    const _selectableLabels = [];
    const _selectedLabelsString = _selectedLabels.map(label => label.content);
    for(const caption of caption_set) {
      if(! _selectedLabelsString.includes(caption)) {
        const label = selectableLabels.find((label) => label.content === caption);
        if(label) _selectableLabels.push(label);
      }
    }

    setSelectableLabels(_selectableLabels);

    // 首先过滤出需要的图片

    // 更新可选标签

    // 过滤图片
  }




}


