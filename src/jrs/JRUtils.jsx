export const po=console.debug

export const colonValueString=(string,value)=>{
    const get=typeof value.get ==='function'
        ? (value,name)=>{
            return  value?.get(name.slice(1)) ?? name
        }
        : (value,name)=>{
            return  value?.[name.slice(1)] ?? name
        }
    return Array.from(string.match(/\:\w+/g)??[])
        .reduce((aco,name)=>{
            return aco.replace(new RegExp(name, "g"), get(value,name) );
        },string)
    ; 
}