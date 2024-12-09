import styled from "styled-components";

export const StyledJRFrame=styled.div`
    display:flex;
    flex:1;
    overflow:hidden;

    > *{
        Xborder:1px solid gray;
    }
    >main{
        display:flex;
        flex:1;
        overflow:hidden;
        flex-direction: column;
        > *{
            Xborder:1px solid gray;
        }
        >main{
            display:flex;
            flex:1;
            overflow:hidden;

            > *{
                Xborder:1px solid gray;
            }

            >head{
            }
            >main{
                overflow: overlay;
                flex:1;
            }
            >footer{
            }
        }

    }

`