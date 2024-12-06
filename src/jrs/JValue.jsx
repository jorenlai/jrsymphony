import styled from "styled-components"
// import { po } from "./Util"


const StyleJValue=styled.div`
    background: #efefef;
    border-width: 1px;
    border-style: solid;
    border-color: #d9d9d9;

    box-sizing: border-box;
    margin: 0;
    padding: 3px 11px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    line-height: 1.5714285714285714;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    border-radius: 6px;
    transition: all 0.2s;
    min-height:30px;
`
export default function JValue({value,record,menu,render,style,align='align',...param}){
    const _value=render?.({value,record}) ?? value
    return <StyleJValue style={{textAlign:align,...style}}>
        {_value}
    </StyleJValue>
}