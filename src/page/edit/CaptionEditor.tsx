import { Chip, FormControl, FormControlLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { ImageState } from "../../app/imageListSlice";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DoneIcon from '@mui/icons-material/Done';


// 删除和编辑分开
function EditableChip(props: {
  caption: string,
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  editable: boolean, // 是否默认启动编辑(当需要添加的时候则默认启动编辑)
  onChange: (before: string, after: string) => void,
}) {
  const [inputValue, setInputValue] = useState(props.caption);
  const [edit, setEdit] = useState(props.editable);

  useEffect(() => { setInputValue(props.caption) }, [props.caption]);

  function finishEdit() {
    setEdit(false);
    if (!inputValue || !inputValue.trim()) {
      setInputValue(props.caption);
    } else {
      // 触发修改事件
      props.onChange(props.caption, inputValue.trim())
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

  return (<Chip size="small" variant="filled" color={props.color} style={{ marginRight: 2 }}
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

export default function CaptionEditor(props: {
  captions: string[], // 要编辑的所有标签

  addable: boolean, // 通过父组件传入, 配合 onAddCaption 事件

  onAddCaption: (caption: string) => void | undefined,
  onRemoveCaption: (caption: string) => void | undefined,
  onChangeCaption: (before: string, after: string) => void | undefined,
  title: string,
  helpInfo: string,
}) {
  const [filterText, setFilterText] = useState('');
  const [filteredCaptions, setFilteredCaptions] = useState(props.captions);


  const [editOrDelete, setEditOrDelete] = useState(0);

  // 控制添加部分的显示
  const [adding, setAdding] = useState(false);

  const captionList = editOrDelete == 0 ? (filteredCaptions.map(caption => <EditableChip editable={false} color="info" caption={caption}
    onChange={(before, after) => props.onChangeCaption(before, after)} />))
    : (filteredCaptions.map(caption => <Chip color="info" size="small" label={caption} onDelete={() => { }}
      // avatar={<Avatar>{caption.frequency}</Avatar>} 
      style={{ marginRight: 2 }}
      clickable
    />));


  return (<div style={{ marginBottom: 2, marginTop: 2 }}>

    <Typography variant="h6">
      {props.title}
    </Typography>
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

    {/* 过滤器  */}
    <TextField fullWidth size="small" variant="standard" label="filter" value={filterText} onChange={(e) => {
      setFilterText(e.target.value);
      const filtered = props.captions.filter(caption => caption.includes(e.target.value));
      setFilteredCaptions(filtered);
    }} />

    <div style={{ maxHeight: '36vh', overflowY: 'auto' }}>
      {
        captionList
      }

      {
        // 只有当可以添加标签的时候才显示添加按钮
        props.addable ? (adding ? <EditableChip editable={true} color="info" caption="add new label" onChange={() => {/**新建标签 */ setAdding(false) }} />
          : <IconButton color="primary" size="small" onClick={() => setAdding(true)}><AddIcon /></IconButton>) : ''
      }
    </div>
  </div>);
}





export function ImageCaptionEditor(props: {
  image: ImageState, // 要编辑的所有标签

  onAddCaption: (caption: string) => void | undefined,
  onRemoveCaption: (caption: string) => void | undefined,
  onChangeCaption: (before: string, after: string) => void | undefined,
  title: string,
  helpInfo: string,
}) {
  const [filterText, setFilterText] = useState('');
  const [filteredCaptions, setFilteredCaptions] = useState(props.image.captions);
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    setFilteredCaptions(props.image.captions);
    let s = '';
    props.image.captions.forEach(caption => s += caption + ', ');
    setRawText(s);
  }, [props.image.captions]);


  const [editOrDelete, setEditOrDelete] = useState(0);

  // 控制添加部分的显示
  const [adding, setAdding] = useState(false);

  const captionList = editOrDelete == 0 ? (filteredCaptions.map(caption => <EditableChip editable={false} color="info" caption={caption}
    onChange={(before, after) => props.onChangeCaption(before, after)} />))
    : (filteredCaptions.map(caption => <Chip color="info" size="small" label={caption} onDelete={() => { }}
      style={{ marginRight: 2 }}
      clickable
    />));


  return (<div style={{ marginBottom: 2, marginTop: 2 }}>

    <Typography variant="h6">
      {props.title}
    </Typography>
    <FormControl size="small">
      <RadioGroup
        row
        aria-labelledby="demo-form-control-label-placement"
        name="position"
        value={editOrDelete}
        onChange={(e) => { setEditOrDelete(e.target.value as unknown as number); }}
      >
        <FormControlLabel value={0} control={<Radio size="small" />} label="edit" />
        <FormControlLabel value={1} control={<Radio size="small" />} label="delete" />
        <FormControlLabel value={2} control={<Radio size="small" />} label="raw text" />
      </RadioGroup>
    </FormControl>


    {
      editOrDelete != 2 ? <>
        {/* 过滤器  */}
        <TextField fullWidth size="small" variant="standard" label="filter" value={filterText} onChange={(e) => {
          setFilterText(e.target.value);
          const filtered = props.image.captions.filter(caption => caption.includes(e.target.value));
          setFilteredCaptions(filtered);
        }} />

        <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {
            captionList
          }
          {
            adding ? <EditableChip editable={true} color="info" caption="add new label" onChange={() => {/**新建标签 */ setAdding(false) }} />
              : <IconButton color="primary" size="small" onClick={() => setAdding(true)}><AddIcon /></IconButton>
          }


        </div>
      </> : <TextField fullWidth variant="standard"
        id="outlined-multiline-flexible"
        label="captions"
        multiline
        maxRows={16}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}

      />
    }

  </div>);
}







