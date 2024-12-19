import React from "react"
import { flexType, po } from "../JRUtils"
import styled from "styled-components"

const StyledSeparator=styled.tbody`
    th{
        height:4px;
        background:#c6c6c6;
    }
`
const Separator=({length,children})=>{
    return <StyledSeparator className={'separator'}>
        <tr>
            <th colSpan={length}>{children}</th>
        </tr>
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
    const {style:_style,align,type,typeStyle:_typeStyle,render,setValue,getValue,onChange:_onChange,funcConfig,...column}=_column
    const onChange=(inputValue)=>{
        const targetValue=inputValue?.target?.value ?? inputValue
        setValue(record,targetValue)
        table.setValue(table.getValue())
    }
    const style=flexType(_style,table,{},{})

    render?.bind(table)
    const value=getValue(record)
    if(type){
        const typeStyle=flexType(_typeStyle,table,{record},{})
        
        content=React.createElement(type,{
            onChange:_onChange
                ?(e)=>{
                    _onChange?.bind(this)(e,{value,onChange,me:content})
                }
                :onChange
            ,value
            ,style:typeStyle
            ,render
            ,...column
            ,...funcConfig?.bind(this)({value})

        })
    }else if(render){
        content=render({index:trIndex,groupIndex:tbodyIndex,value,record,onChange})
    }else{
        content=getValue(record)
    }
    return <td 
        style={{
            textAlign:align
            ,...style
        }}
        key={tdIndex}
    >
        {content}
    </td>
}
const Tds=({leafColumns,record,table,tbodyIndex,trIndex})=>{
    return leafColumns?.map((column,tdIndex)=>{
        
        return <Td
            column={column} 
            key={tdIndex} 
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
    return <>
        <tbody key={`tbody${tbodyIndex}`}>
            {(groupData?.length >0 ) && <GroupHeader 
                groupData={groupData}
                columns={groupHeader}
                {...neededProps}
            />}
            {
                groupData?.map((record,trIndex)=>{
                    const onRowClick=table.props.onRowClick?.bind(table)
                    return <tr key={trIndex}
                        onClick={()=>{
                            onRowClick?.({record,index:trIndex,groupIndex:tbodyIndex})
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
            {(groupData?.length > 0) && <GroupFooter 
                groupData={groupData}
                columns={groupFooter}
                {...neededProps}
            />}

        </tbody>
        {(dataSource.length > (tbodyIndex+1)) && <Separator length={leafColumns.length} key={`sp-${tbodyIndex}`}></Separator>}
    </>
}

export const TBodies=({groupHeader,leafColumns,groupFooter,dataSource:_dataSource,table})=>{
    const isGroupDataType=Array.isArray(_dataSource?.[0])

    const dataSource=isGroupDataType
        ?_dataSource
        :[_dataSource]

    return dataSource?.map((groupData,tbodyIndex,c)=>{
        return  <TBody 
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
            
            
    })
}