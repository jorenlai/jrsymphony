import React from "react"

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

export const genData=()=>{
    const fa=1
    // const gData=Array(10).fill(9).map((ff,fa,fd)=>{
        const data=Array(50).fill(9).reduce((acc,f,a,d)=>{
            po(acc,f,a,d)
            acc.push({
                id:a
                ,name:`Name ${a}`
                ,age:a+28+fa//dayjs//dayjs().add(-a,'day')
                ,fullName:{
                    firstName:`First Name ${fa}`
                    ,lastName:`Last Name ${a}`
                }
                ,items:Array(5).fill(3).map((f1,a1,d1)=>{
                    return {
                        id:`IT${a}-${a1}`
                        ,name:`ITN ${a} ${a1}`
                    }
                })
            })
            return acc
        },[])
        po(data)
        return data
    // })
    
	// po(gData)
}


export const flexType=(type,me,payload,doElse)=>{
    const result=typeof type==='function'
        ?type?.bind(me)(payload)
        :type??doElse
    return result
}

export const whatType=(
    {type,typeStyle:_typeStyle,render,...config}
    ,me
    ,doElse
)=>{
    if(type){
        // const style=flexType(typeStyle,me,{},{})
        // return 'type'
        const typeStyle=typeof _typeStyle==='function'
            ?_typeStyle?.bind(me)()
            :_typeStyle
        
        return React.createElement(type,{
            style:typeStyle

        })
    }else if(render){
        return render.bind(me)()
    }else {
        return doElse
    }
    return 'what type'
}