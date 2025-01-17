import { flexType, po, whatType } from "../JRUtils"


const Colgroup=({leafColumns})=>{
    return <colgroup>
    {
        leafColumns?.map((_column,index)=>{
            const {width,...column}=_column
            const style={
                width
            }
            return <col style={style} key={index}></col>
        })
    }
    </colgroup>
}

const Ths=({deep,rowColumn,rowIndex,table})=>{
    return rowColumn?.map((column,colIndex)=>{
        return <th key={colIndex} 
            colSpan={column.colSpan} 
            rowSpan={column.isLeaf&&(deep>rowIndex)?deep-rowIndex+1:null} 
        >
            {flexType(column.label,table)}
        </th>
    })
}

export const HeadTrs=({columns:_columns,trClassName,table})=>{
    const columns=Array.isArray(_columns?.[0])
        ?_columns
        :[_columns]
    return columns?.map((rowColumn,rowIndex)=>{
        return <tr className={trClassName} key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex} table={table}/>
        </tr>
    })
}

export const THead=({columns,leafColumns,table})=>{
    const trs=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/>
        </tr>
    })
    return <>
        <thead>
            <HeadTrs columns={columns} table={table}/>
        </thead>
        <Colgroup leafColumns={leafColumns}/>
    </>
}







const FootThs=({table,groupData,groupIndex,deep,columns,rowIndex})=>{
    return columns?.map((column,colIndex)=>{
        // let content
        // if(type){
        //     content='type'
        // }else if(render){

        //     content=render?.bind(table)({groupData,groupIndex,ths:111})
        // }else{
        //     content=column.label
        // }
        let style=flexType(column.style,table,{},{})
        const content=whatType(column,table,column.label)
        return <th 
            style={style}
            colSpan={column.colSpan} 
            rowSpan={column.rowSpan} 
        >
            {content}
        </th>
    })
}


export const TFoot=({table,columns,leafColumns})=>{
    const trs=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <FootThs columns={rowColumn} table={table}/>
            {/* <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/> */}
        </tr>
    })
    return <>
        <tfoot>
            {trs}
        </tfoot>
    </>
}

