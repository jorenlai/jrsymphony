import { Select } from "antd";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";

export default class JRSelect extends JRSubmit {
    get from(){
        return this.props.options===undefined?'state':'props'
    }
    setOptions(options){
        if(this.props.setOptions){
            this.props.setOptions(options)
        }else{
            this.setState({options})
        }
    }
    getOptions(){
        return this[this.from]?.options 
    }

    setRes(isSuccess,response,config){
        po('isSuccess,response,config',isSuccess,response,config)
        if(isSuccess)this.setOptions(response.data)
    }
    render(){
        const {value,onChange,...props}=this.props
        return <Select
            {...props}
            options={this.getOptions()}
            value={value}
            onChange={onChange}

        />
    }
}