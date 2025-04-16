import React from "react";
import CustomSelector from "../../components/selector/CustomSelector";
import styles from "./LeftPanel.module.css";

const LeftPanel = () => {
  return (
      <>
      <CustomSelector
        label="Choose option"
        placeholder="Select one"
        data={["Option 1", "Option 2", "Option 3"]}
      />
    </>
  );
};

export default LeftPanel;
