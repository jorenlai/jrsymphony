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
        border:1px solid gray;
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
    ${({$validateValue})=>{
        if($validateValue!=null){
            return `
                > * {
                    border:1px solid red;
                }
            `
            }
        }}
        `
const ColumnMessage=({value})=>{
    return value?.$message?.msg ?? value?.$message
}
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
    color:#ff6060;
`

const requiredValidator=({name,value})=>{
    if(value==null || value==''){
        return {
            msg:'This field is required'
            ,color:'red'
        }
    } 
}
const maxValidator=({name,value,max})=>{
    if(typeof value==='string' && value.length>max){
        return `Max is ${max}`
    }else if(value>max){
        return `Max is ${max}`
    } 
}


export default class JRFields extends JRSubmit {
    // constructor(props){
    //     super(props)
    //     po('JRFields----------------------',props)
    // }
    //-----------------------------------------------------------------------------------
    setInMap(_name,inputValue,result,mapValue,nameList){
        if(nameList?.length) {
            const name=nameList.shift()
            if(mapValue[name]===undefined) mapValue[name]={}
            return this.setInMap(_name,inputValue,result,mapValue[name],nameList)
        }else if(_name){
            mapValue[_name]={
                $message:result
            }
            return  mapValue[_name]
        }else{
            return mapValue
        }
    }
    //-----------------------------------------------------------------------------------
    get fromValidateValue(){
        return this.props.validateValue===undefined?'state':'props'
    }
    getValidateValue(createIfNull){
        // if(this[this.fromValidateValue]?.validateValue!=null){
            return this[this.fromValidateValue]?.validateValue  
        // }else if(createIfNull ){
        //     po('create validateValue')
        //     this.setValidateValue({})
        //     return this[this.fromValidateValue]?.validateValue 
        // }
    }
    setValidateValue(validateValue){
        if(this.props.setValidateValue){
            this.props.setValidateValue(validateValue)
        }else{
            this.setState({validateValue})
        }
    }
    validateResult(value,validators){
        for(var x=0;x<validators.length;x++){
            const result=validators[x]({value,record:this.getValue()})
            if(result){
                return result
            }
        }
    }
    validate(name,value,validators,parentName,validateValue){
        let _validateValue={...validateValue}
        const result=this.validateResult(value,validators)
        try{
            if(result){
                validateValue[name]={
                    $message:result
                }
            }else{
                delete validateValue[name]
            }
             
        }catch(e){
            const v=this.setInMap(name,value,result,this.getValidateValue(),parentName)
        }
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
    createColumn(propsValue,{name,colSpan,rowSpan,style,required,max,validate,...column},index,parentName
        , validateValue
    ){
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
        if(max!=null){
            validators.push(({name,value})=>{
                return maxValidator({name,value,max})
            })
        }
        if(validate){
            validators.push(validate)
        }

        

        const onChange=(inputValue)=>{
            if(validators.length){
                this.validate(name,inputValue,validators,parentName, validateValue)
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
                $validateValue={validateValue?.[name]}
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
                        ,name?validateValue?.[name]:validateValue
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
                validateValue?.[name]!==undefined && <StyledColumnFooter $layout={layout}>
                    {/* {validateValue?.[name]?.$message} */}
                    <ColumnMessage value={validateValue?.[name]}/>
                </StyledColumnFooter>
            }
            
        </StyledColumn>
    }

    createColumns(value,columns,parentName, validateValue){
        return columns?.map((column,index)=>{
            return this.createColumn(value,column,index,parentName, validateValue)
        })
    }

    render(){
        if(this.getValidateValue()==null){
            this.setValidateValue({})
        }
        return <StyledGrid cols={this.props.cols} className={'grid'} style={this.props.style}>
            {
                this.createColumns(
                    this.props.name?this.getValue()?.[this.props.name]:this.getValue()
                    ,this.props.columns
                    ,this.props.name?[this.props.name]:[]

                    ,this.props.name?this.getValidateValue()?.[this.props.name]:this.getValidateValue()
                )
            }
            {/* <pre style={{
                // gridColumn:'span 3'
            }}>
                ({this.isDirty?"Is dirty":null})
            {JSON.stringify(this.getValue(),null,4)}
            </pre> */}

            <pre>
            {JSON.stringify(this.getValidateValue(),null,4)}
            </pre>
        </StyledGrid>
    }
}