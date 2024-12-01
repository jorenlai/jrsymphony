import styled from "styled-components";
import { useMemo } from "react";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { THead } from "./THead";
import { TBodies } from "./TBodies";

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
            po('create blank',name)
            map[name]={}
        }
        po('loop')
        setMapObject(map[name],names,value)
    }else{
        po('set value',name,value,map)
        map[name]=value
    }
}

const StyledJRTable=styled.div`
    color:#666666;
    display:flex;
    flex-direction: column;
    border:1px solid red;

    header,footer{
        border:1px solid yellow;
    }
    footer{
        height:200px;
        overflow: overlay;
    }
    >div{
        border:1px solid gray;
        flex:1;
    }
    >main{
        overflow: overlay;
        Xborder:5px solid white;
    }
    table{
        border-spacing: 0;
        min-width:100%;
        width: max-content;
        border:1px solid gray;

        thead{
            position: sticky;
            top: 0;

            XXborder-right:1px solid red;
            th{
                color: #666666;
                background: linear-gradient(180deg, rgb(46 46 45) 0%, rgb(45 44 44) 25%, rgb(85 82 82) 100%);
                box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
                
            }
        }

        tfoot{
            position: sticky;
            bottom: 0;

            background: linear-gradient(180deg, rgb(46 46 45) 0%, rgb(45 44 44) 25%, rgb(85 82 82) 100%);
            box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
            color: #666666;
        }

        tbody{
            td{
                border:1px solid #222222;
                color:#666666;
            }
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
        const leafColumns=[]
        const initColumns=this.initColumns(_columns,0,columns,leafColumns,[])
        this.setState({columns,leafColumns})
    }

    initColumn(_column,level,result,leafColumns,names){
        const {columns,...column}=_column
        
        const isBranch=columns&&columns.length
        const _names=_column.name
            ?[...names,_column.name]
            :names
        if(isBranch){
            if(_column.label)result[level].push(column)
            const c=this.initColumns(columns,level+(_column.label?1:0),result,leafColumns,_names)
            column.colSpan=c.colSpan
            return {
                colSpan:column.colSpan
            }
        }else{
            result[level].push(column)
            leafColumns.push(column)
            column.isLeaf=true
            column.names=_names



            if(_names?.length>1){
                column.setValue=function(record,value){
                    po('setValue 1111111111111111111111111111')
                    try{
                        po('try')
                        getMapObject(record,[..._names])[column.name]=value
                    }catch{
                        po('catch')
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
                    po('setValue 2222222222222222222222222')
                    record[this.name]=value
                }
                column.getValue=function(record){
                    if(typeof record[this.name] =='string'){
                        return record[this.name]
                    }else{
                        return JSON.stringify(record[this.name])
                    }
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
    columnsConfig(){    
        return columnsConfig
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

    //------------------------------------------------------------------------------------
    render(){
        return<StyledJRTable 
            className={`${this.props.className??''} jr-table`}
            style={this.props.style}
        >
            <header>header</header>
            <main>
                <table className={'jr-table-table'}>
                    <TBodies 
                        leafColumns={this.state.leafColumns} 
                        dataSource={this.getDataSource()} 
                        table={this}
                        isGroup={true}
                    />
                    <tfoot>
                        <tr>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                        </tr>
                    </tfoot>
                    <THead 
                        columns={this.state.columns} 
                        leafColumns={this.state.leafColumns}
                        table={this}
                    />
                </table>
            </main>
            <div></div>
            <footer>footer
                <pre>{JSON.stringify(this.getValue(),4,4)}</pre>
                {/* <pre>{JSON.stringify(this.state.leafColumns,null,4)}</pre> */}
            </footer>
        </StyledJRTable>
    }
}