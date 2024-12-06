import styled from "styled-components";

export const StyledJRTable=styled.div`
    color:#666666;
    display:flex;
    overflow: hidden;
    flex-direction: column;

    header,footer{
        border:1px solid yellow;
        flex-basis:100px;
    }
    footer{
        XXheight:200px;
        overflow: overlay;
    }
    >main{
        overflow: overlay;
        flex:1;
    }
    >div{
        Xborder:1px solid gray;
        flex:1;
    }
    table{

        tbody{
            tr{
                background:#eeeeee;
                td{
                    border-bottom: 1px solid #c6c6c6;
                    color:#666666;
                    height:30px;
                    padding: 4px 8px;
                }
            }
            
            tr.jr-group-header
            ,tr.jr-group-footer{
                text-align:left;
                background:#fff;

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

        thead{
            position: sticky;
            top: 0;

            XXborder-right:1px solid red;
            th{
                
                background: linear-gradient(180deg, rgba(227, 227, 226, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(210, 210, 210, 1) 100%);
                box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
                color: #666666;
            }
        }

        tfoot{
            position: sticky;
            bottom: 0;

            background: linear-gradient(180deg, rgb(46 46 45) 0%, rgb(45 44 44) 25%, rgb(85 82 82) 100%);
            box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #b28d60bf inset;
            color: #666666;
        }

    
    }
`