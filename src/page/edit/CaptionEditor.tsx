import { Chip, FormControlLabel, FormGroup, IconButton, InputAdornment, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import PublishIcon from '@mui/icons-material/Publish';


// 删除和编辑分开
function EditableChip(props: {
  caption: string,
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
  editable: boolean, // 是否默认启动编辑(当需要添加的时候则默认启动编辑)
  onChange: (before: string, after: string) => void,
  onRemove: (caption: string) => void,
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
    />
  </div>) : inputValue;

  return (<Chip size="small" variant="filled" color={props.color} style={{ marginRight: 2 }}
    onDoubleClick={() => setEdit(true)}
    clickable={!edit} label={label}
    deleteIcon={edit ? <DoneIcon /> : undefined}
    onDelete={() => {
      if (edit) {
        // 完成编辑
        finishEdit();
      } else {
        // 执行删除操作
        props.onRemove(props.caption);
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
  helpInfo: string,
}) {
  const [filterText, setFilterText] = useState('');
  const [allCaptions, setAllCaptions] = useState(props.captions);
  const [filteredCaptions, setFilteredCaptions] = useState(props.captions);
  useEffect(() => {
    // 执行一些初始化操作
    updateCaptions(props.captions);
  }, [props.captions]);

  function updateCaptions(captions: string[]) {
    setAllCaptions(captions);
    const filtered = captions.filter(caption => caption.includes(filterText));
    setFilteredCaptions(filtered);
  }


  // 控制添加部分的显示
  const [adding, setAdding] = useState(false);

  const captionList = (filteredCaptions.map(caption => <EditableChip editable={false} color="info" caption={caption}
    onRemove={(removedCaption) => {
      const captions = allCaptions.filter(caption => caption != removedCaption);
      updateCaptions(captions);
      props.onRemoveCaption(removedCaption);
    }}

    onChange={(before, after) => {
      // 本地更新
      const captions = allCaptions.map(caption => {
        if (caption === before) return after.trim();
        else return caption;
      });
      updateCaptions(captions);
      props.onChangeCaption(before, after.trim());
    }} />));


  return (<div style={{ marginBottom: 2, marginTop: 2 }}>

    {/* 过滤器  */}
    <TextField fullWidth size="small" variant="standard" label="filter" value={filterText} onChange={(e) => {
      setFilterText(e.target.value);
      const filtered = props.captions.filter(caption => caption.includes(e.target.value));
      setFilteredCaptions(filtered);
    }} />

    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
      {
        captionList
      }

      {
        // 只有当可以添加标签的时候才显示添加按钮
        props.addable ? (adding ? <EditableChip editable={true} color="info" caption="add new label"
          onRemove={() => { }}
          onChange={(_, after) => {/**新建标签 */
            setAdding(false);
            const captions = [...allCaptions, after.trim()];
            updateCaptions(captions);

            props.onAddCaption(after);
          }} />
          : <IconButton color="primary" size="small" onClick={() => setAdding(true)}><AddIcon /></IconButton>) : ''
      }
    </div>
  </div>);
}





export function ImageCaptionEditor(props: {
  imageid: string,
  captions: string[],
  onChangeCaption: (imageid: string, captions: string[]) => void | undefined,
  helpInfo: string,
}) {
  const [filterText, setFilterText] = useState('');
  const [allCaptions, setAllCaptions] = useState(props.captions);
  const [filteredCaptions, setFilteredCaptions] = useState(props.captions);
  const [rawText, setRawText] = useState('');
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    // 执行一些初始化操作
    updateCaptions(props.captions);
  }, [props.captions]);

  function updateCaptions(captions: string[]) {
    setAllCaptions(captions);
    const filtered = captions.filter(caption => caption.includes(filterText));
    setFilteredCaptions(filtered);

    let s = '';
    captions.forEach(caption => s += caption + ', ');
    setRawText(s);
  }



  // 控制添加部分的显示
  const [adding, setAdding] = useState(false);

  const captionList = (filteredCaptions.map(caption => <EditableChip
    editable={false} color="info" caption={caption}
    onRemove={() => {
      const captions = allCaptions.filter(_caption => _caption !== caption);
      // 本地更新
      updateCaptions(captions);
      props.onChangeCaption(props.imageid, captions);
    }}
    onChange={(before, after) => {
      // 将 before 修改为了 after
      const captions = allCaptions.map(caption => {
        if (caption === before) return after.trim();
        else return caption;
      });

      updateCaptions(captions);
      props.onChangeCaption(props.imageid, captions);
    }} />));


  return (<div style={{ marginBottom: 2, marginTop: 2 }}>
    <FormGroup style={{ marginLeft: 10 }}>
      <FormControlLabel control={<Switch checked={showRawText} onChange={e => setShowRawText(e.target.checked)} size="small" />} label="raw text" />
    </FormGroup>

    {/* 过滤器  */}
    {
      showRawText ? <TextField fullWidth variant="standard"
        id="outlined-multiline-flexible"
        label="captions"
        multiline
        maxRows={16}
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        InputProps={{
          endAdornment: <InputAdornment position="start">
            <IconButton onClick={submit}><PublishIcon /></IconButton>
          </InputAdornment>,
        }}
      /> : <>
        <TextField fullWidth size="small" variant="standard" label="filter" value={filterText} onChange={(e) => {
          setFilterText(e.target.value);
          const filtered = allCaptions.filter(caption => caption.includes(e.target.value));
          setFilteredCaptions(filtered);
        }} />

        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {
            captionList
          }
          {
            adding ? <EditableChip
              editable={true} color="info" caption="add new label"
              onRemove={() => { }}
              onChange={(_, after) => {
                /**新建标签 */
                setAdding(false);
                // 添加标签 after
                const captions = [...allCaptions, after.trim()];
                updateCaptions(captions);
                props.onChangeCaption(props.imageid, captions);
              }} />
              : <IconButton color="primary" size="small" onClick={() => setAdding(true)}><AddIcon /></IconButton>
          }


        </div>
      </>
    }


  </div>);

  function submit() {
    // 将 rawText 解析回 captions, 并发送
    const captions = rawText.split(',').map(s => s.trim()).filter(s => s.length > 0);
    updateCaptions(captions);
    props.onChangeCaption(props.imageid, captions);
  }
}







