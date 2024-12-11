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







const FootThs=({table,groupData,groupIndex,deep,columns,rowIndex})=>{
    return columns?.map(({type,render,...column},colIndex)=>{
        // let content
        // if(type){
        //     content='type'
        // }else if(render){

        //     content=render?.bind(table)({groupData,groupIndex,ths:111})
        // }else{
        //     content=column.label
        // }

        return <th 
            // key={colIndex} 
            colSpan={column.colSpan} 
            rowSpan={column.rowSpan} 
        >
            AAA
        </th>
    })
}


export const TFoot=({columns,leafColumns})=>{
    const trs=columns?.map((rowColumn,rowIndex)=>{
        return <tr key={rowIndex}>
            <FootThs columns={rowColumn}/>
            {/* <Ths deep={columns.length-1} rowColumn={rowColumn} rowIndex={rowIndex}/> */}
        </tr>
    })
    return <>
        <tfoot>
            {trs}
        </tfoot>
    </>
}

