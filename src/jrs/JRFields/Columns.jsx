
const Column=()=>{
    return <div>AAAAAAAAA</div>
}
export const Columns=({parentValue,columns,parentName,fullname})=>{
    return columns?.map((column,index)=>{
        return <Column
            parentValue={parentValue}
            column={column}
            index={index}
            parentName={parentName}
            fullname={column.name?[...fullname,column.name]:fullname}
        />
    })
}