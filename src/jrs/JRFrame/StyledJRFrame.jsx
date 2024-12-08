import styled from "styled-components";

export const StyledJRFrame=styled.div`
    display:flex;
    flex:1;
    overflow:hidden;

    > *{
        border:10px solid gray;
        Xoverflow: overlay;
    }
    >main{
        display:flex;
        flex:1;
        overflow:hidden;
        flex-direction: column;
        > *{
            border:10px solid blue;
            Xoverflow: overlay;
        }
        >main{
            display:flex;
            flex:1;
            overflow:hidden;

            > *{
                border:10px solid green;
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