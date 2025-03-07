import styled from "styled-components";

export const StyledJRTable=styled.div`
    --column-bd-color:#cccccc;
    --column-b-color:#eeeeee;
    --column-b-hover-color:#ffffff;

    background: var(--column-b-color);
    border:1px solid var(--column-bd-color);

    display:flex;
    flex-direction: column;
    flex:1;
    overflow: overlay;



    .empty{
        color:#848484;


        height:100%;
        flex:1;
        display:flex;
        justify-content: center;
        align-items: center;
    }

    &.row-highlightable{
        tbody{
            tr:not(.jr-group-header,.jr-group-footer):hover{
                background:var(--column-b-hover-color);
                cursor: pointer;
                transition:  background-color .8s;
                td{
                    color:black;
                    transition:color .8s;
                }

            }
        }
    }

    table{
        Xheight: 100%;
        min-width:100%;
        width: max-content;
        border-spacing: 0;

        thead{
            position: sticky;
            top: 0;

            th{
                height:32px;
                padding: 4px;
                background: linear-gradient(180deg, rgba(227, 227, 226, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(210, 210, 210, 1) 100%);
                box-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #8a847dbf inset;
                color: #525252;
                white-space: nowrap;

                position: relative;
                .slider{
                    xborder:1px solid blue;
                    position: absolute;
                    top: 0;
                    right: 0;
                    height:100%;
                    cursor: col-resize;
                    width:5px;
                    user-select: none;
                }
                .slider:hover{
                    border-right:2px solid gray;
                    border-right-style: dashed;
                }
            }
        }

        tfoot{
            position: sticky;
            bottom: -1px;

            Xtr:nth-child(1){
                th{
                    Xborder-top:1px solid var(--column-bd-color);
                }
            }
            Xth:nth-child(1){
                Xborder-left:1px solid var(--column-bd-color);
            }
            th{
                height:32px;
                padding: 4px;
                background: #e4e4e4;
                xbackground: linear-gradient(180deg, rgba(227, 227, 226, 1) 0%, rgba(255, 255, 255, 1) 25%, rgba(210, 210, 210, 1) 100%);
                xbox-shadow: 2px 2px 2px 0 #ffffffd6 inset, -1px -1px 2px 0px #8a847dbf inset;
                color: #525252;
                white-space: nowrap;

                border-left:2px solid #f4f4f4;
                border-top:2px solid #f4f4f4;
                border-right:2px solid var(--column-bd-color);
                border-bottom:2px solid var(--column-bd-color);
            }
        }

        tbody{
            tr{
                background:var(--column-b-color);
                a:#ededed;
                th{
                    color:#444444;
                }
                td{
                    border-bottom: 1px solid var(--column-bd-color);
                    color:#2e2e2e;
                    padding: 4px;
                }
            }
            
            tr.jr-group-header
            ,tr.jr-group-footer{
                text-align:left;
                background:#dddbdb;

                th{
                    border-bottom: 1px solid var(--column-bd-color);
                    border-right: 1px solid var(--column-bd-color);
                    padding: 4px 8px;
                }
            }
        }
        tbody.empty-tbody{
            td{
                border:10px solid red;
            }
        }
    }   
`