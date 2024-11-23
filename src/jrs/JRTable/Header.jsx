import { po } from "../JRUtils"

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

export const Header=({columns})=>{
    const headers=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/>
        </tr>
    })
    return <thead>
        {headers}
    </thead>
}