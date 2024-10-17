import React, { Component } from 'react';
import Network from '../Components/Requests';
import ImageComponent from '../Components/ImageComponent';
import { Popover } from '@material-ui/core';
import AttachedFile from './AttachedFile';
import defaultImg from '../images/fake.png';
import { template } from '../data/messageTemplate';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import MessageVariant from '../Components/messages/messageVariant';
import ChatApp from './SearchChatApp';
import { DownloadLayer } from './DownloadLayer';
import axios from 'axios';

// import React, { useState, useEffect } from 'react';

// export default function Chat(props) {
//   const [messages, setMessages] = useState([]);

//   useEffect(async () => {
//     const history = await new Network().getHistoryChat(props.guid, 20);
//     setMessages(history);
//   }, []);
//   return (
//     <div className="chat-main">
//       <div className="chat-content" id="chat">
//         <div className="load-message"></div>
//         {messages.map((mes) => {
//           if (props.guid == mes.guidChat) {
//             return mes.guidUser == props.user ? (
//               <div className="MyMessageContainer message">
//                 <div className="MyMessage">
//                   <div className="message-text">
//                     <div>{mes.createdAtString}</div>{' '}
//                     <span dangerouslySetInnerHTML={{ __html: mes.content }} />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="OtherMessageContainer message">
//                 <div className="OtherMessage">
//                   <div className="message-text">
//                     <div>{mes.createdAtString}</div>{' '}
//                     <span dangerouslySetInnerHTML={{ __html: mes.content }} />
//                   </div>
//                 </div>
//               </div>
//             );
//           }
//         })}
//         <div class="attachment-display" id="attach"></div>
//       </div>
//       {props.project.isBaseProject == false && (
//         <div className="send-message">
//           <textarea autoComplete="off" id="value-text" type="text" placeholder="Текст сообщения" />
//         </div>
//       )}
//     </div>
//   );
// }
if (typeof window.changeChat !== 'function') {
  window.changeChat = function (chat, calculation) {
    return chat;
  };
}

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentInterior: {},
      message: {
        author: '',
        text: '',
        guid: '',
      },
      messages: [],
      connection: this.props.connect,
      record: false,
      mediaRecorder: null,
      audioBlob: null,
      chunks: [],
      activeLabel: '',
      files: [],
      isEdit: false,
      device: false,
      userGuid: this.props.user,
      load: false,
      currentMessageGuid: '',
    };

    this.elemScroll = React.createRef();
    this.elemView = React.createRef();
    this.elemViewBottom = React.createRef();
    this.toScroll = React.createRef();
    this.resizeText = React.createRef();

    this.mediaRecorderDataAvailable = this.mediaRecorderDataAvailable.bind(this);
    this.mediaRecorderStop = this.mediaRecorderStop.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.handlerDisplayType = this.handlerDisplayType.bind(this);
    this.scrollChat = this.scrollChat.bind(this);
    this.resize = this.resize.bind(this);
    this.handlerSetTemplateMessage = this.handlerSetTemplateMessage.bind(this);
    this.openProjects = this.openProjects.bind(this);
    this.writeImg = this.writeImg.bind(this);
    this.handlerOpenQuickAnswers = this.handlerOpenQuickAnswers.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  async scrollChat() {
    const container = this.elemScroll.current.getBoundingClientRect();
    const elem = this.elemView.current.getBoundingClientRect();

    if (container.top == elem.top) {
      let previousScrollHeightMinusTop =
        this.elemScroll.current.scrollHeight - this.elemScroll.current.scrollTop;
      this.elemScroll.current.style.overflowY = 'hidden';

      const history = await new Network().getHistoryChat(
        this.props.guid,
        20,
        this.state.messages[0]?.guid,
      );

      if (Array.isArray(history)) {
        const add = [...history, ...this.state.messages];
        this.setState((prevState) => ({
          messages: add,
        }));
      }

      this.elemScroll.current.style.overflowY = 'scroll';
      this.elemScroll.current.scrollTop =
        this.elemScroll.current.scrollHeight - previousScrollHeightMinusTop;
    }
  }

  async resize() {
    // console.log('Ресайз');
    // this.resizeText.current.style.cssText = 'height:auto; padding:0';
    // this.resizeText.current.style.cssText = 'height:' + this.resizeText.current.scrollHeight + 'px';
  }

  async handlerDisplayType() {
    this.openProjects();
    this.handleCloseMenu();
    this.props.addDisplayType();
  }

  async openProjects() {
    var cusid_ele = document.getElementsByClassName('projects');
    cusid_ele[0].classList.toggle('active');
    var cusid_ele = document.getElementsByClassName('open-project');
    cusid_ele[0].classList.toggle('active');
  }

  async componentDidUpdate(prevProps, prevState) {
    this.elemScroll.current.removeEventListener('scroll', this.scrollChat);
    if (this.props.variantGuid != prevProps.variantGuid) {
      await this.setState({
        guidVariant: this.props.variantGuid,
      });
    }

    if (this.props.connect !== prevProps.connect) {
      if (this.state.connection) {
        this.state.connection.on('ReceiveMessage', (message) => {
          const messages = [...this.state.messages];
          messages.push({
            content: message.content,
            guidUser: message.guidUser,
            createdAtString: message.createdAtString,
            userProfilePicture: message.userProfilePicture,
            userName: message.userName,
            formatType: message.formatType,
            files: message.files,
            type: message.type,
            guid: message.guid,
            sequenceNumber: message.sequenceNumber,
            guidChat: message.guidChat,
            yaw: message.yaw,
            pitch: message.pitch,
            x: message.x,
            y: message.y,
            clientId: message.clientId,
            guidCalculationFrom: message.guidCalculationFrom,
            guidCalculation: message.guidCalculation,
          });

          this.setState({
            messages: messages,
          });

          const el = this.elemViewBottom.current.getBoundingClientRect();
          const cont = this.elemScroll.current.getBoundingClientRect();
          if (el.bottom - cont.bottom < 200) {
            var block = document.getElementById('chat');
            block.scrollTop = block.scrollHeight;
          }

          this.props.updateLastMessage(message);
          this.props.sortChat(message.guidProject, message.content);

          if (message.type == 3) {
            const receivedMessage = {
              type: 'receivedMessage',
              value: {
                content: message.content,
                files: message.files,
                guid: message.guid,
                x: message.x,
                y: message.y,
                yaw: message.yaw,
                pitch: message.pitch,
                sequenceNumber: message.sequenceNumber,
              },
            };
            var iFrame = document.getElementById('view-container-iframe');
            if (iFrame != null) {
              iFrame.contentWindow.postMessage(receivedMessage, '*');
            }
          }
        });
      }
    }
    if (
      // this.props.guid !== this.state.guidChat ||
      // this.props.project.variantGuid !== prevState.guidVariant
      // this.props.connect != prevProps.connect ||
      this.props.guid != prevProps.guid
      // this.props.guidVariant != prevProps.guidVariant
    ) {
      const history = await new Network().getHistoryChat(this.props.guid, 20);

      await this.setState({
        guidChat: this.props.guid,
        messages: history,
        firstMessage: history[0]?.guid,
        guidVariant: this.props.variantGuid,
      });
      var block = document.getElementById('chat');
      block.scrollTop = block.scrollHeight;
    }
    this.elemScroll.current.addEventListener('scroll', this.scrollChat);
  }

  componentDidMount = async () => {
    // this.resizeText.current.addEventListener('keydown', this.resize);
    if (this.props.connect?.connectionStarted) {
      this.props.connect.on('ReceiveMessage', (message) => {
        const messages = [...this.state.messages];
        messages.push({
          content: message.content,
          guidUser: message.guidUser,
          createdAtString: message.createdAtString,
          userProfilePicture: message.userProfilePicture,
          userName: message.userName,
          formatType: message.formatType,
          files: message.files,
          type: message.type,
          guid: message.guid,
          sequenceNumber: message.sequenceNumber,
          guidChat: message.guidChat,
          yaw: message.yaw,
          pitch: message.pitch,
          x: message.x,
          y: message.y,
          clientId: message.clientId,
          guidCalculationFrom: message.guidCalculationFrom,
          guidCalculation: message.guidCalculation,
        });

        this.setState({
          messages: messages,
        });

        const el = this.elemViewBottom.current.getBoundingClientRect();
        const cont = this.elemScroll.current.getBoundingClientRect();
        if (el.bottom - cont.bottom < 200) {
          var block = document.getElementById('chat');
          block.scrollTop = block.scrollHeight;
        }

        this.props.updateLastMessage(message);
        this.props.sortChat(message.guidProject, message.content);

        if (message.type == 3) {
          const receivedMessage = {
            type: 'receivedMessage',
            value: {
              content: message.content,
              files: message.files,
              guid: message.guid,
              x: message.x,
              y: message.y,
              yaw: message.yaw,
              pitch: message.pitch,
              sequenceNumber: message.sequenceNumber,
            },
          };
          var iFrame = document.getElementById('view-container-iframe');
          if (iFrame != null) {
            iFrame.contentWindow.postMessage(receivedMessage, '*');
          }
        }
      });
    }
    const history = await new Network().getHistoryChat(this.props.guid, 20);
    let deviceSet = false;
    // if (!navigator.mediaDevices?.getUserMedia) {
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       video: true,
    //     })
    //     .then((deviceSet = true));
    // }

    this.setState({
      messages: history,
      users: this.props.project.users,
      guidVariant: this.props.variantGuid,
      device: deviceSet,
    });

    var block = document.getElementById('chat');
    block.scrollTop = block.scrollHeight;
    this.elemScroll.current.addEventListener('scroll', this.scrollChat);
  };

  componentWillUnmount() {
    this.elemScroll.current.removeEventListener('scroll', this.scrollChat);
    // this.resizeText.current.removeEventListener('keydown', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentInterior: nextProps.currentInterior,
    });
  }

  UpdateNameInputValue(evt) {
    const t = { ...this.state.currentInterior };
    t.name = evt.target.value;
    this.setState({
      currentInterior: t,
    });
  }

  UpdateMessageInputValue(evt) {
    const t = { ...this.state.message };
    t.text = evt.target.value;
    this.setState({
      message: t,
    });
  }

  async SendMessage() {
    if (this.state.connection) {
      try {
        if (this.state.files.length === 0) {
          const sendMessage = await new Network().SendMessage(
            this.state.userGuid,
            this.props.guid,
            this.state.message.text,
            'User',
            this.state.guidVariant,
          );
        } else {
          const formData = new FormData();
          formData.append('GuidUser', this.state.userGuid);
          formData.append('FormatType', 2);
          formData.append('GuidChat', this.props.guid);
          formData.append('Content', this.state.message.text);
          this.state.files.map((file) => {
            formData.append('Files', file);
          });
          formData.append('Type', 'User');
          const SendMessageWithFiles = await new Network().SendMessageWithFiles(formData);
        }
      } catch (e) {
        console.log(e);
      } finally {
        // document.getElementById('value-text').value = '';
        this.setState({
          message: {
            author: 'testUser1',
            text: '',
          },
          files: [],
        });
      }
    } else {
      console.log('Нет соединения signalR');
    }
  }

  async mediaRecorderDataAvailable(e) {
    this.state.chunks.push(e.data);
  }

  async mediaRecorderStop() {
    this.state.audioBlob = new Blob(this.state.chunks, { type: 'audio/mp3' });
    const audioURL = window.URL.createObjectURL(this.state.audioBlob);

    const formData = new FormData();
    formData.append('GuidUser', this.state.userGuid);
    formData.append('FormatType', 3);
    formData.append('GuidChat', this.props.guid);
    formData.append('GuidCalculation', this.state.guidVariant);
    formData.append('Files', this.state.audioBlob, 'recording.mp3');
    const updateAvatarUser = await new Network().SendMessageWithFiles(formData);

    this.state.mediaRecorder = null;
    this.state.chunks = [];
  }

  async SendVoice(e) {
    const micro = document.querySelectorAll('.micro');

    micro.forEach((e) => {
      let sTemp = e.getAttribute('from');
      e.setAttribute('from', e.getAttribute('to'));
      e.setAttribute('to', sTemp);
      e.beginElement();
    });

    if (this.state.connection.connectionStarted) {
      if (!navigator.mediaDevices || !navigator.mediaDevices?.getUserMedia) {
        alert('Your browser does not support recording!');
        return;
      }
      if (!this.state.mediaRecorder) {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .then((stream) => {
            this.state.mediaRecorder = new MediaRecorder(stream);
            this.state.mediaRecorder.start();
            this.state.mediaRecorder.ondataavailable = this.mediaRecorderDataAvailable;
            this.state.mediaRecorder.onstop = this.mediaRecorderStop;
          })
          .catch((err) => {
            alert(`The following error occurred: ${err}`);
            // change image in button
            // recordButtonImage.src = '/images/microphone.png';
          });
      } else {
        this.state.mediaRecorder.stop();
      }
    }
  }

  async onAddFile(e) {
    try {
      if (e.target.files[0] !== 'undefined') {
        let files = e.target.files;
        let filesArr = Array.prototype.slice.call(files);
        if (this.state.files.length + filesArr.length >= 10) {
          alert('Максимум 10 файлов.');
          throw new Error('You can only add 10 files at once.');
        }
        filesArr.map((file) => {
          this.state.files.push(file);
        });
      }
      this.SendOrUpdate();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ anchorEl: null });
      e.target.value = null;
    }
  }

  async handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  async handleCloseMenu() {
    this.setState({ anchorEl: null });
  }

  async handleCloseQuickAnswer() {
    this.setState({ showQuickAnswers: null });
  }

  async keyDown(e) {
    if (e.ctrlKey && e.keyCode == 13) {
      e.preventDefault(e);
      this.setState({
        message: {
          text: this.state.message.text + '\n',
        },
      });
    } else if (e.keyCode == 13) {
      e.preventDefault(e);
      this.SendMessage();
    }
  }

  async onFormSubmit(e) {
    e.preventDefault(e);
    // console.log("onFormSubmit");
    // console.log(e);
    // console.log(e.keyCode);
    // console.log("onFormSubmit");
    // if (e.keyCode == 13) {
    //   this.SendMessage();
    // }
  }

  async removeAttachment(index) {
    if (index > -1) {
      this.state.files.splice(index, 1);
      this.setState({ files: this.state.files });
    }
  }

  async editMessage(message) {
    this.toggleEditingHead();
    this.toggleMicro();
    const t = { ...this.state.message };
    t.text = message.content;
    t.guid = message.guid;
    this.setState({
      message: t,
      isEdit: true,
    });
  }

  async cancelEdit() {
    this.toggleEditingHead();
    this.toggleMicro();
    document.getElementById('value-text').value = '';
    this.setState({
      message: {
        author: 'testUser1',
        text: '',
      },
      isEdit: false,
    });
  }

  toggleEditingHead() {
    var editingHead = document.querySelector('.editing-head');
    editingHead.classList.contains('active')
      ? editingHead.classList.remove('active')
      : editingHead.classList.add('active');
  }

  toggleMicro() {
    var micro = document.querySelector('.voice');
    micro.classList.contains('hidden')
      ? micro.classList.remove('hidden')
      : micro.classList.add('hidden');
  }

  async UpdateMessage() {
    if (this.state.message.text !== '') {
      try {
        const updateMessage = await new Network().UpdateMessage(
          this.state.message.guid,
          this.state.message.text,
        );
      } catch (e) {
        console.log(e);
      } finally {
        document.getElementById('value-text').value = '';
        this.toggleMicro();
        this.toggleEditingHead();
        this.setState({
          messages: this.state.messages.map((message) =>
            message.guid === this.state.message.guid
              ? { ...message, content: this.state.message.text }
              : message,
          ),
          message: {
            text: '',
            guid: '',
          },
          isEdit: false,
        });
      }
    }
  }

  SendOrUpdate() {
    this.state.isEdit ? this.UpdateMessage() : this.SendMessage();
  }

  async labelAction(guid, data) {
    var iFrame = document.getElementById('view-container-iframe');
    iFrame.contentWindow.postMessage(data, '*');
    await this.setState({
      activeLabel: guid,
    });
  }

  async handlerSetTemplateMessage(id) {
    this.handleCloseMenu();
    this.setState({ showQuickAnswers: null });
    switch (id) {
      case 'common':
        this.setTemplateMessage(template.common);
        break;
      case 'cost':
        this.setTemplateMessage(template.cost);
        break;
    }
  }

  async setTemplateMessage(template) {
    const t = { ...this.state.message };
    t.text = template;
    this.setState({
      message: t,
    });
  }

  async changeVarinat(guidVariant, mesGuid, content) {
    if (guidVariant != null) {
      this.props.setVariant(guidVariant);
      this.setState({
        currentMessageGuid: mesGuid,
      });
      if (content && content != '') {
        var iFrame = document.getElementById('view-container-iframe');
        const receivedMessage = {
          type: 'viewMessage',
          value: {
            content: content,
          },
        };
        if (iFrame != null) {
          iFrame.contentWindow.postMessage(receivedMessage, '*');
        }
      }
    }
  }

  async retryBasiz(projectGuid) {
    try {
      const response = await axios.post(
        'https://api.system123.ru/api/Projects/RetryConvertFromBazis',
        {
          projectGuid: this.props?.project?.projectGuid,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async writeImg(params) {
    console.log('Нарисуй картинку');
  }

  async handlerOpenQuickAnswers(event) {
    this.setState({
      showQuickAnswers: event.currentTarget,
    });
  }

  render() {
    return (
      <>
        {/* <ChatApp /> */}
        <div className="chat-main">
          <div className="hide-chat">
            {window.changeChat(this?.props?.guid, this.props?.variantGuid)}
          </div>
          <div className="chat-content" id="chat" ref={this.elemScroll}>
            <div className="load-message" ref={this.elemView}></div>
            {this.props.guid != undefined &&
              this.props.guid != null &&
              this.props.guid != '' &&
              this.state.messages.map((mes) => {
                if (this.props.guid == mes.guidChat) {
                  return mes.guidUser == this.props.user && this.props.user != undefined ? (
                    <div
                      className={
                        'MyMessageContainer message ' +
                        (this.state.currentMessageGuid == mes.guid ? 'active' : '')
                      }>
                      <div className="MyMessage">
                        {mes.type == 6 && (
                          <>
                            <div
                              className="variantChange"
                              onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                              <MessageVariant mes={mes} variants={this.props.variants} />
                              <div
                                style={{
                                  backgroundImage: `url(${
                                    mes.userProfilePicture !== null
                                      ? mes.userProfilePicture
                                      : defaultImg
                                  }`,
                                }}
                                className="message-icon"></div>
                            </div>
                          </>
                        )}
                        {mes.type != 5 && Number(mes.type) != 6 ? (
                          <div
                            className="variantChange"
                            onClick={() =>
                              this.changeVarinat(mes.guidCalculation, mes.guid, mes.content)
                            }>
                            {mes.formatType == 3 ? (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                      files: mes.files,
                                    }),
                                })}>
                                <div>{mes.createdAtString}</div>
                                <audio controls>
                                  <source src={mes.files[0].path} type="audio/mpeg"></source>
                                </audio>
                              </div>
                            ) : mes.formatType == 2 ? (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                      files: mes.files,
                                    }),
                                })}>
                                <div>{mes.createdAtString}</div>{' '}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: mes.content,
                                  }}
                                />
                                <div className="div-table-row">
                                  {mes.files.map((file) => {
                                    return <ImageComponent props={file.path} guid={mes.guid} />;
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                    }),
                                })}>
                                <div>{mes.createdAtString}</div>{' '}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: mes.content,
                                  }}
                                />
                              </div>
                            )}

                            <div
                              style={{
                                backgroundImage: `url("${
                                  mes.userProfilePicture !== null
                                    ? mes.userProfilePicture
                                    : 'https://storage.yandexcloud.net/lab.system123.render.test/' +
                                      mes.userProfilePicture
                                }`,
                              }}
                              className="message-icon"></div>
                            <div
                              className={
                                mes.formatType == 3
                                  ? 'message-edit-icon'
                                  : 'message-edit-icon active'
                              }
                              onClick={() => this.editMessage(mes)}></div>
                          </div>
                        ) : mes.clientId == 'web-business-app' && mes.type == 5 ? (
                          <div
                            className="img-mes img-mes--right"
                            onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                            <div className="img-mes--from">2D</div>
                            <div className="img-mes--arrow">
                              <div className="img-mes--arrow pointer"></div>
                            </div>
                            <div className="img-mes--to">
                              <div className="img-mes--plus">+</div>
                              <div
                                className="img-mes--version"
                                style={{
                                  backgroundImage: `url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${mes.guidCalculation}/main_icon.jpg")`,
                                }}></div>
                            </div>
                          </div>
                        ) : mes.clientId == 'S123-iOS' && mes.type == 5 ? (
                          <div
                            className="img-mes img-mes--right"
                            onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                            <div className="img-mes--from">AR</div>
                            <div className="img-mes--arrow">
                              <div className="img-mes--arrow pointer"></div>
                            </div>
                            <div className="img-mes--to">
                              <div className="img-mes--plus">+</div>
                              <div
                                className="img-mes--version"
                                style={{
                                  backgroundImage: `url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${mes.guidCalculation}/main_icon.jpg")`,
                                }}></div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        'OtherMessageContainer message ' +
                        (this.state.currentMessageGuid == mes.guid ? 'active' : '')
                      }>
                      <div className="OtherMessage">
                        {mes.type == 6 && (
                          <div
                            className="variantChange"
                            onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                            <MessageVariant mes={mes} variants={this.props.variants} />
                            <div
                              style={{
                                backgroundImage: `url(${
                                  mes.userProfilePicture !== null
                                    ? mes.userProfilePicture
                                    : defaultImg
                                }`,
                              }}
                              className="message-icon"></div>
                          </div>
                        )}
                        {mes.type != 5 && Number(mes.type) != 6 ? (
                          <div
                            className="variantChange"
                            onClick={() =>
                              this.changeVarinat(mes.guidCalculation, mes.guid, mes.content)
                            }>
                            <div
                              style={{
                                backgroundImage: `url(${
                                  mes.userProfilePicture !== null
                                    ? mes.userProfilePicture
                                    : defaultImg
                                }`,
                              }}
                              className="message-icon"></div>
                            {mes.formatType == 3 ? (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                      files: mes.files,
                                    }),
                                })}>
                                <div className="usersName">
                                  {mes.userName} {mes.createdAtString}
                                </div>
                                <div>
                                  <audio controls>
                                    <source src={mes.files[0].path} type="audio/mpeg"></source>
                                  </audio>
                                </div>
                              </div>
                            ) : mes.formatType == 2 ? (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                      files: mes.files,
                                    }),
                                })}>
                                <div>{mes.createdAtString}</div>{' '}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: mes.content,
                                  }}
                                />
                                <div className="div-table-row">
                                  {mes.files.map((file) => {
                                    return <ImageComponent props={file.path} guid={mes.guid} />;
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={
                                  mes.type == 3
                                    ? mes.guid == this.state.activeLabel
                                      ? 'message-text label active'
                                      : 'message-text label'
                                    : 'message-text'
                                }
                                {...(mes.type == 3 && {
                                  onClick: () =>
                                    this.labelAction(mes.guid, {
                                      yaw: mes.yaw,
                                      pitch: mes.pitch,
                                      sequenceNumber: mes.sequenceNumber,
                                      x: mes.x,
                                      y: mes.y,
                                      type: 'label',
                                      guid: mes.guid,
                                    }),
                                })}>
                                <div className="usersName">
                                  {mes.userName} {mes.createdAtString}
                                </div>
                                {mes.formatType == 5 ? (
                                  <>
                                    <button
                                      onClick={(e) => this.retryBasiz()}
                                      dangerouslySetInnerHTML={{
                                        __html: mes.content,
                                      }}
                                      className="button-chat"></button>
                                  </>
                                ) : (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: mes.content,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        ) : mes.clientId == 'web-business-app' && mes.type == 5 ? (
                          <div
                            className="img-mes img-mes--left"
                            onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                            <div className="img-mes--from">2D</div>
                            <div className="img-mes--arrow">
                              <div className="img-mes--arrow pointer"></div>
                            </div>
                            <div className="img-mes--to">
                              <div className="img-mes--plus">+</div>
                              <div
                                className="img-mes--version"
                                style={{
                                  backgroundImage: `url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${mes.guidCalculation}/main_icon.jpg")`,
                                }}></div>
                            </div>
                          </div>
                        ) : mes.clientId == 'S123-iOS' && mes.type == 5 ? (
                          <div
                            className="img-mes img-mes--left"
                            onClick={() => this.changeVarinat(mes.guidCalculation, mes.guid)}>
                            <div className="img-mes--from">3D</div>
                            <div className="img-mes--arrow">
                              <div className="img-mes--arrow pointer"></div>
                            </div>
                            <div className="img-mes--to">
                              <div className="img-mes--plus">+</div>
                              <div
                                className="img-mes--version"
                                style={{
                                  backgroundImage: `url("https://storage.yandexcloud.net/system123.render.lab/calculationResults/${mes.guidCalculation}/main_icon.jpg")`,
                                }}></div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            <div className="attachment-display" id="attach">
              {this.state.files.length > 0 ? (
                this.state.files.map((file, index) => {
                  return (
                    <AttachedFile
                      key={file.name + index}
                      attachedFile={file}
                      index={index}
                      removeAttachment={this.removeAttachment}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div className="scroll-break" ref={this.elemViewBottom}></div>
          </div>
          {this.props.project.isBaseProject == false ? (
            <div className="send-message">
              <div className="editing-head">
                Редактирование сообщения
                <span className="cancel-edit" onClick={() => this.cancelEdit()}></span>
              </div>

              <form onSubmit={(e) => this.onFormSubmit(e)}>
                <div className="menu-container">
                  <button
                    id="upload-button"
                    aria-describedby={'mobile-menu'}
                    type="button"
                    onClick={(event) => this.handleMenu(event)}></button>
                  <Popover
                    id={'mobile-menu'}
                    className="attach-menu-container"
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    onClose={() => this.handleCloseMenu()}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}>
                    <div className="menu-options">
                      {window.screen.width < 1145 && (
                        <>
                          <div className="menu-option">
                            <label htmlFor="file-mobile" className="menu-item">
                              <img src={require('../images/attach/камера1.png')} />
                              Камера
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={(event) => this.onAddFile(event)}
                              hidden
                            />
                          </div>
                          <div className="menu-option">
                            <label htmlFor="file-mobile" className="menu-item">
                              <img src={require('../images/attach/камера1.png')} />
                              Фото/видео
                            </label>
                            <input
                              id="photo-mobile"
                              type="file"
                              accept="image/*,video/*"
                              onChange={(event) => this.onAddFile(event)}
                              hidden
                            />
                          </div>
                        </>
                      )}
                      <div className="menu-option">
                        <label htmlFor="file-mobile" className="menu-item">
                          <img src={require('../images/attach/документ1.png')} />
                          Документ
                        </label>
                        <input
                          id="file-mobile"
                          type="file"
                          onChange={(event) => this.onAddFile(event)}
                          hidden
                          multiple
                        />
                      </div>
                      <div
                        className="menu-option"
                        onClick={() => console.log('Not supported yet!')}>
                        <label
                          className="menu-item"
                          style={{ color: '#7c7a7a', cursor: 'not-allowed' }}>
                          <img src={require('../images/attach/3д из каталога1.png')} />
                          3D из каталога
                        </label>
                      </div>
                      <div className="menu-option" onClick={this.handlerDisplayType}>
                        <label className="menu-item">
                          <img src={require('../images/attach/3д из ленты1.png')} />
                          3D из ленты
                        </label>
                      </div>
                      <div
                        className="menu-option"
                        id="common"
                        onClick={(event) => this.handlerOpenQuickAnswers(event)}>
                        <label className="menu-item">
                          <img src={require('../images/attach/быстрые ответы1.png')} />
                          Быстрые ответы
                          <img src={require('../images/next.png')}></img>
                        </label>
                      </div>
                    </div>
                  </Popover>
                  <Popover
                    id={'quick-answer--menu'}
                    className="quick-answer-menu--container"
                    open={this.state.showQuickAnswers}
                    anchorEl={this.state.showQuickAnswers}
                    onClose={() => this.handleCloseQuickAnswer()}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}>
                    <div className="menu-options">
                      <div
                        className="menu-option"
                        id="common"
                        onClick={(e) => this.handlerSetTemplateMessage(e.target.parentElement.id)}>
                        <label className="menu-item">
                          <img src={require('../images/attach/быстрые ответы1.png')} />
                          Шаблон (Общий)
                        </label>
                      </div>
                      <div
                        className="menu-option"
                        id="cost"
                        onClick={(e) => this.handlerSetTemplateMessage(e.target.parentElement.id)}>
                        <label className="menu-item">
                          <img src={require('../images/attach/быстрые ответы1.png')} />
                          Шаблон (Стоимость)
                        </label>
                      </div>
                    </div>
                  </Popover>
                </div>
                <TextareaAutosize
                  placeholder="Текст сообщения"
                  maxRows={4}
                  onChange={(event) => this.UpdateMessageInputValue(event)}
                  value={this.state.message.text}
                  onKeyDown={this.keyDown}
                />
                <DownloadLayer />
                {/* <textarea
                rows="1"
                className="areaText"
                ref={this.resizeText}
                placeholder="Текст сообщения"
              /> */}
                {/* <input
                autoComplete="off"
                id="value-text"
                type="text"
                placeholder="Текст сообщения"
                value={this.state.message.text}
                onChange={(event) => this.UpdateMessageInputValue(event)}
              /> */}
                <button
                  type="button"
                  className="voice disabled"
                  onClick={(event) => this.SendVoice(event)}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="68" height="68" viewBox="0 0 24 24"><g><rect id="top-part" x="9" y="3.5" width="6" height="12" rx="3" fill="#5A8CF6"/><animate class="micro" xlink:href="#top-part" attributeName="height" from="6" to="12" dur="400ms" begin="indefinite" fill="freeze" /><animate class="micro" id="drill" xlink:href="#top-part" attributeName="y" from="9" to="3.5" begin="indefinite" dur="400ms" fill="freeze" /></g><g stroke="#5A8CF6" fill="none"><g><circle id="baloon" cx="12" cy="12" r="6" stroke-width="1.5" stroke-dasharray="37.7" stroke-dashoffset="18.8"/><animate class="micro" xlink:href="#baloon" attributeName="stroke-dashoffset" from="0" to="18.8" dur="400ms" begin="indefinite" fill="freeze"/></g><g><rect id="leg" x="11" y="18" width="2" height="4" fill="#5A8CF6" stroke="none" transform-origin="top"/><animate class="micro" xlink:href="#leg" attributeName="height" from="0" to="4" dur="400ms" begin="indefinite"  fill="freeze" /></g></g></svg>',
                    }}
                  />
                  ;
                </button>
                <button type="submit" onClick={() => this.SendOrUpdate()}></button>
              </form>
            </div>
          ) : (
            <div></div>
          )}
          {/* <button onClick={() => this.props.onClose()}>Закрыть</button> */}
        </div>
      </>
    );
  }
}
