import React from "react"
import { po } from "../JRUtils"
import styled from "styled-components"

const StyledSeparator=styled.tr`
    th{
        height:32px;
        XXbackground:gray;
    }
`
const Separator=({length,children})=>{
    return <StyledSeparator>
        <th colSpan={length}>{children}</th>
    </StyledSeparator>
}

const GroupFooterTr=styled.tr`
    background: black;
    th{
        border:1px solid #222222;
        text-align: left;
    }
`
const GroupFooter=({leafColumns,dataGroup:_dataGroup,bodyIndex})=>{
    return <GroupFooterTr>
        <th colSpan={leafColumns.length}>Group Footer {bodyIndex}</th>
    </GroupFooterTr>
}

const GroupHeaderTr=styled.tr`
    position: sticky;
    top: 50px;
    background: #111111;
    th{
        text-align: left;
        border:1px solid #222222;
    }
`
const GroupHeader=({leafColumns,dataGroup:_dataGroup,bodyIndex})=>{
    return <GroupHeaderTr>
        <th colSpan={leafColumns.length}>GroupHeader {bodyIndex}</th>
    </GroupHeaderTr>
}
const Td=({column:_column,record,tdIndex,table})=>{
    let content 
    const {type,...column}=_column
    const onChange=(inputValue)=>{
        const targetValue=inputValue?.target?.value ?? inputValue
        // po('onchange',targetValue)
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


const TBody=({dataSource,leafColumns,table,bodyIndex})=>{
    const dataGroup=dataSource[bodyIndex]
    return <tbody>
        <GroupHeader leafColumns={leafColumns} dataGroup={dataGroup} bodyIndex={bodyIndex}/>
        {
            dataGroup?.map((record,trIndex)=>{
                return <tr key={trIndex}>
                    <Tds record={record} leafColumns={leafColumns} table={table}/>
                </tr>
            })
        }
        <GroupFooter leafColumns={leafColumns} dataGroup={dataGroup} bodyIndex={bodyIndex}/>
        {dataSource.length> (bodyIndex+1) && <Separator length={leafColumns.length}>{dataSource.length}-{bodyIndex}</Separator>}
    </tbody>
}

export const TBodies=({leafColumns,dataSource:_dataSource,table})=>{
    const isGroupDataType=Array.isArray(_dataSource?.[0])

    const dataSource=isGroupDataType
        ?_dataSource
        :[_dataSource]

    return dataSource?.map((dataGroup,bodyIndex,c)=>{
        return <TBody 
            dataSource={dataSource}
            dataGroup={dataGroup} 
            key={`tbody${bodyIndex}`} 
            leafColumns={leafColumns} 
            table={table}
            bodyIndex={bodyIndex}
        />
    })
}