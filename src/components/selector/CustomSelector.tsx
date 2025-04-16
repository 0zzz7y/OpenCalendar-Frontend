import React from "react";
import { Select, SelectProps } from "@mantine/core";
import styles from "./CustomSelector.module.css";

const CustomSelector = (props: SelectProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.animatedBorder} />
      <Select
        {...props}
        classNames={{ input: styles.selectInput }}
        variant="filled"
        radius="md"
      />
    </div>
  );
};

export default CustomSelector;
