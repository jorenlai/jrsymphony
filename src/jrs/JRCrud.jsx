import JRSubmit from "./JRSubmit";

export default class JRCrud extends JRSubmit {
    render(){
        return <div className={this.props.className}>
            CRUD
        </div>
    }
}