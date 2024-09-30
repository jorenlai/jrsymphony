import styled from "styled-components";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";
import React from "react";

function checkMap(_name,inputValue,mapValue,nameList){
    if(nameList?.length) {
        const name=nameList.shift()
        if(typeof mapValue[name]!='object' ){
            mapValue[name]={}
        }
        checkMap(_name,inputValue,mapValue[name],nameList)
    }else{
        mapValue[_name]=inputValue
    }
}

const StyledGrid = styled.div`
    flex:1;
    display: grid;
    grid: ${({ grid, cols, children }) =>
        grid
            ? grid
            : `auto / ${Array(cols ?? 1)
                .fill()
                .map(() => "1fr")
                .join(" ")}`};

    gap: ${({ gap }) => gap ?? "12px"};
`

const StyledColumn=styled.div`
    flex:1;
    display: grid;

    ${({$layout,$labelwidth})=>{
        if($layout=='v'){
            return `grid: auto 1fr / 1fr;`
        }else{
            return `grid: 1fr / ${$labelwidth} 1fr;`
        }
    }}
    
    > label,> main{
        border:2px solid gray;
        xbackground:#3d3d3d;
    }
`
const StyledColumnLabel=styled.label`
    text-wrap: nowrap;
    padding-right: 10px;

    ${({$layout})=>{
        if($layout=='v'){
            return `text-align: start;`
        }else{
            return `text-align: end;`
        }
    }}

    ${({$required})=>{
        if($required!==undefined && $required)
            return `
                &:not(:empty)::before{
                    padding-right:4px;
                    color:red;
                    content:'*';
                }
            `
    }}

    ${({$colon})=>{
        if($colon){
            return `
                &:not(:empty)::after{
                    content:'${$colon}';
                }
            `
        }
    }}

`
const StyledColumnValue=styled.main`
    flex:1;
    display:flex;
    overflow: hidden;

    text-align: start;
`
const StyledColumnFooter=styled.div`
    &:empty{
            display: none;
    }
    ${({$layout})=>{
        if($layout=='v'){
            return ``
        }else{
            return `grid-column-start:2;`
        }
    }}
    height:25px;
    border:1px solid red;
`

const requiredValidator=({name,value})=>{
    if(value==null || value==''){
        return 'This field is required'
    }else{
        return false
    } 
}

export default class JRFields extends JRSubmit {
    // constructor(props){
    //     super(props)
    //     po('JRFields----------------------',props)
    // }
    validate(value,validators){
        for(var x=0;x<validators.length;x++){
            const result=validators[x]({value})
            if(result){
                return result
            }
        }
    }
    setValidateValue(name,value,validators){
        po('validating this ',name)
        let validateValue={...this.state?.validateValue}

        const result=this.validate(value,validators)
        po('---validateValue---',validateValue)
        if(result){
            validateValue[name]={
                _message:result
            }
        }else{
            validateValue[name]=null
        }
        this.setState({validateValue})
    }
    //-------------------------------------------------------------------------------------------
    get colon(){
        return this.props.labelProps?.colon===undefined ?':':this.props.labelProps?.colon
    }
    // componentDidUpdate(){
    //     clearTimeout(this.validateTimeout)
    //     this.validateTimeout=setTimeout(()=>{
    //         po('validate')
    //     },500)
    // }
    createColumn(propsValue,{name,colSpan,rowSpan,style,required,...column},index,parentName){
        const label=column.label
        const _style={}
        if (colSpan) _style.gridColumn = `span ${colSpan}`
        if (rowSpan) _style.gridRow = `span ${rowSpan}`
        Object.assign(_style,style)
        const value=propsValue?.[name]

        let content

        const validators=[]
        if(required===true){
            validators.push(requiredValidator)
        }

        const onChange=(inputValue)=>{
            if(validators.length){
                this.setValidateValue(name,inputValue,validators)
            }
            try{
                propsValue[name]=inputValue.target?.value ?? inputValue
                this.setValue({...this.getValue()})
            }catch(e){
                const _value=this.getValue()??{}
                checkMap(name,inputValue.target?.value ?? inputValue,_value,parentName)
                this.setValue(_value)
            }
        }

        const _parentName=[...parentName]
        if(name!==undefined){
            _parentName.push(name)
        }

        if(column.type){
            content=<StyledColumnValue className={'value'}
                style={{
                    gap:column.columns?'12px':null
                    ,gridColumn:label==null?'span 2':null
                }}
            >
                {React.createElement(column.type,{value:name?value:propsValue,onChange,parentName:_parentName,...column})}
            </StyledColumnValue>
        }else if(column.columns){
            content=<StyledGrid cols={column.cols} className={'grid'}>
                {
                    this.createColumns(
                        name?value:propsValue
                        ,column.columns
                        ,_parentName
                    )
                }
            </StyledGrid>
        }else if(name || column.render ){
            content=<StyledColumnValue className={'value'}
                style={{
                    gap:column.columns?'12px':null
                    ,gridColumn:label==null?'span 2':null
                }}
            >
                {
                    column.render?.bind(this)({onChange,value,record:this.getValue()})
                    ?? typeof value ==='object'?JSON.stringify(value):value
                }
            </StyledColumnValue>
        }
        const layout=column.labelProps?.layout===undefined ? this.props.labelProps?.layout: column.labelProps?.layout
        return <StyledColumn 
            $layout={layout}
            key={`f${index}`} 
            style={_style} 
            className={'columns'}
            $labelwidth={ column.labelProps?.width ?? this.props.labelProps?.width ?? '120px'}
        >
            {
                label!=null 
                && <StyledColumnLabel 
                    $required={required}
                    className={'label'} 
                    $layout={layout}
                    $colon={column.labelProps?.colon===undefined ? this.colon:column.labelProps?.colon}>{label}
                </StyledColumnLabel>
            }
            {content}
            {
                required && <StyledColumnFooter $layout={layout}>
                    {this.state?.validateValue?.[name]?._message}
                </StyledColumnFooter>
            }
            
        </StyledColumn>
    }

    createColumns(value,columns,parentName){
        return columns?.map((column,index)=>{
            return this.createColumn(value,column,index,parentName)
        })
    }

    render(){
        return <StyledGrid cols={this.props.cols} className={'grid'} style={this.props.style}>
            {
                this.createColumns(
                    this.props.name?this.getValue()?.[this.props.name]:this.getValue()
                    ,this.props.columns
                    ,this.props.name?[this.props.name]:[]
                )
            }
            <pre style={{
                // gridColumn:'span 3'
            }}>
                ({this.isDirty?"Is dirty":null})
            {JSON.stringify(this.getValue(),null,4)}
            </pre>

            <pre style={{
                // gridColumn:'span 3'
            }}>
            {JSON.stringify(this.state?.validateValue,null,4)}
            </pre>
        </StyledGrid>
    }
}