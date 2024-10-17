import React, { Component } from 'react';
import Network from '../Requests';

export default class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: [],
      searchText: '',
    };
  }

  componentDidMount = async () => {
    var name = this.props.type;
    const template = await new Network().GetCalculationsForUser(name, this.props.company);
    this.setState({
      template: template,
    });
  };

  componentDidUpdate = async (prevProps) => {};

  handleClick = (e) => {
    document.querySelectorAll('.template').forEach((elem) => (elem.style.backgroundColor = 'none'));
    e.target.style.backgroundColor = '#ebf4fe';
    this.props.onChangeTemplate(e.target.getAttribute('guid'), e.target.innerText);
  };

  Search(event) {
    this.setState({
      searchText: event.target.value,
    });
  }

  render() {
    return (
      <div className="templates">
        <div className="templates--filter">
          <input type="text" placeholder="Поиск" onChange={(event) => this.Search(event)} />
        </div>
        {this.state.template?.length != 0
          ? this.state.template
              .filter((temp) =>
                temp.name.toLowerCase().includes(this.state.searchText.toLowerCase()),
              )
              .map((c) => {
                return (
                  <div
                    className="template"
                    style={{ backgroundImage: `url("${c.iconPath}` }}
                    guid={c.guid}
                    onClick={(e) => this.handleClick(e)}>
                    {c.name}
                  </div>
                );
              })
          : 'Расчёты отсутствуют'}
      </div>
    );
  }
}
