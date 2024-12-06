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

////////////////////////////////////////////////////////////////////////////


const Ths=({table,groupData,groupIndex,deep,rowColumn,rowIndex})=>{
    return rowColumn?.map(({type,render,...column},colIndex)=>{
        let content
        if(type){
            content='type'
        }else if(render){

            content=render?.bind(table)({groupData,groupIndex,ths:111})
        }else{
            content=column.label
        }

        return <th key={colIndex} 
            colSpan={column.colSpan} 
            rowSpan={column.isLeaf&&(deep>rowIndex)?deep-rowIndex+1:null} 
        >
            {content}
        </th>
    })
}

const GroupColumns=({table,columns:_columns,trClassName,groupData,tbodyIndex})=>{
    const columns=Array.isArray(_columns?.[0])
        ?_columns
        :[_columns]
    return columns?.map((rowColumn,rowIndex)=>{
        return <tr className={trClassName} key={rowIndex}>
            <Ths 
                table={table} 
                groupData={groupData}
                groupIndex={tbodyIndex}
                deep={columns.length-1} 
                rowColumn={rowColumn} 
                rowIndex={rowIndex}
            />
        </tr>
    })
}

const GroupHeaderTr=styled.tr`
    z-index: 1;
    XXposition: sticky;
    XXtop: 50px;
    background: #111111;
    th{
        text-align: left;
        border:1px solid #222222;
    }
`
const GroupHeader=(props)=>{
    return <GroupColumns 
        trClassName={'jr-group-header'}
        {...props}
    />
}

const GroupFooterTr=styled.tr`
    background: #111111;
    th{
        border:1px solid #222222;
        text-align: left;
    }
`
const GroupFooter=(props)=>{
    return <GroupColumns 
        trClassName={'jr-group-footer'}
        {...props}
    />
}



////////////////////////////////////////////////////////////////////////////
const Td=({column:_column,record,tbodyIndex,trIndex,tdIndex,table})=>{
    let content 
    const {type,render,...column}=_column
    const onChange=(inputValue)=>{
        const targetValue=inputValue?.target?.value ?? inputValue
        column.setValue(record,targetValue)
        table.setValue(table.getValue())
        
    }
    render?.bind(table)
    if(type){
        content=React.createElement(type,{
            onChange
            ,value:column.getValue(record)
            ,render

            ,...column
        })
    }else if(render){
        content=render({index:trIndex,groupIndex:tbodyIndex})
    }else{
        content=column.getValue(record)
    }
    return <td key={tdIndex}>
        {content}
    </td>
}
const Tds=({leafColumns,record,table,tbodyIndex,trIndex})=>{
    return leafColumns?.map((column,tdIndex)=>{
        return <Td column={column} key={tdIndex} 
            record={record} 
            table={table} 
            tbodyIndex={tbodyIndex}
            trIndex={trIndex} 
            tdIndex={tdIndex} 
        />
    })
}
////////////////////////////////////////////////////////////////////////////


const TBody=({groupData,dataSource,groupHeader,leafColumns,groupFooter,table,tbodyIndex})=>{
    // const dataGroup=dataSource[tbodyIndex]

    const neededProps={table,tbodyIndex}
    return <tbody>
        <GroupHeader 
            groupData={groupData}
            columns={groupHeader}
            {...neededProps}
            // leafColumns={leafColumns} 
            // dataGroup={dataGroup} 
        />
        {
            groupData?.map((record,trIndex)=>{
                const onClick=table.props.onClick?.bind(table)
                return <tr key={trIndex}
                    onClick={()=>{
                        onClick?.({record,index:trIndex,groupIndex:tbodyIndex})
                    }}
                >
                    <Tds 
                        record={record}
                        trIndex={trIndex}

                        {...neededProps}
                        leafColumns={leafColumns} 
                    />
                </tr>
            })
        }
        <GroupFooter 
            groupData={groupData}
            columns={groupFooter}
            {...neededProps}
        />
        {/* <GroupFooter columns={groupHeader}
            leafColumns={leafColumns} dataGroup={dataGroup} tbodyIndex={tbodyIndex}
        /> */}
        
    </tbody>
}

export const TBodies=({groupHeader,leafColumns,groupFooter,dataSource:_dataSource,table})=>{
    const isGroupDataType=Array.isArray(_dataSource?.[0])

    const dataSource=isGroupDataType
        ?_dataSource
        :[_dataSource]

    return dataSource?.map((groupData,tbodyIndex,c)=>{
        return <>
            <TBody 
                key={`tbody${tbodyIndex}`} 
                table={table}
                dataSource={dataSource}
                dataGroup={groupData} 
                groupData={groupData}
                tbodyIndex={tbodyIndex}
                
                groupHeader={groupHeader}
                leafColumns={leafColumns} 
                groupFooter={groupFooter}
            />
            {dataSource.length > (tbodyIndex+1) && <Separator length={leafColumns.length}></Separator>}
        </>
    })
}