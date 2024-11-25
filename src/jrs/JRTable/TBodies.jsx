import React from "react"
import { po } from "../JRUtils"


const Td=({column:_column,record,tdIndex,table})=>{
    let content 
    const {type,...column}=_column
    const onChange=(inputValue)=>{
        const targetValue=inputValue?.target?.value ?? inputValue
        po('onchange',targetValue)
        column.setValue(record,targetValue)
        table.setValue(table.getValue())
        
    }
    if(type){
        content=React.createElement(type,{
            onChange
            ,value:column.getValue(record)
            ,...column
        })
    }else{
        content=column.getValue(record)
    }
    return <td key={tdIndex}>
        {content}
    </td>
}
const Tds=({leafColumns,record,table})=>{
    return leafColumns?.map((column,tdIndex)=>{
        return <Td column={column} record={record} tdIndex={tdIndex} table={table} key={tdIndex}/>
    })
}


const TBody=({dataSet,leafColumns,table})=>{
    return <tbody>
        {
            dataSet?.map((record,trIndex)=>{
                return <tr key={trIndex}>
                    <Tds record={record} leafColumns={leafColumns} table={table}/>
                </tr>
            })
        }
    </tbody>
}
export const TBodies=({leafColumns,dataSource:_dataSource,isGroup=false,table})=>{
    const dataSource=isGroup
        ?_dataSource
        :[_dataSource]

    return dataSource?.map((dataSet,bodyIndex,c)=>{
        return <TBody dataSet={dataSet} key={`tbody${bodyIndex}`} leafColumns={leafColumns} table={table}/>
    })
}