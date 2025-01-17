import styled from "styled-components";
import JRTable from "../jrs/JRTable/JRTable";
import JRSubmit from "../jrs/JRSubmit";


export const Table=styled(JRTable)`
    .jr-group-footer{
        XXposition: sticky;
        XXbottom: 32.7px;
    }

    XXborder:10px solid red;
    table{
        tbody{
            tr{
                td{
                    padding: 4px;
                }
            }
        }
    }
`