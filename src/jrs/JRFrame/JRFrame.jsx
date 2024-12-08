import styled from "styled-components";
import JRSubmit from "../JRSubmit";
import { po } from "../JRUtils";
import { StyledJRFrame } from "./StyledJRFrame";


export default class JRFrame extends JRSubmit {
    render(){
        po('JRFrame JRFrame======================')
        return <StyledJRFrame className={`${this.props.className} jr-frame`}>
            <div>start</div>
            <main>
                <header>header</header>
                <main>
                    <div className={'left'}>left</div>
                    {this.renderMe()}
                    <div className={'right'}>right</div>
                </main>
                <footer>footer</footer>
            </main>
            <div>end</div>
        </StyledJRFrame>
    }

    renderMe(){
        return 'Render Me'
    }

}
 