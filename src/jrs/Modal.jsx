import { Modal } from "antd";
import { useEffect, useRef } from "react";
import { po } from "./JRUtils";
import styled from "styled-components";


// class EModal extends Modal{

// }

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header=document.getElementsByClassName('ant-modal-header')[0]
    if (header) {
      /* if present, the header is where you move the DIV from:*/
    //   header.onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
    //   elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

const StyledModal=styled(Modal)`
    .ant-modal-centered{
        overflow: hidden !important;
    }
        
    .ant-modal-content {
        xxxposition: absolute;
        z-index: 9;
        background-color:rgb(129, 42, 42);
        text-align: center;
        border: 1px solid #d3d3d3;
    }

    .ant-modal-header {
        padding: 10px;
        cursor: move;
        z-index: 10;
        background-color: #2196F3;
        color: #fff;
    }
`
export default function WModal() {
    const ref=useRef()
    useEffect(()=>{
        const window=document.getElementsByClassName("ant-modal-content")[0]
        po('window',window)
        dragElement(window);
    },[])
	return <StyledModal
        className="styled-modal"
        ref={ref}
        open={true}
        title={'Title'}
        onOk={()=>{
            po('onOk ref',ref.current)
        }}
    >
        AAAAAAA
    </StyledModal>
}
