import React, {Component} from 'react';
import Network from '../Requests';

export default class TypeTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: []
        }
    }

    componentDidMount = async () => {
        const type = await new Network().GetTagReference(100, this.props.company);
        this.setState({
            type: type
        });
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.company != this.props.company) {
            const type = await new Network().GetTagReference(100, this.props.company);
            this.setState({
                type: type
            });
        }
    }

    handleClick = (e) => {
        document.querySelectorAll('.template-type').forEach(elem =>
            elem.style.backgroundColor = 'transparent'
        );
        e.target.style.backgroundColor = '#ebf4fe';
        this.props.onChangeType(e.target.getAttribute('name'));
    }

    render () {
        return (
            <div className="templates">
                {
                    this.state.type.map((c) => {
                        return(
                            <div className="template-type" style={{backgroundImage: `url("${c.iconPath}`}} name={c.type} onClick={(e) => this.handleClick(e)}>
                                {c.type} / {c.count}
                            </div>                           
                        )
                    })
                }
            </div>
        )
    }
}