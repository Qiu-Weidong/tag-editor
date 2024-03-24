import { Avatar, Chip, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import { ImageState, LabelState } from "../../app/imageListSlice";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneIcon from '@mui/icons-material/Done';


// 删除和编辑分开
function EditableChip(props: {
  caption: LabelState, color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  editable: boolean, // 是否默认启动编辑(当需要添加的时候则默认启动编辑)
  onChange: (before: string, after: string) => void,
}) {
  const [inputValue, setInputValue] = useState(props.caption.content);
  const [edit, setEdit] = useState(props.editable);

  useEffect(() => { setInputValue(props.caption.content) }, [props.caption.content]);

  function finishEdit() {
    setEdit(false);
    if (!inputValue || !inputValue.trim()) {
      setInputValue(props.caption.content);
    } else {
      // 触发修改事件
      props.onChange(props.caption.content, inputValue.trim())
    }
  }

  const label = edit ? (<div style={{ position: 'relative' }}>
    <span style={{ display: 'inline-block', width: '100%', height: '100%', visibility: 'hidden' }}>_{inputValue}</span>
    <input value={inputValue} style={{
      backgroundColor: 'transparent', outline: 'none',
      border: 'none', width: '100%', height: '100%', display: 'inline-block',
      position: 'absolute', left: 0, top: 0, color: 'inherit',
    }} autoFocus
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={finishEdit}
    // onKeyDown={(e) => {
    //   if (e.key === 'Enter') { finishEdit(); }
    // }}
    />
  </div>) : inputValue;

  return (<Chip size="small" variant="filled" color={props.color}
    avatar={<Avatar>{props.caption.frequency}</Avatar>}
    clickable={!edit} label={label}
    deleteIcon={edit ? <DoneIcon /> : <EditNoteIcon />}
    onDelete={() => {
      if (edit) {
        finishEdit();
      } else {
        setEdit(true);
      }
    }}
  />);
}


// 是否允许添加, 是否允许删除,是否允许编辑
export default function CaptionEditor(props: {
  captions: LabelState[], // 要编辑的所有标签
  imageCnt: number | undefined, // 对应的左侧的图片数量
  image: ImageState | undefined, // 编辑的标签对应的图片

  addable: boolean, // 通过父组件传入, 配合 onAddCaption 事件

  onAddCaption: (caption: string, image: ImageState | undefined) => void | undefined,
  onRemoveCaption: (caption: string, image: ImageState | undefined) => void | undefined,
  onChangeCaption: (before: string, after: string, image: ImageState | undefined) => void | undefined,
}) {
  const [filterText, setFilterText] = useState('');
  const [filteredCaptions, setFilteredCaptions] = useState(props.captions);


  const [editOrDelete, setEditOrDelete] = useState(0);

  // 控制添加部分的显示
  const [adding, setAdding] = useState(false);

  const captionList = editOrDelete == 0 ? (filteredCaptions.map(caption => <EditableChip editable={false} color="info" caption={caption}
    onChange={(before, after) => props.onChangeCaption(before, after, props.image)} />))
    : (filteredCaptions.map(caption => <Chip color="info" size="small" label={caption.content} onDelete={() => { }}
      avatar={<Avatar>{caption.frequency}</Avatar>} clickable
    />));


  return (<>
    {/* 过滤器  */}
    <div>
      <TextField fullWidth size="small" variant="standard" label="filter" value={filterText} onChange={(e) => {
        setFilterText(e.target.value);
        const filtered = props.captions.filter(caption => caption.content.includes(e.target.value));
        setFilteredCaptions(filtered);
      }} />
      <FormControl size="small">
        <RadioGroup
          row
          aria-labelledby="demo-form-control-label-placement"
          name="position"
          value={editOrDelete}
          onChange={(e) => { setEditOrDelete(e.target.value as unknown as number); }}
        >
          <FormControlLabel
            value={0}
            control={<Radio size="small" />}
            label="edit"
          // labelPlacement="start"
          />
          <FormControlLabel value={1} control={<Radio size="small" />} label="delete" />
        </RadioGroup>
      </FormControl>
    </div>

    {/* <div style={{ overflowY: 'auto', height: '100%' }}> */}
    {
      captionList
    }

    {
      // 只有当可以添加标签的时候才显示添加按钮
      props.addable ? (adding ? <EditableChip editable={true} color="info" caption={{ content: 'add new label', frequency: props.imageCnt ?? 0 }} onChange={() => {/**新建标签 */ setAdding(false) }} />
        : <IconButton color="primary" size="small" onClick={() => setAdding(true)}><AddIcon /></IconButton>) : ''
    }
    {/* </div> */}


  </>);
}





