import styled from "styled-components";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { StyledJRFrame } from "./StyledJRFrame";

const FreeType=({tag:Tag,config,me,className})=>{
    if(typeof config==='function'){
        let style
        const setStyle=function(_style){
            style=_style
        }
        const content=config.bind(me)({setStyle})
        return <Tag className={className} style={style}>{content}</Tag>
    }
}

export default class JRFrame extends JRSubmit {

    renderer(){
        return <StyledJRFrame style={this.props.style} className={`${this.props.className} jr-frame`} >
            <FreeType tag='div' config={this.props.start} me={this} className={'start'}/>
            <main>
                <FreeType tag='header' config={this.props.top} me={this}/>
                <main>
                    <FreeType tag='div' config={this.props.left} me={this} className={'left'}/>
                    {this.renderMe()}
                    <FreeType tag='div' config={this.props.right} me={this} className={'right'}/>
                </main>
                <FreeType tag='footer' config={this.props.bottom} me={this}/>
            </main>
            <FreeType tag='div' config={this.props.end} me={this} className={'end'}/>
        </StyledJRFrame>
    }

    renderMe(){
        return <div style={{flex:1}}>Render me</div>
    }

}
 