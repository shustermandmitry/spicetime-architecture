// src/components/Folder.jsx
import React from "react";

const Folder = ({ name, spec, children }) => {
  return (
    <div className="folder">
      <h3>{name}</h3>
      <p>{spec}</p>
      <div className="folder-children">{children}</div>
    </div>
  );
};

export default Folder;