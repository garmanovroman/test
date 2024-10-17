import * as React from 'react';
import Network from './Requests';
import Checkbox from '@material-ui/core/Checkbox';

export default class ShareCompany extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyes: [],
    };
  }

  componentDidMount = async () => {
    const send = await new Network().GetAllActive();
    for (let company = 0; company < send.length; company++) {
      const element = send[company];
      element.checked = false;
    }

    this.setState({
      companyes: send,
    });
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.variantGuid != this.props.variantGuid && prevProps.variantGuid != undefined) {
      //TO DO remove request will update
      const send = await new Network().GetAllActive();

      for (let company = 0; company < send?.length; company++) {
        const element = send[company];
        element.checked = false;
      }
      this.setState({
        variantGuid: this.props.variantGuid,
        companyes: send,
      });
    }
  }

  handleChange = (e) => {
    const companyes = this.state.companyes;

    for (let company = 0; company < companyes.length; company++) {
      const element = companyes[company];
      if (element.id == e.target.value) {
        element.checked = e.target.checked;
      }
    }

    this.setState({
      companyes: companyes,
    });
  };

  async handleSave() {
    const save = [];
    for (let company = 0; company < this.state.companyes.length; company++) {
      const element = this.state.companyes[company];
      if (element.checked == true) {
        save.push(element.id);
      }
    }

    await new Network().ShareCalculationWithCompanies(this.state.variantGuid, save);
    console.log('GetAllActive - 3');
    const send = await new Network().GetAllActive();
    console.log('GetAllActive - 3');
    for (let company = 0; company < send.length; company++) {
      const element = send[company];
      element.checked = false;
    }
    this.setState({
      companyes: send,
    });
    this.props.close();
  }

  render() {
    return (
      <div className="share">
        <div className="share--item">
          <span>Поделиться с фирмой</span>
        </div>
        <div className="share-close" onClick={() => this.props.close()}>
          X
        </div>
        <div>
          {this.state.companyes?.length != 0 &&
            this.state.companyes.map((c) => {
              return (
                <div className="shareCompany">
                  <span>{c.name}</span>
                  <span>
                    <Checkbox
                      checked={c.checked}
                      onChange={(e) => this.handleChange(e)}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      value={c.id}
                    />
                  </span>
                </div>
              );
            })}
        </div>
        <div className="share-cancel button" onClick={() => this.handleSave()}>
          Сохранить
        </div>
        <div className="share-cancel button" onClick={() => this.props.close()}>
          Закрыть
        </div>
      </div>
    );
  }
}
