import React, { useState } from 'react';

const VideoPreview = ({ videoSrc, thumbnailSrc }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '300px', height: '200px', position: 'relative' }}>
      {isHovered ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <img
          src={thumbnailSrc}
          alt="Video Thumbnail"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default VideoPreview;
