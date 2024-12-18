import styled from "styled-components";
import React from "react";
import { flexType, po } from "../JRUtils";
import JRFrame from "../JRFrame/JRFrame";
import {StyleJRFields} from "./StyleJRFields"

function checkMap(_name,inputValue,mapValue,nameList){
    if(nameList.length) {
        const name=nameList.shift()
        if(typeof mapValue[name]!='object' ){
            mapValue[name]={}
        }
        checkMap(_name,inputValue,mapValue[name],nameList)
    }else{
        mapValue[_name]=inputValue
    }
}

const StyledGridFrame = styled.div`
    overflow: auto;    
    flex:1;
`

const StyledGrid = styled.div`
    display: grid;
    grid: ${({ grid, cols, children }) =>
        grid
            ? grid
            : `auto / ${Array(cols ?? 1)
                .fill()
                .map(() => "1fr")
                .join(" ")}`};

    gap: ${({ $gap }) => $gap};
`
const StyledFooter = styled.div`
`

const StyledColumn=styled.div`
    flex:1;
    display: grid;

    ${({$layout,$labelWidth,$hasLabel,$valueWidth})=>{
        if($layout=='v'){
            return `grid: auto 1fr / 1fr;`
        }else{
            return `grid: 1fr / ${$hasLabel?$labelWidth:''} ${$valueWidth};`
        }
    }}
`
const StyledColumnLabel=styled.label`
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
    Xflex:1;
    Xdisplay:flex;
    overflow: hidden;

    text-align: start;
    ${({$validateValue})=>{
        if($validateValue!=null){
            return `
                > * {
                    xborder:1px solid red;
                }
            `
        }
    }}
`

// String.prototype.valueString = function (value = {}) {
//     return Array.from(new Set(this.match(/[^{}]+(?=})/g))).reduce((aco, name) => {
//         return aco.replace(new RegExp(`\\{${name}\\}`, "g"), value[name] ?? `{${name}}`);
//     }, String(this));
// };

const valueString=(str='',value = {})=>{
    return Array.from(new Set(str.match(/[^{}]+(?=})/g))).reduce((aco, name) => {
        return aco.replace(new RegExp(`\\{${name}\\}`, "g"), value?.[name] ?? `{${name}}`);
    }, String(str));
}

const ColumnMessage=({value={},record})=>{
    if(value.isValid===false){
        return valueString(value.msg,record)
    }    
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

    display: flex;
    justify-content: space-between;

    .left:{
        xflex:1;
    }
    .right{
        color:gray;
        xflex:1;
    }
`

 function requiredValidator({value}){
    if( value==null || value==''){
        return {
            msg:this.msg ?? 'This is required'
        }
    }
}
const maxValidator=({value,max})=>{
    if(typeof value==='string' && value.length>max){
        return `Max is ${max}`
    }else if(value>max){
        return `Max is ${max}`
    } 
}



export default class JRFields extends JRFrame {
    UNSAFE_componentWillMount(){
        this.#initValidateValue()

    }
    reset(){
        this.clearValidateValue()
        super.reset()
    }
    setValue(value,reset){
        super.setValue(value,reset)
        if(reset){
            this.clearValidateValue()
        }
    }
    //-----------------------------------------------------------------------------------
    #findValidator(acc,fullname,{required,...column}){
        const _required=required
        if(required==true || required?.value ){
            acc[fullname]={
                isValid:null
                ,validators:[requiredValidator.bind(_required)]
            }
        }
    }
    #loopColumnsForValidateValue(no,_fullnameList,columns,tab,result){
        const validateValue= columns?.reduce((acc,{name,type,columns,...column},index)=>{
            no+=1
            const fullnameList=name?[..._fullnameList,name]:_fullnameList
            const fullname=fullnameList.join('.')
            // po(`${no} - ${tab}fn= ${fullname}`)
            this.#findValidator(acc,fullname,column)
            if(type==null&&columns){
                this.#loopColumnsForValidateValue(no,fullnameList,columns,`${tab}\t`,result)
            }
            return acc
        },result)
        return validateValue
    }

    clearValidateValue(){
        Object.values(this.getValidateValue()).forEach((v)=>v.isValid=null)
    }
    #initValidateValue(){
        const columns=this.getColumns()
        const validateValue=this.#loopColumnsForValidateValue(0,this.props.dataSourceName?[this.props.dataSourceName]:[],columns,'',{})
        this.setState({validateValue})
    }
    #exeValidateConfig(validateConfig,value,record){
        validateConfig.isValid=true
        for(var i=0;i<validateConfig.validators.length;i++){
            const result=validateConfig.validators[i]({value,record})
            if(result){
                validateConfig.isValid=false
                validateConfig.msg=result.msg
                break
            }
        }
    }
    validateFields(){
        console.clear()
        Object.entries(this.getValidateValue())
        .filter(([fullname,validateConfig])=>validateConfig.isValid!=true)
        .forEach(([fullname,validateConfig])=>{
            this.#exeValidateConfig(validateConfig,this.getValue(fullname),this.getValue())
        })
        this.setState({validateValue:this.getValidateValue()})
    }
    get validateValueFrom(){
        return this.props.validateValue===undefined?'state':'props'
    }
    getValidateValue(fullname){
        if(fullname===undefined){
            return this[this.validateValueFrom]?.validateValue
        }else{
            return this[this.validateValueFrom]?.validateValue?.[fullname]
        }
    }
    setValidateValue(validateValue){
        if(this.props.setValidateValue){
            this.props.setValidateValue(validateValue)
        }else{
            this.setState({validateValue})
        }
    }
    createValidator({required}){
        const validators=[]
        if(required===true && required.value){
            validators.push(requiredValidator)
        }
        return validators
    }
    //--------------------------------------------------------------------------------------
    get columnsFrom(){
        return this.props.initColumns!==undefined?'state':'props'
    }
    getColumns(){
        return this[this.columnsFrom]?.columns
    }
    //-------------------------------------------------------------------------------------------
    
    get colon(){
        return this.props.labelProps?.colon===undefined ?':':this.props.labelProps?.colon
    }

    createColumn(
        parentValue
        ,{
            type,name,colSpan,rowSpan,style
            ,typeStyle:_typeStyle
            ,required
            ,...column
        }
        ,index
        ,parentName
        ,fullname
    ){
        // po('----------------------------------------')
        // po('parentName',parentName)
        // po('fullname',fullname)
        const value=name?parentValue?.[name]:parentValue

        const gap=column.gap??this.props.gap
        const label=column.label
        const _style=flexType(style,this,{},{})
        if (colSpan) _style.gridColumn = `span ${colSpan}`
        if (rowSpan) _style.gridRow = `span ${rowSpan}`
        // Object.assign(_style,style)


        let content

        const validators=this.createValidator({required,column})
        
        const fn=fullname.join('.')
        const onChange=(inputValue)=>{
            const targetValue=inputValue?.target?.value ?? inputValue
            // po('===Form onChange===',targetValue)
            try{
                parentValue[name]=targetValue
                this.setValue({...this.getValue()})
            }catch(e){
                const _value=this.getValue()??{}
                checkMap(name,targetValue,_value,[...parentName])
                this.setValue(_value)
            }
            if(this.getValidateValue()[fn]) this.#exeValidateConfig(this.getValidateValue()[fn],targetValue,this.getValue())
        }

        const _parentName=[...parentName]
        if(name!==undefined){
            _parentName.push(name)
        }

        if(type){
            const typeStyle=flexType(_typeStyle,this,null)
            content=<StyledColumnValue className={'jr-column-value'}
                style={{
                    gridColumn:label==null?'span 2':null
                }}
            >
                {
                    React.createElement(
                        type
                        ,{
                            value:value,onChange,record:parentValue,style:{width:'100%',...typeStyle}
                            ,...column
                        }
                    )
                }
            </StyledColumnValue>
        }else if(column.columns){
            content=<StyledGrid cols={column.cols} className={'jr-grid'} $gap={gap}>
                {
                    this.createColumns(
                        value
                        ,column.columns
                        ,_parentName
                        ,fullname
                    )
                }
            </StyledGrid>
        }else if(name || column.render ){
            content=<StyledColumnValue className={'jr-column-value'}
                style={{
                    gridColumn:label==null?'span 2':null
                    ,padding:column.render?'4px 0':null
                }}
            >
                {
                    column.render
                    ?column.render.bind(this)({onChange,value: value,record:this.getValue()})
                    :typeof value ==='object'?JSON.stringify(value):value
                }
            </StyledColumnValue>
        }
        const layout=column.labelProps?.layout===undefined ? this.props.labelProps?.layout: column.labelProps?.layout
        return <StyledColumn 
            $layout={layout}
            $hasLabel={label!=null }
            key={`f${index}`} 
            style={_style} 
            className={'jr-column'}
            $labelWidth={ column.labelProps?.width ?? this.props.labelProps?.width ?? '120px'}
            $valueWidth={ column.valueProps?.width ?? this.props.valueProps?.width ?? '1fr'}
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
            {   this.props.debugMode && 
                <StyledColumnFooter>
                    <div className="left">
                        <ColumnMessage value={this.getValidateValue(_parentName.join('.'))} record={this.getValue()}/>
                    </div>
                    <div className="right">
                        {/* {_parentName.join('.')} */}
                    </div>
                </StyledColumnFooter>
                // validateValue?.[name]!==undefined && <StyledColumnFooter $layout={layout}>
                //     {/* {validateValue?.[name]?.$message} */}
                //     <ColumnMessage value={validateValue?.[name]}/>
                // </StyledColumnFooter>
            }
            
        </StyledColumn>
    }

    createColumns(parentValue,columns,parentName,fullname){
        return columns?.map((column,index)=>{
            return this.createColumn(
                parentValue
                ,column,index,parentName
                ,column.name?[...fullname,column.name]:fullname
            )
        })
    }



    renderMe(){
        return <StyleJRFields className={'jr-fields'}>
            <StyledGrid cols={this.props.cols} style={this.props.gridStyle} className={'jr-grid'} $gap={this.props.gap}>
                {
                    this.createColumns(
                        this.props.dataSourceName?this.getValue()?.[this.props.dataSourceName]:this.getValue()
                        ,this.props.columns
                        ,this.props.dataSourceName?[this.props.dataSourceName]:[]
                        ,this.props.dataSourceName?[this.props.dataSourceName]:[]
                    )
                }
            </StyledGrid>
        </StyleJRFields>
    }

    // render(){
    //     return this.renderMe()
    // }
}