import styled from "styled-components";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";
import { useMemo } from "react";

const StyledJRColumns = styled.div`
    border:2px solid green;
`
const JRColumns=({columns})=>{
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
const JRTableData=({dataSourceName,value,test})=>{

    const dataSource= dataSourceName 
            ?value?.[dataSourceName]
            :value 

    po('Render JRTableData')
    const data=useMemo(()=>{
        po('\tdata')
        return JSON.stringify(dataSource??{},4,null)
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
        if(this.props.initColumns!==undefined){
            this.state.columns=props.initColumns
        }
    }
    UNSAFE_componentWillMount(){
        po('1 UNSAFE_componentWillMount',this.getValue())
        this._columns=<div>AAAA columns</div>
    }
    UNSAFE_componentWillUpdate(nextProps, nextState){
        po('2 UNSAFE_componentWillUpdate',nextState)
        po('nextState',nextState)
        po('state',this.getValue())
        if(nextState.value?.columns){

            this._columns=<div>new columns</div>
        }else{
            this._columns=<div>no new columns</div>
        }
        this.isSame=JSON.stringify(nextProps.columns)===JSON.stringify(this.props.columns)
        if(this.columnsFrom==='props'){
            po('nextProps',nextProps.columns)
            po('currentProps',this.props.columns)
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
        return this.props.initColumns!==undefined?'state':'props'
    }
    getColumns(){
        return this[this.columnsFrom]?.columns
    }
    //--------------------------------------------------------------------------------------
    getValue(){
        return this[this.from]?.value 
    }
    //--------------------------------------------------------------------------------------
    render(){
        po('--------------render',this.isSame)
        return <StyledJRTable>
            (isDirty:{this.state.isDirty})
            <div>
                {this._columns}
            <JRColumns columns={this.getColumns()}/>
            <JRTableData value={this.getValue()} dataSourceName={this.props.dataSourceName}/>
            </div>
        </StyledJRTable>
    }
}