import styled from "styled-components";
import { useMemo } from "react";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { TFoot, THead } from "./THead";
import { TBodies } from "./TBodies";
import { StyledJRTable } from "./StyledJRTable";
import JRFields from "../JRFields/JRFields";
import JRThreeType from "../JRThreeType";
import JRFrame from "../JRFrame/JRFrame";
import { Checkbox, Input, InputNumber, Radio } from "antd";

const getMapObject=(map,names)=>{
    const name=names.shift(names)
    if(names.length){
        return getMapObject(map?.[name],names)
    }else{
        return map
    }
}
const setMapObject=(map,names,value)=>{
    const name=names.shift(names)
    if(names?.length){
        if(typeof map[name] != 'object'){
            map[name]={}
        }
        setMapObject(map[name],names,value)
    }else{
        map[name]=value
    }
}

export default class JRTable extends JRFrame {
    UNSAFE_componentWillMount(){
        this.setColumns(this.props.columns)
    }

    //------------------------------------------------------------------------------------
    checkableColumn(props){
        return {
            render({value,onChange,...props}){
                return <Checkbox checked={value} onChange={(e)=>{onChange(e.target.checked)}}/>
            }
            ,...props
        }
        // return {
        //     type:Checkbox
        //     ,funcConfig({value}){
        //         po('fffffffffffff',value)
        //         return {
        //             align:'center'
        //             ,checked:value
        //         }
        //     }
        //     // ,label:'A'
        //     ,onChange(e,{value,onChange,me}){
        //         onChange(e.target.checked)
        //     }
        //     ,...props
        // }
    }
    setColumns([..._columns]){
        if(this.props.checkable) 
            _columns.unshift(this.checkableColumn(this.props.checkable))
        const columns=[]
        const leafColumns=[]
        const initColumns=this.initColumns(_columns,0,columns,leafColumns,[])
        this.setState({columns,leafColumns})
    }

    initColumn(column,level,result,leafColumns,names){
        // const {columns,...column}=_column
        
        const isBranch=column.type===undefined&&column?.columns&&column?.columns.length
        const _names=column.name
            ?[...names,column.name]
            :names
        if(isBranch){
            if(column.label)result[level].push(column)
            const c=this.initColumns(column.columns,level+(column.label?1:0),result,leafColumns,_names)
            column.colSpan=c.colSpan
            return {
                colSpan:column.colSpan
            }
        }else{
            result[level].push({
                ...column
                ,isLeaf:true
            })
            leafColumns.push(column)
            // column.isLeaf=true
            column.names=_names

            if(_names?.length>1){
                column.setValue=function(record,value){
                    try{
                        getMapObject(record,[..._names])[column.name]=value
                    }catch{
                        setMapObject(record,[..._names],value)
                    }
                }
                column.getValue=function(record){
                    return _names.reduce((acc,name)=>{
                        return acc?.[name]
                    },record)
                }
            }else{
                column.setValue=function(record,value){
                    record[column.name]=value
                }
                column.getValue=function(record){
                    return record[column.name]
                }
            }
            return {
                colSpan:1
            }
        }
    }
    initColumns(columns,level,result,leafColumns,names){
        if(!result[level]){
            result.push([])
        }
        const childrenLength=columns?.reduce((acc,column)=>{
            const c=this.initColumn(column,level,result,leafColumns,names)
            acc.colSpan+=c.colSpan
            return acc
        },{
            colSpan:0
        })
        return childrenLength
    }
    //------------------------------------------------------------------------------------
    setDataSource(dataSource){

    }
    getDataSource(){
        return this.props.dataSourceName
            ? this.getValue()?.[this.props.dataSourceName]
            : this.getValue()
    }
    
    add(record,index=this.getDataSource()?.length??0,group){
        //group 還沒有考慮到

        if(this.getDataSource()){
            po('------有資料時')
            po('index',index)
            if(group===undefined){
                po('is not group')
                this.getDataSource().splice(index,0,record)//.push(record)
            }else{
                po('is group',group)
                po('value',this.getDataSource()[group])
                this.getDataSource()[group].splice(index,0,record)//.push(record)
            }
            this.setValue(this.getValue())
        }else{
            po('------沒有資料時')
            //未完成. 沒有資料的時候, 要考慮有或沒有dataSourceName的不同處理
            this.setValue({[this.props.dataSourceName]:[record]})
        }
    }

    noData(){
        const data=this.getDataSource()
        return data==null || data.length==0
    }
    //------------------------------------------------------------------------------------
    renderMe(){
        
        return<StyledJRTable
            className={`${this.props.className??''} jr-table ${this.props.onRowClick?'row-highlightable':''}`}
            //style={this.props.style} this.props.style 只能放在frame
        >
            <table className={'jr-table-table'}>
                <TBodies 
                    table={this}
                    leafColumns={this.state.leafColumns} 
                    groupHeader={this.props.groupHeader}
                    groupFooter={this.props.groupFooter}

                    dataSource={this.getDataSource()} 
                    isGroup={true}
                    onRowClick={this.props.onRowClick}
                />
                <TFoot columns={this.props.footColumns} deep={this.props.footColumns?.length} />
                <THead 
                    columns={this.state.columns} 
                    leafColumns={this.state.leafColumns}
                    table={this}
                />
            </table>
            <div className={'empty'}>{this.noData() && '無資料'}</div>
        </StyledJRTable>
    }
}


//202412/07 要解決type=JRFields的讀寫問題