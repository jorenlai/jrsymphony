import React from "react"
import styled from "styled-components"

export const StyledSlider=styled.div`
    position: absolute;
    top: 0;
    right: 0;
    height:100%;
    width:6px;
    user-select: none;
    &.resizing:hover,&.resizing{
        border-right:1px dashed black;
    }
    &:hover{
        cursor: col-resize;
        border-right:1px dashed gray;
    }
`
export default class Slider extends React.Component {
    constructor(){
        super();
        this.sliderRef=React.createRef()
    }

    stop=(e)=>{
        this.sliderRef.current.classList.remove('resizing');
        document.body.style.cursor='default'
        window.removeEventListener('mousemove',this.move)
        window.removeEventListener('mouseup',this.stop)
    }
    move=({clientX})=>{
        const {th,selectedCols,widthRates}=this.data
        const {left}=th.getBoundingClientRect()

        const min=left+10
        const x=clientX>=min
            ?clientX
            :min
        const width=x-left

        selectedCols.forEach((col,index)=>{
            const _width=Math.round((width/100)*widthRates[index])
            col.style.width=_width+'px'
        })
    }
    start(thPRef,column){
        const selectedCols=[...this.props.table.colGroupRef.current.children].slice(column.columnNo,column.columnNo+(column.colSpan??1))
        const totalWidth=selectedCols.reduce((aco,{offsetWidth})=>aco+offsetWidth,0)
        const widthRates=selectedCols.map(({offsetWidth})=>{
            return 100*(offsetWidth/totalWidth)
        })

        this.data={
            selectedCols
            ,th:thPRef.current
            ,widthRates
        }

        this.sliderRef.current.classList.add('resizing');
        document.body.style.cursor='col-resize'
        window.addEventListener('mousemove',this.move)
        window.addEventListener('mouseup',this.stop)
            
    }

    render(){
        const column=this.props.column
        return <StyledSlider
            ref={this.sliderRef}
            onMouseDown={(e)=>{
                this.start(
                    this.props.thRef
                    ,column
                )
            }}
        />
    }
}