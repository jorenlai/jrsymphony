import styled from "styled-components";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";
import React from "react";
import { JRInput } from "../App";

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



const StyledGrid = styled.div`
    xborder:2px solid red;
    flex:1;
    display: grid;
    grid: ${({ grid, cols, children }) =>
        grid
            ? grid
            : `auto / ${Array(cols ?? 1)
                .fill()
                .map(() => "1fr")
                .join(" ")}`};

    gap: ${({ $gap }) => $gap ?? "12px"};
`

const StyledColumn=styled.div`
    flex:1;
    display: grid;

    ${({$layout,$labelwidth,$hasLabel})=>{
        if($layout=='v'){
            return `grid: auto 1fr / 1fr;`
        }else{
            return `grid: 1fr / ${$hasLabel?$labelwidth:''} 1fr;`
        }
    }}
    
    > label,> main{
        xborder:1px solid gray;
        xbackground:#3d3d3d;
    }
`
const StyledColumnLabel=styled.label`
    text-wrap: nowrap;
    padding: 4px 10px 4px 0;

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
                    xborder:1px solid red;
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

const StyleJRFields=styled.div`
    xborder:2px solid green;
`

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
    _validate(name,value,validators,parentName,validateValue){
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
    get isValid(){
        return 
    }


    findValidator({name,required,max,validate,...column},value,_validateValue,tab){
        po(`${tab}name,value`,name,'=',value)
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
        return validators
        // po('findValidator',column)
    }


    _validateFields(_columns,_value,_validateValue,parentName,tab){
        _columns?.forEach((column,index)=>{
            const validateValue=column?.name? _validateValue?.[column.name]:_validateValue
            const value=column?.name? _value?.[column.name]:_value
            const validators=this.findValidator(column,value,validateValue,tab)

            const validateResult=this.validateResult(value,validators)
            // try{
                
            if(validateResult){
                po(`set ${column.name}`)
                try{
                        _validateValue[column.name]={
                        }
                        _validateValue[column.name].$message='validateResult'
                        
                        po(`${tab}set ${column.name} validateValue`,validateValue)
                    }catch(e){

                    }
                    // validateValue[column.name]={
                    //     $message:validateResult
                    // }
                    
                }else{
                    // delete validateValue[column.name]
                }
                 
            // }catch(e){
            //     const v=this.setInMap(column.name,value,validateResult,this.getValidateValue(),parentName)
            // }

            this._validateFields(column.columns,value,validateValue,parentName,`\t${tab}`)
        })
    }
    validateFields(){
        const value=this.getValue()
        const columns=this.getColumns()
        const validateValue=this.getValidateValue()
        this._validateFields(columns,value,validateValue,[],'\t')
        this.setValidateValue({...this.getValidateValue()})
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
    // componentDidUpdate(){
    //     clearTimeout(this.validateTimeout)
    //     this.validateTimeout=setTimeout(()=>{
    //         po('validate')
    //     },500)
    // }
    createColumn(value1
        ,propsValue
        ,{type,name,colSpan,rowSpan,style,required,validate,typeStyle,...column}
        ,index
        ,parentName
        ,validateValue
    ){
        const gap=column.gap??this.props.gap
        const value=name?propsValue?.[name]:propsValue
        const label=column.label
        const _style={}
        if (colSpan) _style.gridColumn = `span ${colSpan}`
        if (rowSpan) _style.gridRow = `span ${rowSpan}`
        Object.assign(_style,style)


        let content

        const validators=[]
        if(required===true){
            validators.push(requiredValidator)
        }
        if(column.max!=null){
            validators.push(({name,value})=>{
                return maxValidator({name,value,max:column.max})
            })
        }
        if(validate){
            validators.push(validate)
        }

        

        const onChange=(inputValue)=>{
            po('---------------------------------------')
            const targetValue=inputValue?.target?.value ?? inputValue
            if(validators.length){
                this._validate(name,targetValue,validators,[...parentName], validateValue)
            }
            try{
                // value1=inputValue.target?.value ?? inputValue
                po(`0 ${name}`,propsValue )
                po(`0 set propsValue[${name}]=`,targetValue)
                propsValue[name]=targetValue
                po(`0 propsValue`,propsValue)
                this.setValue({...this.getValue()})
                // po(`set propsValue[${name}] to `,targetValue)
            }catch(e){
                const _value=this.getValue()??{}
                checkMap(name,targetValue,_value,[...parentName])
                this.setValue(_value)
                // po(`catch propsValue[${name}] to `,targetValue)
            }
        }

        const _parentName=[...parentName]
        if(name!==undefined){
            _parentName.push(name)
        }

        if(type){
            content=<StyledColumnValue className={'jr-column-value'}
                $validateValue={validateValue?.[name]}
                style={{
                    gridColumn:label==null?'span 2':null
                }}
            >
                {React.createElement(type,{value:value1,onChange,parentName:_parentName,style:{width:'100%',...typeStyle},...column})}
            </StyledColumnValue>
        }else if(column.columns){
            content=<StyledGrid cols={column.cols} className={'jr-grid'} $gap={gap}>
                {
                    this.createColumns(
                        value1
                        ,value
                        ,column.columns
                        ,_parentName
                        ,name?validateValue?.[name]:validateValue
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
                    ?column.render.bind(this)({onChange,value,record:this.getValue()})
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

    createColumns(value1,value2,columns,parentName, validateValue){
        return columns?.map((column,index)=>{
            return this.createColumn(
                column.name?value1?.[column.name]:value1?.[column.name]
                ,value2,column,index,parentName, validateValue
            )
        })
    }

    render(){
        po('---------------')
        if(this.getValidateValue()==null){
            this.setValidateValue({})
        }
        return <StyleJRFields  style={this.props.style}>
            <StyledGrid cols={this.props.cols} className={'jr-grid'} $gap={this.props.gap}>
                {
                    this.createColumns(
                        this.props.name?this.getValue()?.[this.props.name]:this.getValue()
                        ,this.props.name?this.getValue()?.[this.props.name]:this.getValue()
                        ,this.props.columns
                        ,this.props.name?[this.props.name]:[]
                        ,this.props.name?this.getValidateValue()?.[this.props.name]:this.getValidateValue()
                    )
                }
            </StyledGrid>
        </StyleJRFields>
    }
}