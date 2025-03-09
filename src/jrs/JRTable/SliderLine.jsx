import React from "react"
import styled from "styled-components"
import { po } from "../JRUtils";

export const StyledSliderLine=styled.div`
    position: absolute;
    height: 100%;
    width:1px;
    color:black;
    border:0;
    user-select: none;
`

export default class SliderLine extends React.Component {
    constructor(){
        super();
        this.ref=React.createRef()
        this.state={
            show:false
        }
    }

    stop=()=>{
        po('stop')
        this.setState({show:false})
        document.body.style.cursor='default'
        window.removeEventListener('mousemove',this.move)
        window.removeEventListener('mouseup',this.stop)
    }
    move=(e)=>{
        po('--------------',this.props.table.colGroupRef)
        const min=this.thP.x+10
        const x=e.clientX>=min
            ?e.clientX
            :min
        this.ref.current.style.left=x+'px'
        document.body.style.cursor='col-resize'
    }
    start(show,p,thP){
        this.thP=thP
        this.setState({show:true})
        if(show) {
            window.addEventListener('mousemove',this.move)
            window.addEventListener('mouseup',this.stop)
            this.ref.current.style.left=((p.x+p.width)-3)+'px'
        }
    }
    render(){
        return <StyledSliderLine 
            $show={this.show}
            ref={this.ref}
            style={{
                border:this.state?.show?'1px dashed gray':'0'
            }}
        />
    }
}