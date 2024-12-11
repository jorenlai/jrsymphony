import styled from "styled-components";

export const StyleJRFields=styled.main`
    flex-direction: column;
    flex:1;
    overflow: overlay;

    border: 1px solid #a0a0a0;
    background: #e1e1e1;

    >.jr-grid{
        border:10px solid gray;

        .columns{
            padding: 6px;

            label{
                color:#525252;
                text-wrap: nowrap;
                padding: 4px 10px 4px 0;
                font-weight: bold;
            }
        }
    }
`