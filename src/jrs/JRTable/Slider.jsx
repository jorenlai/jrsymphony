import React from "react"
import styled from "styled-components"
import { po } from "../JRUtils"

export const StyledSlider=styled.div`
    Xborder:1px solid blue;
    position: absolute;
    top: 0;
    right: 0;
    height:100%;
    cursor: col-resize;
    width:6px;
    user-select: none;
    &:hover{
        border-right:1px dashed black;
    }
`
export default class Slider extends React.Component {
    constructor(){
        super();
        this.sliderRef=React.createRef()
    }

    render(){
        const sliderLine=this.props.table.sliderLineRef.current
        return <StyledSlider
            ref={this.sliderRef}
            onMouseDown={()=>{
                sliderLine.start(true,this.sliderRef.current.getBoundingClientRect(),this.props.thRef.current.getBoundingClientRect())
            }}
        />
    }
}