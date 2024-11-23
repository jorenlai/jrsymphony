import styled from "styled-components";
import { useMemo } from "react";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { Header } from "./Header";

const StyledJRTable=styled.div`
    table{
        border:1px solid gray;

        th{
            border:1px solid blue;
        }
    }
`
const columnsConfig={
    columns:[
        [
            {name:'name',label:'Name',colSpan:2}
            ,{name:'gender',label:'Gender',isLeaf:true}
            ,{name:'address',label:'Address',colSpan:4}
        ]
        ,[
            {name:'firstName',label:'First Name',isLeaf:true}
            ,{name:'lastName',label:'Last Name',isLeaf:true}
            
            ,{name:'a',label:'Address',colSpan:2}
            ,{name:'city',label:'State',isLeaf:true}
            ,{name:'country',label:'Country',isLeaf:true}

        ]
        ,[
            {name:'a1',label:'Address 1',isLeaf:true}
            ,{name:'a2',label:'Address 2',isLeaf:true}
        ]
    ]
}
export default class JRTable extends JRSubmit {
    UNSAFE_componentWillMount(){
        po('1 UNSAFE_componentWillMount',this.getValue())
        // this.setColumns(this.props.columns)
        this.setColumns(this.props.columns)
    }
 
    //------------------------------------------------------------------------------------
    setColumns(_columns){
        // po('setColumns',_columns)
        const columns=[]
        const initColumns=this.initColumns(_columns,0,columns)
        po('result',columns)
        this.setState({columns})
    }

    initColumn(_column,level,result){
        const {columns,...column}=_column
        result[level].push(column)
        po('column',level,column.label)
        if(columns&&columns.length){
            const colspan=this.initColumns(columns,level+1,result)
            column.colSpan=colspan
            return columns.length
        }else{
            column.isLeaf=true
            return 1
        }
    }
    initColumns(columns,level,result){
        if(!result[level]){
            result.push([])
        }
        const childrenLength=columns?.reduce((acc,column)=>{
            acc+=this.initColumn(column,level,result)
            return acc
        },0)
        return childrenLength
    }
    columnsConfig(){    
        return columnsConfig
    }
    //------------------------------------------------------------------------------------
    render(){
        return<StyledJRTable>
            <table>
                <Header columns={this.state.columns}/>
            </table>
            <div>{JSON.stringify(this.state.columns)}</div>
            <div>{JSON.stringify(this.getValue())}</div>
        </StyledJRTable>
    }
}