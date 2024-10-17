import React, { useState, useEffect } from 'react';
import Stories from 'react-insta-stories';
import { globalConfig } from '../configuration/config';
import Network from './Requests';
import { CircularProgress } from '@material-ui/core';

function Stor(props) {
  const [chat, setChat] = useState(props.chatGuid);
  const [stories2, setStories2] = useState([]);

  useEffect(() => {
    const readMessagesAsync = async () => {
      const unread = await new Network().GetUnreadMessagesForUser(chat, 30);
      const loadedStories = [];
      for (let i = 0; i < unread.length; i++) {
        const currentCalculation = unread[i]?.guidCalculation;
        const link = await getLinkByGuid(currentCalculation);

        loadedStories.push({
          content: ({ action }) => (
            <div className="stories-popup" style={contentStyle}>
              <div className="stories-text">{unread[i]?.content}</div>
              <iframe
                frameborder="0"
                width="700"
                height="260"
                id="view-container-iframe"
                src={link}></iframe>
            </div>
          ),
        });
      }

      setStories2(loadedStories);
    };

    readMessagesAsync();
  }, []);

  const getLinkByGuid = async (guidCalculation) => {
    const calculationInfo = await new Network().getCalculationInfo(guidCalculation);
    const sequenceData = calculationInfo?.views?.sequenceData;
    const spherePath = calculationInfo?.views?.sphere_360Path;
    let link;

    if (spherePath != 'undefined' && spherePath != null) {
      link = `${globalConfig.config.common.view}?guid=${spherePath}`;
    } else {
      const userInfo = await new Network().GetUsersInfo();
      link = `${globalConfig.config.common.view}/sequence.html?path=${sequenceData?.sequencePath}&count=${sequenceData?.sequenceCount}&first=${sequenceData?.sequenceFirst}&ext=${sequenceData?.sequenceExt}&guid=${guidCalculation}&user=${props.userGuid}&chat=${props.chatGuid}&project=${guidCalculation}&projectGuid=${props.project}&name=${userInfo?.name}`;
    }

    return link;
  };

  const contentStyle = {
    background: '#333',
    width: '100%',
    padding: 10,
    color: 'white',
    height: '100%',
  };

  return (
    <div>
      <div className="stories">
        {stories2.length > 0 ? (
          <Stories
            keyboardNavigation
            defaultInterval={8000}
            stories={stories2}
            storyContainerStyles={{ borderRadius: 8, overflow: 'hidden' }}
            width={'100%'}
            height={'100vh'}
            loader
          />
        ) : (
          <div>
            <CircularProgress className="StoriesLoad" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Stor;
