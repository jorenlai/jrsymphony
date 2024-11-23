import styled from "styled-components";
import JRSubmit from "./JRSubmit";
import { po } from "./JRUtils";
import { useMemo } from "react";

const StyledJRColumns = styled.div`
    border:2px solid green;
`
export default class JRTable2 extends JRSubmit {
    UNSAFE_componentWillMount(){
        po('1 UNSAFE_componentWillMount',this.getValue())
        this._columns=<div>AAAA columns</div>
    }
    
    render(){
        return<div>JRTable2</div>
    }
}