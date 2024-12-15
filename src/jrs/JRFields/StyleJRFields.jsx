import styled from "styled-components";

export const StyleJRFields=styled.main`
    --column-bd-color:#cccccc;
    --column-b-color:#eeeeee;
    --column-b-hover-color:#ffffff;

    flex-direction: column;
    flex:1;
    overflow: overlay;

    color:#525252;
    XXXborder: 1px solid #a0a0a0;
    background: var(--column-b-color);

    >.jr-grid{
        background:var(--column-b-color);

        .jr-column{
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