import * as React from 'react';
import Network from './Requests';
import QRCode from 'qrcode.react';
import ViewStart from './ViewStart';

export default class ShareEdit extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date();

    var strDate = 'Y/m/d'
      .replace('Y', today.getFullYear())
      .replace('m', today.getMonth() + 1)
      .replace('d', today.getDate());

    this.state = {
      time: '1',
      user: 'Клиент ' + new Date().toLocaleString(),
      type: 'Graphics',
    };

    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
  }

  componentDidMount = async () => {
    for (let index = 0; index < this.props.chats.length; index++) {
      const element = this.props.chats[index];
      if (element.type == '1') {
        await this.setState({ userChatGuid: element.guid });
      }
    }
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.chats[0].guid !== this.props.chats[0].guid) {
      for (let index = 0; index < this.props.chats.length; index++) {
        const element = this.props.chats[index];
        if (element.type == '1') {
          await this.setState({ userChatGuid: element.guid });
        }
      }
    }
  }

  async close() {
    this.props.close();
  }

  handleChangeText(event) {
    const nameInp = event.target.name;
    this.setState({ [nameInp]: event.target.value });
  }

  clear() {
    document.querySelectorAll('[data-clear]').forEach((elem) => {
      elem.value = '';
    });
    document.getElementsByClassName('qr-view')[0].classList.remove('visible');
  }

  async sendEmail(e) {
    e.preventDefault();
    const send = await new Network().InviteEmail(
      this.state.userChatGuid,
      this.state.email,
      this.state.user,
      this.state.time,
      this.state.type,
    );
    await this.clear();
    this.props.close();
  }

  async sendViber(e) {
    e.preventDefault();
    const send = await new Network().InviteViber(
      this.state.userChatGuid,
      this.state.viber,
      this.state.user,
      this.state.time,
      this.state.type,
    );
    await this.clear();
    this.props.close();
  }

  async sendSms(e) {
    e.preventDefault();
    const send = await new Network().InviteSms(
      this.state.userChatGuid,
      this.state.sms,
      this.state.user,
      this.state.time,
      this.state.type,
    );
    await this.clear();
    this.props.close();
  }

  copyLink(e) {
    var copyText = document.getElementById('copyLink');
    window.navigator.clipboard.writeText(copyText.value);
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Скопировано';
  }

  async openQR(e) {
    e.preventDefault();
    if (e.target.previousSibling.value != '') {
      for (let index = 0; index < this.props.chats.length; index++) {
        const element = this.props.chats[index];
        if (element.type == '1') {
          const send = await new Network().CreateQRCodeLink(
            element.guid,
            this.state.user,
            this.state.time,
            this.state.type,
          );
          await this.setState({ userChatGuid: element.guid, qr: send.url });
        }
      }
      document.getElementsByClassName('qr-view')[0].classList.add('visible');
    }
  }

  outFunc(e) {
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Копировать';
  }

  async handleChangeType(e) {
    await this.setState({ type: e });
  }

  render() {
    return (
      <div className="share">
        <div className="share--item">
          <span>Имя клиента</span>
          <input
            type="text"
            id="user"
            name="user"
            value={this.state.user}
            autoComplete="off"
            data-clear=""
            onChange={this.handleChangeText}
          />
        </div>
        <div className="share--item share--item--qr">
          <span>Время жизни ссылки в часах</span>
          <form>
            <input
              type="text"
              id="time"
              name="time"
              value={this.state.time}
              autoComplete="off"
              data-clear=""
              onChange={this.handleChangeText}
            />
            <input
              type="submit"
              value="Получить QR"
              name="time"
              onClick={(event) => this.openQR(event)}
            />
          </form>
        </div>
        <ViewStart onChangeType={this.handleChangeType} />
        <div className="view-start">
          <div className="view-start--item"></div>
          <div className="view-start--item"></div>
          <div className="view-start--item"></div>
        </div>
        <div className="qr-view">
          {this.state.qr !== undefined && <QRCode value={this.state.qr} renderAs={'svg'} />}
          {this.state.qr !== undefined && (
            <>
              <input id="copyLink" disabled value={this.state.qr} />
              <div className="tooltip">
                <i
                  onClick={(event) => this.copyLink(event)}
                  onMouseOut={(event) => this.outFunc(event)}>
                  <span class="tooltiptext" id="TooltipText">
                    Копировать
                  </span>
                </i>
              </div>
            </>
          )}
        </div>
        <hr />
        <div className="share--item">
          <span>Email</span>
          <form>
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="off"
              data-clear=""
              onChange={this.handleChangeText}
            />
            <input type="submit" name="email" onClick={(event) => this.sendEmail(event)} />
          </form>
        </div>
        <div className="share--item">
          <span>Viber</span>
          <form>
            <input
              type="text"
              id="viber"
              name="viber"
              autoComplete="off"
              data-clear=""
              onChange={this.handleChangeText}
            />
            <input type="submit" onClick={(event) => this.sendViber(event)} />
          </form>
        </div>
        <div className="share--item">
          <span>СМС</span>
          <form>
            <input
              type="text"
              id="sms"
              name="sms"
              autoComplete="off"
              data-clear=""
              onChange={this.handleChangeText}
            />
            <input type="submit" onClick={(event) => this.sendSms(event)} />
          </form>
        </div>
        <div className="share-cancel button" onClick={() => this.close()}>
          Отмена
        </div>
      </div>
    );
  }
}
