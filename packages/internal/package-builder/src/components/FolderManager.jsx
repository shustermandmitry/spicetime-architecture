// src/components/FolderManager.jsx
import React from "react";
import Folder from "./Folder";

const FolderManager = ({ spec }) => {
  return (
    <Folder name="Root" spec={spec}>
      {/* Add folder and file structure interactively */}
    </Folder>
  );
};

export default FolderManager;