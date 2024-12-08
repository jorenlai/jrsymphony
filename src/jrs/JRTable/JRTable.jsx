import styled from "styled-components";
import { useMemo } from "react";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { THead } from "./THead";
import { TBodies } from "./TBodies";
import { StyledJRTable } from "./StyledJRTable";
import JRFields from "../JRFields/JRFields";
import JRThreeType from "../JRThreeType";
import JRFrame from "../JRFrame/JRFrame";

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
    setColumns(_columns){
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

    //------------------------------------------------------------------------------------
    renderMe(){
        let footerStyle={}
        //////////1 type
        // const me=this
        // const {type:Type,style,...props}=this.props.footer??{}
        // footerStyle=style
        // const footer=<Type
        //     me={'footer form'}
        //     value={me.getValue()}
        //     XXonChange={me.setValue}
        //     onChange={(value)=>{
        //         po('table onChange setValue')
        //         me.setValue(value)
        //     }}
        //     {...props}
        // />
        //////////2 function
        const footer=typeof this.props.footer==='function' 
            ?this.props.footer?.bind(this)({style:footerStyle})
            :null
        return<StyledJRTable
            className={`${this.props.className??''} jr-table`}
            style={this.props.style}
        >
            {/* <header>
                <pre>{JSON.stringify(this.getValue(),4,4)}</pre>
            </header> */}
            {/* <main> */}
                <table className={'jr-table-table'}>
                    <TBodies 
                        leafColumns={this.state.leafColumns} 
                        dataSource={this.getDataSource()} 
                        table={this}
                        isGroup={true}

                        groupHeader={this.props.groupHeader}
                        groupFooter={this.props.groupFooter}
                    />
                    {/* <tfoot>
                        <tr>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                            <td>TFooter</td>
                        </tr>
                    </tfoot> */}
                    <THead 
                        columns={this.state.columns} 
                        leafColumns={this.state.leafColumns}
                        table={this}
                    />
                </table>
            {/* </main> */}
            {/* {this.getDataSource()==null && <div>沒有資料</div>} */}

            {/* {this.props.footer!=null && <footer style={footerStyle}>
                <JRThreeType {...this.props.footer}/>
                {footer}
            </footer>} */}
        </StyledJRTable>
    }
}


//202412/07 要解決type=JRFields的讀寫問題