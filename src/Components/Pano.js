import React, { PureComponent } from 'react';
import Network from '../Components/Requests';
import { globalConfig } from '../configuration/config';

import './Pano.css';

class Pano extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      img: this.props.img,
      userGuid: props?.user,
      companyId: null,
    };
  }

  getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
      return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'iOS';
    }

    return 'unknown';
  }

  async componentDidMount() {
    const companyId = JSON.parse(localStorage.getItem('company'))?.id;
    const userInfo = await new Network().GetUsersInfo();
    //variant
    if (this.getMobileOperatingSystem() == 'Android') {
      const img = await new Network().GetFileUrlInCloud(this.props.img, 4000);
      await this.setState({
        imgUrl: img,
        variantCurrent: this.props.variant.calculationGuid,
        userInfo: userInfo,
      });
    } else {
      await this.setState({
        imgUrl: this.props.img,
        variantCurrent: this.props.variant.calculationGuid,
        userInfo: userInfo,
      });
      this.setState({
        companyId: companyId,
      });
    }

    const types = localStorage.getItem('types');
    if (types == 'Graphics') {
      document.location.href = `${globalConfig.config.common.view}?guid=${this.state.imgUrl}&back=true`;
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.img !== prevProps.img) {
      if (this.getMobileOperatingSystem() == 'Android') {
        const img = await new Network().GetFileUrlInCloud(this.props.img, 4000);
        await this.setState({
          imgUrl: img,
        });
      } else {
        await this.setState({
          imgUrl: this.props.img,
        });
      }
    }
  }

  render() {
    return (
      <>
        {this.state.imgUrl !== undefined && (
          <div className="sizeContent">
            <div className="sizeContent--button" onClick={this.handleClick}></div>
            <iframe
              allowfullscreen
              frameborder="0"
              width="700"
              height="260"
              onLoad={this.props.loadFrame}
              id="view-container-iframe"
              src={`${globalConfig.config.common.view}?guid=${this.state.imgUrl}&project=${this.props.variant}&guidProject=${this.props.guid}&user=${this.state.userGuid}&chat=${this.props.chat}&companyId=${this.state.companyId}&name=${this.state?.userInfo?.name}`}></iframe>
          </div>
        )}
      </>
    );
  }
}

export default Pano;
