import styled from "styled-components";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";
import { useMemo } from "react";

const StyledJRColumns = styled.div`
    border:2px solid green;
`
const JRColumns=({columns,setTest})=>{
    setTest(2000)
    po('Render JRColumns')
    const header=useMemo(()=>{
        po('\tcolumns')
        return <div>
            Header
        </div>
    },[columns])
    return <StyledJRColumns>
        {JSON.stringify(columns)}
    </StyledJRColumns>
}


const StyledJRTableData = styled.pre`
    border:2px solid blue;
    margin:0;
`
const JRTableData=({value,test})=>{
    po('Render JRTableData')
    const data=useMemo(()=>{
        po('\tdata')
        return JSON.stringify(value??{},4,null)
    },[value])
    return <StyledJRTableData>
        test={test}
        <br/>
        {data}
    </StyledJRTableData>
}

const StyledJRTable = styled.div`
    border:2px solid red;
`
export default class JRTable extends JRSubmit {
    constructor(props) {
        super(props)
        if(this.props.columns===undefined && this.props.initColumns!==undefined ){
            if(this.props.setColumns===undefined){
                this.state={
                    ...this.state
                    ,columns:props.initColumns
                }
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        po('-----------componentDidUpdate-----------')
        po('columnsFrom',this.columnsFrom)
        if(this.columnsFrom==='props'){
            po('prevProps',prevProps.columns)
            po('currentProps',this.props.columns)
            po('is same',JSON.stringify(prevProps.columns)===JSON.stringify(this.props.columns))
        }
        // po(_.isEqual(prevProps.columns,this.props.columns))
    }
    //--------------------------------------------------------------------------------------
    get columnsFrom(){
        return this.props.columns===undefined?'state':'props'
    }
    getColumns(){
        return this[this.columnsFrom]?.columns
    }
    //--------------------------------------------------------------------------------------
    getValue(){
        return this.props.dataSourceName 
            ?this[this.from]?.value[this.props.dataSourceName]
            :this[this.from]?.value 
    }
    //--------------------------------------------------------------------------------------
    render(){
        let test=1
        return <StyledJRTable>
            <div>
            <JRColumns columns={this.getColumns()} test={test} setTest={(value)=>{test=value}}/>
            <JRTableData value={this.getValue()} test={test}/>
            </div>
        </StyledJRTable>
    }
}