import { Alert, Fab, LinearProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import EditNoteIcon from '@mui/icons-material/EditNote';
import SelectableImageList from "./SelectableImageList";
import CaptionToolBar from "./CaptionToolBar";
import { useDispatch } from "react-redux";
import { deletebyindex } from "./app/alertMsgSlice";




export default function ImageGallery() {
  const dispatch = useDispatch();


  // const [warning, setWarning] = useState('');
  const alerts = useSelector((state: RootState) => state.alert.alerts);
  const progress = useSelector((state: RootState) => state.imagedir.progress);
  const [cols, setCols] = useState(6);

  return (<div style={{ marginLeft: 0, marginTop: 10, marginRight: 0, marginBottom: 0, border: 0 }}>

    {
      alerts.map((alert, index) => (<Alert key={index} severity={alert.severity} onClose={() => dispatch(deletebyindex(index))}>{alert.message}</Alert>))
    }

    {/* 进度条或工具栏 */}
    {
      progress < 100 ? <LinearProgress variant="determinate" value={progress} /> : <CaptionToolBar 
        onChangeCols={(cols) => setCols(cols)} />
    }

    <SelectableImageList cols={cols} />


    {
      progress < 100 ? '' : <Fab color="secondary" variant="extended" aria-label="edit" style={{ position: 'fixed', right: 10, bottom: 10 }}>
        编辑已选图片
        <EditNoteIcon />
      </Fab>
    }
  </div>);
}


