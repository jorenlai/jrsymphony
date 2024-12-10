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
        overflow:overlay;
        flex-direction: column;
        > *{
            XXborder:1px solid gray;
            min-height:30px;
        }

        >header{
            XXborder:1px solid  red;
            XXoverflow: overlay;
        }
        >main{
            display:flex;
            flex:1;
            overflow:hidden;
        }
        >footer{
            XXborder:1px solid  blue;
            overflow: overlay;
        }

    }

`