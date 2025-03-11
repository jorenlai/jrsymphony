import React from "react"
import styled from "styled-components"
import { po } from "../JRUtils";

export const StyledSliderLine=styled.div`
    position: absolute;
    height: 100%;
    width:0;
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

    stop=(e)=>{
        this.setState({show:false})
        document.body.style.cursor='default'
        window.removeEventListener('mousemove',this.move)
        window.removeEventListener('mouseup',this.stop)
    }
    move=({clientX,...e})=>{
        const {th,selectedCols}=this.data
        const {left}=th.getBoundingClientRect()

        const min=left+10
        const x=clientX>=min
            ?clientX
            :min

        const width=x-left
        po(left,clientX,width)
        this.ref.current.style.left=x+'px'


        selectedCols.forEach((col,index)=>{
            // po('col',col)
            const totalWidth=selectedCols.reduce((aco,{offsetWidth})=>aco+offsetWidth,0)
            const widthRates=selectedCols.map(({offsetWidth})=>{
                return 100*(offsetWidth/totalWidth)
            })

            const _width=Math.round((width/100)*widthRates[index])
            // po('width',width)
            col.style.width=_width+'px'
        })
    }
    start(sliderRef,thPRef,column){

        const selectedCols=[...this.props.table.colGroupRef.current.children].slice(column.columnNo,column.columnNo+(column.colSpan??1))

        this.data={
            selectedCols
            ,slider:sliderRef.current
            ,th:thPRef.current
        }
        this.ref.current.style.left=(thPRef.current.getBoundingClientRect().right-2)+'px'
        this.setState({show:true})

        document.body.style.cursor='col-resize'
        window.addEventListener('mousemove',this.move)
        window.addEventListener('mouseup',this.stop)
            
    }
    render(){
        return <StyledSliderLine 
            $show={this.show}
            ref={this.ref}
            style={{
                border:this.state?.show?'0.5px dashed gray':'0'
            }}
        />
    }
}