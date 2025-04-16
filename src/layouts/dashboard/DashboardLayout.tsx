import React, { useEffect, useState } from "react";
import { Box, Paper, Button } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { Resizable } from "re-resizable";
import "../../styles/animations.css";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },

  panel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
    transition: "width 0.5s ease-in-out",
    transitionProperty: "width",
    transitionTimingFunction: "ease-in-out",
  },

  paper: {
    flex: 1,
    borderRadius: 0,
    overflow: "auto",
    overflowX: "hidden",
    position: "relative",
  },

  centerPanel: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  toggleButton: {
    position: "absolute",
    top: 10,
    zIndex: 10,
  },

  leftButton: {
    right: -45,
  },

  rightButton: {
    left: -45,
  },
}));

export const ResizableLayout = () => {
  const { classes, cx } = useStyles();

  const [isLeftShown, setIsLeftShown] = useState(true);
  const [isRightShown, setIsRightShown] = useState(true);

  const [isShowLeftPanelButtonShown, setIsShowLeftPanelButtonShown] = useState(false);
  const [isShowRightPanelButtonShown, setIsShowRightPanelButtonShown] = useState(false);

  const [leftAnimatingOut, setLeftAnimatingOut] = useState(false);
  const [rightAnimatingOut, setRightAnimatingOut] = useState(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(350);

  const hideLeftPanel = () => {
    setLeftAnimatingOut(true);
    setTimeout(() => {
      setIsLeftShown(false);
      setIsShowLeftPanelButtonShown(true);
      setLeftAnimatingOut(false);
    }, 500); // dopasowane do czasu trwania animacji
  };
  
  const showLeftPanel = () => {
    setIsLeftShown(true);
    setIsShowLeftPanelButtonShown(false);
  };

  const hideRightPanel = () => {
    setRightAnimatingOut(true);
    setTimeout(() => {
      setIsRightShown(false);
      setIsShowRightPanelButtonShown(true);
      setRightAnimatingOut(false);
    }, 500);
  };
  
  const showRightPanel = () => {
    setIsRightShown(true);
    setIsShowRightPanelButtonShown(false);
  };
  
  return (
    <Box className={classes.container}>
      {/* Left Panel */}
      {(isLeftShown || leftAnimatingOut) && (
        <Resizable
          defaultSize={{ width: leftPanelWidth, height: "100%" }}
          minWidth={150}
          maxWidth="75%"
          enable={leftAnimatingOut ? {} : { right: true }}
          onResizeStop={(_, __, ref) => {
            const newWidth = parseFloat(ref.style.width);
            setLeftPanelWidth(newWidth);
          }}
          className={cx(
            classes.panel,
            isLeftShown && !leftAnimatingOut && "slide-in-left",
            leftAnimatingOut && "slide-out-left",
          )}
        >
          <Paper withBorder p="md" className={classes.paper}>
          <Button
  style={{
    position: "absolute",
    top: "50%",
    right: -12,
    transform: "translateY(-50%)",
    zIndex: 10,
  }}
  variant="light"
  size="xs"
  onClick={hideLeftPanel}
>
  ❮
</Button>

            Left Panel
          </Paper>
        </Resizable>
      )}

      {/* Center Panel */}
      <Box className={classes.centerPanel}>
        <Paper withBorder p="md" className={classes.paper}>
          {!isLeftShown && isShowLeftPanelButtonShown && (
            <Button
              variant="light"
              size="xs"
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                zIndex: 10,
              }}
              onClick={showLeftPanel}
            >
              ❮
            </Button>
          )}
          {!isRightShown && isShowRightPanelButtonShown && (
            <Button
              variant="light"
              size="xs"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
              }}
              onClick={showRightPanel}
            >
              ❯
            </Button>
          )}
          Center Panel
        </Paper>
      </Box>

      {/* Right Panel */}
      {(isRightShown || rightAnimatingOut) && (
        <Resizable
          defaultSize={{ width: rightPanelWidth, height: "100%" }}
          minWidth={150}
          maxWidth="75%"
          enable={rightAnimatingOut ? {} : { left: true }}
          onResizeStop={(_, __, ref) => {
            const newWidth = parseFloat(ref.style.width);
            setRightPanelWidth(newWidth);
          }}
          className={cx(
            classes.panel,
            isRightShown && !rightAnimatingOut && "slide-in-right",
            rightAnimatingOut && "slide-out-right",
          )}
        >
          <Paper withBorder p="md" className={classes.paper}>
          <Button
  style={{
    position: "absolute",
    top: "50%",
    left: -12,
    transform: "translateY(-50%)",
    zIndex: 10,
  }}
  variant="light"
  size="xs"
  onClick={hideRightPanel} // ← poprawka!
>
  ❯
</Button>

            Right Panel
          </Paper>
        </Resizable>
      )}
    </Box>
  );
};
