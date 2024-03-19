
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Autocomplete, Avatar, Button, Chip, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Slider, Switch, TextField } from '@mui/material';
import { useState } from 'react';
import ClearAllIcon from '@mui/icons-material/ClearAll';



// 在这里编写过滤器
function CaptionToolBar(props: {
  labels: { content: string, cnt: number }[],  // 传入所有标签的并集
  onSelectAll: (selectedAll: boolean) => void, // 点击全选按钮时候触发
  onChangeCols: (cols: number) => void,
},) {

  const [showCaptionFilter, setShowCaptionFilter] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

  // 定义已选标签和可选标签

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
            <FormGroup>
              <FormControlLabel control={<Switch size='small' defaultChecked />} label="反向过滤" /></FormGroup>

            {/* 自动补全 */}
            <Autocomplete renderInput={(params) => {
              return <TextField {...params} label="检索标签" variant="standard" />
            }} style={{ minWidth: 500 }}
              options={props.labels}
              onChange={(_e: any) => { /**注意检查是否为空, 如果不为空则选择 e.target.value 这个标签 */ }}
              getOptionLabel={(label) => label.content} size='small'></Autocomplete>

            {/* 排序方式 */}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">排序方式</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={"频率(降序)"}

                onChange={(e: any) => { console.log(e) }}
                label="Age"
              >
                <MenuItem value="频率(降序)">频率(降序)</MenuItem>
                <MenuItem value="频率(升序)">频率(升序)</MenuItem>
                <MenuItem value="字典(降序)">字典(降序)</MenuItem>
                <MenuItem value="字典(升序)">字典(升序)</MenuItem>
              </Select>
            </FormControl>
            <IconButton size='small'> <ClearAllIcon /> </IconButton>
          </div>
          {
            props.labels.map((label, key) => <Chip avatar={<Avatar>{label.cnt}</Avatar>} key={key} 
              clickable variant='outlined' size='small' label={label.content} onClick={() => console.log(label)}/>)
          }
        </div> : ''
      }
    </div>
  );
}

export default CaptionToolBar;


