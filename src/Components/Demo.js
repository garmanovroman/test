import React from 'react';
import Network from '../Components/Requests';
import { globalConfig } from '../configuration/config';

class ReactAnimateImages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.props.count,
      ext: this.props.ext,
      first: this.props.first,
      img: this.props.img,
      guid: this.props.guid,
      userInfo: {},
      chat: this.props.chat,
      userGuid: props?.user,
      companyId: null,
      timestamp: this.props?.timestamp,
    };
  }

  async componentDidMount() {
    const userInfo = await new Network().GetUsersInfo();
    const companyId = JSON.parse(localStorage.getItem('company'))?.id;

    this.setState({
      userInfo: userInfo,
      companyId: companyId,
    });

    const types = localStorage.getItem('types');
  }

  componentDidUpdate = async (prevProps) => {
    if (
      prevProps.current.timestamp !== this.props.current.timestamp ||
      prevProps.img !== this.props.img
    ) {
      this.setState({
        count: this.props.count,
        ext: this.props.ext,
        first: this.props.first,
        img: this.props.img,
        guid: this.props.guid,
        chat: this.props.chat,
        timestamp: this.props?.timestamp,
      });
    }
  };

  render() {
    return (
      <>
        {this.state.img?.length > 0 && (
          <iframe
            allowfullscreen
            frameborder="0"
            width="700"
            onLoad={this.props.loadFrame}
            height="260"
            id="view-container-iframe"
            src={`${globalConfig.config.common.view}/sequence.html?path=${this.state.img}&count=${this.state.count}&first=${this.state.first}&ext=${this.state.ext}&guid=${this.state.guid}&user=${this.state.userGuid}&chat=${this.props.chat}&project=${this.props.variant}&projectGuid=${this.props.projectGuid}&companyId=${this.state.companyId}&timestamp=${this.state.timestamp}&name=${this.state.userInfo.name}`}></iframe>
        )}
      </>
    );
  }
}

export default ReactAnimateImages;
