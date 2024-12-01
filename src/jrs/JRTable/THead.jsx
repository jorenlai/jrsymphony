import { po } from "../JRUtils"


const Colgroup=({leafColumns})=>{
    return <colgroup>
    {
        leafColumns?.map((column,index)=>{
            return <col style={{width:`${column.width===undefined?50*index:column.width}`}}></col>
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

export const THead=({columns,leafColumns})=>{
    const trs=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/>
        </tr>
    })
    return <>
        <thead>
            {trs}
        </thead>
        <Colgroup leafColumns={leafColumns}/>
    </>
}