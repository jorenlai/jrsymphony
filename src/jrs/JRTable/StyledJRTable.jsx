import styled from "styled-components";

export const StyledJRTable=styled.div`
    xxcolor:#666666;
    display:flex;

    border-left:1px solid gray;
    border-right:1px solid gray;
    overflow: overlay;
    flex:1;

    table{
        thead{
            position: sticky;
            top: 0;

            th{
                height:32px;
                padding: 4px;
                background: linear-gradient(180deg, rgba(227, 227, 226, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(210, 210, 210, 1) 100%);
                box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
                color: #666666;
                white-space: nowrap;
            }
        }

        tfoot{
            position: sticky;
            bottom: 0;

            background: linear-gradient(180deg, rgb(46 46 45) 0%, rgb(45 44 44) 25%, rgb(85 82 82) 100%);
            box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
            color: #666666;
        }

        tbody{
            tr{
                background:#edecec;
                td{
                    border-bottom: 1px solid #c6c6c6;
                    color:#666666;
                    padding: 4px;
                }
            }
            tr:hover{
                background:#f8f7f7;
            }
            
            tr.jr-group-header
            ,tr.jr-group-footer{
                text-align:left;
                background:#dddbdb;

                th{
                    border-bottom: 1px solid #c6c6c6;
                    border-right: 1px solid #c6c6c6;
                    padding: 4px 8px;
                }
            }
        }
                

        XXtable-layout: fixed;
        min-width:100%;
        width: max-content;

        border-spacing: 0;
        XXborder:1px solid gray;



    
    }   
            
`