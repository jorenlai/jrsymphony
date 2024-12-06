import { po } from "../JRUtils"


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

const Ths=({deep,rowColumn,rowIndex})=>{
    return rowColumn?.map((column,colIndex)=>{
        return <th key={colIndex} 
            colSpan={column.colSpan} 
            rowSpan={column.isLeaf&&(deep>rowIndex)?deep-rowIndex+1:null} 
        >
            {column.label}
        </th>
    })
}

export const HeadTrs=({columns:_columns,trClassName})=>{
    const columns=Array.isArray(_columns?.[0])
        ?_columns
        :[_columns]
    return columns?.map((rowColumn,rowIndex)=>{
        return <tr className={trClassName} key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/>
        </tr>
    })
}

export const THead=({columns,leafColumns})=>{
    const trs=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/>
        </tr>
    })
    return <>
        <thead>
            <HeadTrs columns={columns}/>
        </thead>
        <Colgroup leafColumns={leafColumns}/>
    </>
}