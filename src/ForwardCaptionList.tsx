
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import EditNoteIcon from '@mui/icons-material/EditNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button, Chip, FormControlLabel, FormGroup, Slider } from '@mui/material';
import { useState } from 'react';




// 在这里编写过滤器
function CaptionToolBar(props: { 
  labels: { content: string, cnt: number }[],  // 传入所有标签的并集
  onSelectAll: (selectedAll: boolean) => void, // 点击全选按钮时候触发
  onChangeCols: (cols: number) => void,
}, ) {
  const [showCaptionFilter, setShowCaptionFilter] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);

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
          // value={cols}
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
          endIcon={ !showCaptionFilter ? <ExpandMoreIcon /> : <ExpandLessIcon /> }>根据标签过滤</Button>
      </div>

      {/* 标签过滤 */}
      {
        showCaptionFilter ? <>
        {
          props.labels.map((label) => <Chip variant='outlined' size='small' label={label.content} />)
        }
        </> : ''
      }
    </div>
  );
}

export default CaptionToolBar;


