import React from 'react'
import axios from 'axios'
import { colonValueString, flexType, po } from './JRUtils'
import { displaySpinner } from '../jrx/LoadingBar'
import msg from '../jrx/IMessage'
import styled from 'styled-components'


const axiosSubmit = axios.create({
    authorization: `Bearer ${localStorage.getItem("accessToken")}`
    ,timeout: 120000
    ,maxBodyLength: 104857600 //100mb 104857600
    ,maxContentLength: 104857600 //100mb
})

const StyledCover=styled.div`
    border:2px solid red;
`
const Cover=({children})=>{
    return <StyledCover>{children}</StyledCover>
}

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
                ,updateValue:false
            }
            ,this.props['post']
            ,config
        )
        this.submit(config)
    }

    put(config = {}) {
        config = Object.assign(
            {
                method:'put'
                ,updateValue:false
            }
            ,this.props['put']
            ,config
        )
        this.submit(config)
    }

    delete(config = {}) {
        config = Object.assign(
            {
                method:'delete'
                ,updateValue:false
            }
            ,this.props['delete']
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
        return this.state?.rawValue
    }
    setRawValue(rawValue){
        this.setState({rawValue:JSON.parse(JSON.stringify(rawValue??''))})
    }
    reset(){
        this.setValue(this.rawValue,true)
    }
    setValue(value,reset=false){
        if(this.props.onChange){
            this.props.onChange(value)
        }else{
            this.setState({value})
        }

        if(reset){
            this.setRawValue(value)
        }
        this.isDirty=!reset
    }
    setRes(isSuccess,response,config){
        if (isSuccess && config.updateValue) {
            const value=config.formatValue?.bind(this)(response.data)??response.data
            response.data=value
            this.setValue(value,true)
        } else if(config.updateValue){
            this.setValue(null,true)
        }  
    }
    #getValueByName(fullnamList,record){
        const name=fullnamList.shift()
        if(fullnamList.length==0){
            return record?.[name]
        }else if(record?.[name]!=null){
            return this.#getValueByName(fullnamList,record[name])
        }
    }

    getValue(fullname){
        if(fullname){
            const fullnamList=fullname.split('.')
            return this.#getValueByName(fullnamList,this[this.from]?.value)
        }else{
            return flexType(this[this.from]?.value,this,null,null)
        }
    }

    getSubmitValue(){
        return this.getValue()
    }

    getAxiosParams({url,method,value,extraValue,sendValue,transformValue,...params}){
        const _extraValue=extraValue?.bind?.(this)() ?? extraValue
        // let payload=typeof value === 'function'
        //     ?value.bind(this)({
        //         ...this.getSubmitValue()
        //         ,..._extraValue
        //     })
        //     :value==null
        //         ?{
        //             ...this.getSubmitValue()
        //             ,..._extraValue
        //         }
        //         :{
        //             ...value
        //             ,..._extraValue
        //         }
        let payload=value?.bind?.(this)({
                ...this.getSubmitValue()
                ,..._extraValue
            }) 
            ?? value==null
                ?{
                    ...this.getSubmitValue()
                    ,..._extraValue
                }
                :{
                    ...value
                    ,..._extraValue
                }
            
        if(transformValue){
            payload=transformValue.bind(this)(payload)
        }
        const headers={
           authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }    
        let params1={}
        const params2={}
        if(method=='get'){
            if(sendValue==null || sendValue)params1.params=payload
            params1.headers=headers
        }else if(method=='delete'){
            if(sendValue==null || sendValue)params1.data=payload
            params1.headers=headers
        }else{
            if(sendValue==null || sendValue){
                params1=payload
            }else{
                params1=null
            }
            params2.headers=headers
        }
        return {
            url:colonValueString(url,payload)
            ,method
            ,params1
            ,params2
            ,payload
        }
    }

    reload(){
        po('reload 還沒有做 ')
    }

    submit(config){
        const me=this
        displaySpinner({mask:config.mask})
        this.setState({loading:true})
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
            .finally(function (a,b,c) {
                me.setState({loading:false})
                displaySpinner({mask:false})
            })
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
            
        response = config?.response?.bind(this)(response,payload) ?? response
        const isSuccess = response.status >= 200 && response.status <= 299
        
        this.setRes(isSuccess,response,config)
        if (isSuccess) {
            if (config.successMessage) {
                msg.success({ message:config.successMessage });
            }
        } else {
            if (config.failedMessage) {
                msg.error({ message:config.failedMessage });
            }
        }    
        config.callback?.bind(this)(isSuccess,response,payload)
    }
    
    renderer(){
        return
    }
    
    render() {
        return this.props.cover!=null && this.state?.lodaing
            ?<Cover>{flexType(this.props.cover,this,null,null)}</Cover>
            :this.renderer()
    }
}