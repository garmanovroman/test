import * as React from 'react';
import Network from './Requests';
import QRCode from 'qrcode.react';
import ViewStart from './ViewStart';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { createRef } from 'react';

export default class Share extends React.Component {
  constructor(props) {
    super(props);
    var today = new Date();
    this.qrRef = createRef();

    var strDate = 'Y/m/d'
      .replace('Y', today.getFullYear())
      .replace('m', today.getMonth() + 1)
      .replace('d', today.getDate());

    this.state = {
      time: '1',
      user: 'Клиент ' + new Date().toLocaleString(),
      type: 'Graphics',
      variantGuid: this.props.variantGuid,
      actor: '',
      name: '',
      actorClose: true,
      open: false,
      template: [],
      loading: false,
      tempText: '',
      selectText: '',
      changeModal: false,
      selectIndex: 0,
      saveModal: false,
      deleteModal: false,
    };

    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.handleIframe = this.handleIframe.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSelectTemp = this.handleSelectTemp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeTemplate = this.changeTemplate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeSave = this.handleChangeSave.bind(this);
    this.saveTemplate = this.saveTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
    this.handleTemplateDelete = this.handleTemplateDelete.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('message', this.handleIframe);

    for (let index = 0; index < this.props.chats.length; index++) {
      const element = this.props.chats[index];
      if (element.type == '1') {
        await this.setState({ userChatGuid: element.guid });
      }
    }
  }

  handleIframe = (e) => {
    if (e.data.type == 'actor') {
      this.setState({
        actor: e.data.value,
        actorClose: false,
      });
    }
  };

  async componentDidUpdate(prevProps) {
    if (
      prevProps.chats[0].guid !== this.props.chats[0].guid ||
      prevProps.variantGuid !== this.props.variantGuid ||
      prevProps.companyId !== this.props.companyId
    ) {
      if (prevProps.companyId !== this.props.companyId) {
        await this.setState({ open: false });
      }
      for (let index = 0; index < this.props.chats.length; index++) {
        const element = this.props.chats[index];
        if (element.type == '1') {
          await this.setState({ userChatGuid: element.guid, variantGuid: this.props.variantGuid });
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
    this.qrRef.current.classList.remove('visible');
  }

  async sendEmail(e) {
    e.preventDefault();
    const send = await new Network().InviteEmail(
      this.state.userChatGuid,
      this.state.variantGuid,
      this.state.email,
      this.state.user,
      this.state.time,
      this.state.type,
      this.state.actor,
      this.state.tempText,
    );
    await this.clear();
    this.props.close();
  }

  async sendViber(e) {
    e.preventDefault();
    const send = await new Network().InviteViber(
      this.state.userChatGuid,
      this.state.variantGuid,
      this.state.viber,
      this.state.user,
      this.state.time,
      this.state.type,
      this.state.actor,
      this.state.tempText,
    );
    await this.clear();
    this.props.close();
  }

  async sendSms(e) {
    e.preventDefault();
    const send = await new Network().InviteSms(
      this.state.userChatGuid,
      this.state.variantGuid,
      this.state.sms,
      this.state.user,
      this.state.time,
      this.state.type,
      this.state.actor,
      this.state.tempText,
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
            this.state.variantGuid,
            this.state.user,
            this.state.time,
            this.state.type,
            this.state.actor,
          );
          await this.setState({ userChatGuid: element.guid, qr: send.url });
        }
      }
      this.qrRef.current.classList.add('visible');
    }
  }

  outFunc(e) {
    var tooltip = document.getElementById('TooltipText');
    tooltip.innerHTML = 'Копировать';
  }

  async handleChangeType(e) {
    await this.setState({ type: e });
  }

  async openBox(e) {
    this.setState({
      loading: true,
    });
    const template = await new Network().GetAllTemplate(this.props.companyId);

    await this.setState({
      open: true,
      template: template,
      loading: false,
      tempText: template.length > 0 && template[0].content,
      selectText: template.length > 0 && template[0].content,
    });
  }

  async handleSelectTemp(e) {
    let temp = document.querySelectorAll('.template-sms--item');
    let indexHtml;
    for (let index = 0; index < temp.length; index++) {
      const element = temp[index];
      element.classList.remove('active');
      if (e.target == element) {
        indexHtml = index;
      }
    }
    e.target.classList.toggle('active');

    await this.setState({
      tempText: this.state.template[indexHtml].content,
      selectText: this.state.template[indexHtml].content,
      selectIndex: indexHtml,
    });
  }

  async closeBox(e) {
    await this.setState({
      open: false,
      tempText: '',
      selectText: '',
    });
  }

  async handleChange(e) {
    this.setState({ tempText: e.target.value });
  }

  async changeTemplate() {
    if (this.state.tempText != this.state.selectText) {
      await this.setState({ changeModal: true });
    }
  }

  async saveTemplate() {
    if (this.state.tempText != this.state.selectText) {
      await this.setState({ saveModal: true });
    }
  }

  async deleteTemplate() {
    await this.setState({ deleteModal: true });
  }

  async handleClose() {
    this.setState({
      changeModal: false,
      saveModal: false,
      deleteModal: false,
      tempText: '',
      selectText: '',
    });
  }

  async handleChangeSave() {
    let id = document
      .getElementsByClassName('template-sms--item')
      [this.state.selectIndex].getAttribute('data-id');
    const template = await new Network().templateUpdate(
      id,
      this.state.tempText,
      this.props.companyId,
    );
    let ar = this.state.template;
    ar[this.state.selectIndex].content = this.state.tempText;
    this.setState({
      changeModal: false,
      template: ar,
    });
  }

  async handleTemplateDelete() {
    let id = document
      .getElementsByClassName('template-sms--item')
      [this.state.selectIndex].getAttribute('data-id');
    const template = await new Network().templateDelete(Number(id));
    let ar = this.state.template;
    ar.splice(this.state.selectIndex, 1);
    this.setState({
      deleteModal: false,
      template: ar,
      selectIndex: 0,
      tempText: ar.length > 0 && ar[0].content,
    });
    ar.length > 0 &&
      document.getElementsByClassName('template-sms--item')[0].classList.toggle('active');
  }

  async handleTemplateSave() {
    let name = '';
    let type;
    name = document.querySelector('.save-template [name="name"]').value;
    type = document.querySelector('.save-template [name="type"]').value;

    if (name == '' || name === undefined || name.lengh == 0) {
      alert('Имя шаблона не заполнено');
      return false;
    }
    let template = {};
    if (type == '2') {
      template = await new Network().templateSave(name, this.state.tempText, this.props.companyId);
    } else {
      template = await new Network().templateSave(name, this.state.tempText);
    }

    let ar = this.state.template;
    ar.push({
      name: name,
      content: this.state.tempText,
      id: template.id,
      idCompany: template.idCompany,
    });
    let temp = document.querySelectorAll('.template-sms--item');
    for (let index = 0; index < temp.length; index++) {
      const element = temp[index];
      element.classList.remove('active');
    }

    this.setState({
      saveModal: false,
      template: ar,
      selectIndex: ar.length - 1,
    });
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
        <div className="share--item share--item--qr share--item--qr--long">
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
        <div className="template-sms">
          <Accordion
            onChange={(e, expanded) => {
              if (expanded) {
                this.openBox(e);
              } else {
                this.closeBox(e);
              }
            }}
            expanded={this.state.open}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>Текст +{this.state.loading && <CircularProgress />}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <textarea
                value={this.state.tempText !== false ? this.state.tempText : ''}
                onChange={(e) => this.handleChange(e)}
              />
              <div className="template-sms--List">
                <div className="template-sms--action">
                  <button onClick={() => this.changeTemplate()}>Изменить</button>{' '}
                  <button onClick={() => this.saveTemplate()}>Сохранить</button>{' '}
                  <button onClick={() => this.deleteTemplate()}>Удалить</button>
                </div>
                {this.state.template?.length > 0
                  ? this.state.template.map((c, index) => {
                      let htmlIndex = index + 1;
                      return (
                        <div
                          data-id={c.id}
                          className={
                            'template-sms--item ' +
                            (index == this.state.selectIndex || index == 0 ? 'active' : '')
                          }
                          onClick={(e) => this.handleSelectTemp(e)}>
                          {htmlIndex} - {c.name}
                          {c.idCompany > 0 && <span className="companyTemp">К</span>}
                        </div>
                      );
                    })
                  : ''}
              </div>
              <Dialog
                open={this.state.changeModal}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Вы уверены, что хотите изменить шаблон сообщения?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="share-cancel button" onClick={() => this.handleChangeSave()}>
                    Да
                  </div>
                  <div className="share-cancel button" onClick={() => this.handleClose()}>
                    Нет
                  </div>
                </DialogActions>
              </Dialog>
              <Dialog
                open={this.state.saveModal}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <form className="save-template">
                      <input
                        type="text"
                        name="name"
                        onChange={this.handleChangeText}
                        placeholder="Наименование шаблона"
                        autocomplete="off"
                      />
                      <select name="type">
                        <option value="1">Пользовательский</option>
                        {this.props.companyId > 0 && <option value="2">Компании</option>}
                      </select>
                    </form>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="share-cancel button" onClick={() => this.handleTemplateSave()}>
                    Да
                  </div>
                  <div className="share-cancel button" onClick={() => this.handleClose()}>
                    Нет
                  </div>
                </DialogActions>
              </Dialog>
              <Dialog
                open={this.state.deleteModal}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Вы уверены, что хотите удалить шаблон сообщения?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="share-cancel button" onClick={() => this.handleTemplateDelete()}>
                    Да
                  </div>
                  <div className="share-cancel button" onClick={() => this.handleClose()}>
                    Нет
                  </div>
                </DialogActions>
              </Dialog>
            </AccordionDetails>
          </Accordion>
        </div>
        <ViewStart onChangeType={this.handleChangeType} actorOpen={this.state.actorClose} />
        <div className="view-start">
          <div className="view-start--item"></div>
          <div className="view-start--item"></div>
          <div className="view-start--item"></div>
        </div>
        <div className="qr-view" ref={this.qrRef}>
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
