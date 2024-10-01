import React from 'react'
import axios from 'axios'
import { colonValueString, po } from './JRUtils'


const axiosSubmit = axios.create({
    authorization: `Bearer ${localStorage.getItem("accessToken")}`
    ,timeout: 120000
    ,maxBodyLength: 104857600 //100mb 104857600
    ,maxContentLength: 104857600 //100mb
})

export default class JRSubmit extends React.Component {
    #methods = ['get', 'post', 'put','patch','delete','download']

    constructor(props) {
        super(props)
        if(this.props.value===undefined && this.props.initValue!==undefined ){
            if(this.props.onChange===undefined){
                this.state={
                    value:props.initValue
                    ,rawValue:JSON.parse(JSON.stringify(props.initValue))
                }
            }
        }
    }
    componentDidMount() {
        this.#methods
        .filter((method) => this[method] && this.props[method] && this.props[method].autoRun)
        .forEach((method) => {
            this[method]()
        })
    }
    get(_config = {}) {
        const config = Object.assign(
            {
                method:'get'
                ,value:this.getSubmitValue()
                ,updateValue:true
                // ,updateRawValue:true
            }
            ,this.props['get']
            ,_config
        )
        this.submit(config)
    }
    
    post(config = {}) {
        config = Object.assign(
            {
                method:'post'
                ,value:this.getSubmitValue()
                ,updateValue:false
                // ,updateRawValue:true
            }
            ,this.props['post']
            ,config
        )
        this.submit(config)
    }

    get from(){
        return this.props.value===undefined?'state':'props'
    }
    
    get isDirty(){
        return this.state?.isDirty
    }
    set isDirty(isDirty){
        this.setState({isDirty})
    }
    get rawValue(){
        return this.state?.rawValue//{info:{1:1}}//
    }
    setRawValue(rawValue){
        this.setState({rawValue:JSON.parse(JSON.stringify(rawValue))})
    }
    reset(){
        if(this.props.onChange){
            // po('1 reseting..........')
            this.props.onChange(this.rawValue)
        }else{
            // po('2 reseting..........',this.rawValue)
            this.setState({value:JSON.parse(JSON.stringify(this.rawValue))})
        }
        this.isDirty=false
    }
    setValue(value){
        this.isDirty=true
        if(this.props.onChange){
            this.props.onChange(value)
        }else{
            this.setState({value})
        }
    }
    getValue(){
        return this[this.from]?.value 
    }

    getSubmitValue(){
        return this.getValue()
    }

    getAxiosParams({url,method,value,...params}){
        const payload=typeof value === 'function'
            ?value.bind(this)(this.getValue())
            :value

        const headers={
           authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }    
        const params1=method=='get'
            ?{
                params:payload
                ,headers
            }
            :payload

        const params2=method=='get'
            ?{}
            :{headers}

        return {
            url//:colonValueString(url,payload)
            ,method
            ,params1
            ,params2
            ,payload
        }
    }

    submit(config){
        let _payload
        ;(()=>{
            if (Array.isArray(config.url)) {
                _payload=[]
                return Promise.allSettled(
                    config.url.map((_url) => {
                        const urlParams=typeof _url === 'object'
                            ?_url
                            :{url: _url}
                        const finalConfig=Object.assign(config,urlParams)
                        const {url,method,params1,params2,payload}=this.getAxiosParams(finalConfig)
                        _payload.push(payload)
                        return axiosSubmit[method](url,params1,params2)
                    })
                )
            }else{
                const {url,method,params1,params2,payload}=this.getAxiosParams(config)
                _payload=payload
                return axiosSubmit[method](url,params1,params2)
            }
        })()
            .then((res)=>{
                this.handleResponse(res,_payload,config)
            })
            .catch((res)=>{
                this.handleResponse(res,_payload,config)
            })
            // .finally(function (a,b,c) {
            //     console.log('finally',a,b,c);
            // })
    }

    setRes(isSuccess,response,config){
        if (isSuccess) {
            if(config.updateValue){
                const rawValue=config.formatValue?.bind(this)(response.data)??response.data
                this.setRawValue(rawValue)
                this.setValue(rawValue)
                this.isDirty=false
            }
        } else {
            if(config.updateValue){
                this.setValue(null)
                this.isDirty=false
            }
        }  
    }

    handleResponse=(response,payload,config)=>{
        if(Array.isArray(response)){
            response=response.map((re,index)=>{
                if(re.value){
                    re.value.payload=payload[index]
                }else if(re.reason){
                    re.reason.payload=payload[index]
                }
                return re
            })
        }else{
            response.payload=payload
        }
            
        response = config?.response?.(response,payload) ?? response
        const isSuccess = response.status >= 200 && response.status <= 299
        
        this.setRes(isSuccess,response,config)
        // if (isSuccess) {
        //     if(config.updateValue){
        //         const rawValue=config.formatValue?.bind(this)(response.data)??response.data
        //         this.setRawValue(rawValue)
        //         this.setValue(rawValue)
        //         this.isDirty=false
        //     }
        // } else {
        //     if(config.updateValue){
        //         this.setValue(null)
        //         this.isDirty=false
        //     }
        // }    
    }
    
    render() {
        return
    }
}