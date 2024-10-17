import React, { useState, useEffect } from "react";

const AttachedFile = (props) => {
  const [file, setFile] = useState(props.attachedFile);

  const getPreview = () => {
    return file.type.substr(0, file.type.indexOf("/")) === "image"
      ? URL.createObjectURL(file)
      : require("../images/file.png");
  };

  const removeHandler = (ind) => {
    console.log("Inner index ",  ind);
    props.removeAttachment(ind);
  }

  return (
    <div className="attached-file-container">
        <button id="close-att" className="close-attach" onClick={() => removeHandler(props.index)}><img src={require("../images/remove.png")}/></button>
        <img className="attached-file-image" src={getPreview()} alt={file.name} />
        <p className="filename">{file.name}</p>
    </div>
  );
};

export default AttachedFile;
