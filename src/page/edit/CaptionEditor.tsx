import { Chip, IconButton } from "@mui/material";
import { LabelState } from "../../app/imageListSlice";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';



function EditableChip(props: { caption: LabelState }) {
  const [inputValue, setInputValue] = useState(props.caption.content);
  return (<Chip size="small" color="error" label={
    <div style={{ position: 'relative' }}>
      <span style={{ display: 'inline-block', width: '100%', height: '100%', visibility: 'hidden' }}>_{inputValue}</span>
      <input value={inputValue} style={{
        backgroundColor: 'transparent',
        border: 'none', outline: 'none', width: '100%', height: '100%', display: 'inline-block',
        position: 'absolute', left: 0, top: 0, color: 'inherit'
      }}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  }>
  </Chip>);
}


export default function CaptionEditor(props: {
  captions: LabelState[],
  onAddCaption: (caption: string) => void,
  onRemoveCaption: (caption: string) => void,
  onChangeCaption: (before: string, after: string) => void,
}) {
  return (<div>
    {
      props.captions.map(caption => <Chip size="small" color="error" onDelete={props.onRemoveCaption} label={caption.content} clickable></Chip>)
    }
    {/* <EditableChip caption={props.captions[0]} /> */}
    <IconButton color="error" size="small"><AddIcon /></IconButton>
    

  </div>);
}





