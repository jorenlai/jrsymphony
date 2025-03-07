import { po } from "../JRUtils";
import { TFoot, THead } from "./THead";
import { TBodies } from "./TBodies";
import { StyledJRTable } from "./StyledJRTable";
import JRFrame from "../JRFrame/JRFrame";
import { Button, Checkbox } from "antd";

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
    getChecked(){
        return [1,2,3,4]
    }
    checkableColumn(props){
        return {//方法1
            render({value,onChange}){
                return <Checkbox checked={value} onChange={(e)=>{onChange(e.target.checked)}}/>
            }
            ,align:'center'
            ,name:'checked'
            ,...props
        }
        // return {//方法2
        //     type:Checkbox
        //     ,funcProps({value}){
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
    deletableColumn({name='deletable',sendValue,sendName,valueName,...props}){
        return {
            render({value,onChange}){
                return <Checkbox checked={value} onChange={(e)=>{onChange(e.target.checked)}}/>
            }
            ,align:'center'
            ,name
            ,label(){
                return <Button
                    onClick={()=>{
                        const value=this.props.delete.value 
                            ?? this.getDataSource()?.filter(record=>record[name]).map(record=>sendValue?record[sendValue]:record)
                        const callback=this.props.delete.callback 
                            ?? function(a,b,c){
                                this.reload()
                            }
                        this.delete({
                            value:sendName?{[sendName]:value}:value  
                            ,callback
                            ,...props
                        })
                    }}
                >刪除</Button>
            }
            ,...props
        }
    }
    setColumns([..._columns]){
        if(this.props.checkable) 
            _columns.unshift(this.checkableColumn(this.props.checkable))
        if(this.props.deletable){
            _columns.unshift(this.deletableColumn(this.props.deletable))
        }
        const columns=[]
        const leafColumns=[]
        const initColumns=this.initColumns(_columns,0,columns,leafColumns,[])
        this.setState({columns,leafColumns})
    }

    initColumn(column,level,result,leafColumns,names){
        const isBranch=column.type===undefined&&column?.columns&&column?.columns.length
        const _names=column.name
            ?[...names,column.name]
            :names
        if(isBranch){
            if(column.label!==null)result[level].push(column)
            const c=this.initColumns(column.columns,level+(column.label!==null?1:0),result,leafColumns,_names)
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
            if(group===undefined){
                this.getDataSource().splice(index,0,record)//.push(record)
            }else{
                this.getDataSource()[group].splice(index,0,record)//.push(record)
            }
            this.setValue(this.getValue())
        }else{
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
        >
            <table className={'jr-table-table'}>
                <TBodies 
                    table={this}
                    leafColumns={this.state.leafColumns} 
                    groupHeader={this.props.groupHeader}
                    groupFooter={this.props.groupFooter}

                    dataSource={this.getDataSource()} 
                    onRowClick={this.props.onRowClick}
                />
                {/* <tbody className={'empty-tbody'}style={{height:'100%'}}>
                    <tr><td colSpan={this.state?.leafColumns?.length}></td></tr>
                </tbody>
                <div className={'empty-div'}>AAAAAAAAAAAAA</div> */}
                <TFoot 
                    columns={this.props.footColumns} 
                    deep={this.props.footColumns?.length} 
                    table={this}
                />
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