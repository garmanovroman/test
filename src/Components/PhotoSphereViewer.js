import React, { useEffect } from "react";
import { Viewer } from "photo-sphere-viewer";
import GyroscopePlugin from 'photo-sphere-viewer/dist/plugins/gyroscope';

export default (props) => {
  const sphereElementRef = React.createRef();
  
  useEffect(() => {
    const shperePlayerInstance = new Viewer({
      container: sphereElementRef.current,
      panorama:props.src,
      navbar: [
        'autorotate',
        'fullscreen',
        'zoom',
      ],
      plugins: [
        Viewer.GyroscopePlugin,
      ]
    });

    return () => {
      shperePlayerInstance.destroy();
    };
  }, [props]);

  return <div className="view-container" ref={sphereElementRef} />;
};