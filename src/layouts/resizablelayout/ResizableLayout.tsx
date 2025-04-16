import React, { useEffect, useState } from 'react';
import { Box, Paper, Button } from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { Resizable } from 're-resizable';
import '../../styles/animations.css';

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
  },

  panel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    transition: 'width 0.5s ease-in-out',
    transitionProperty: 'width',
    transitionTimingFunction: 'ease-in-out',
  },

  paper: {
    flex: 1,
    borderRadius: 0,
    overflow: 'auto',
    position: 'relative',
  },

  centerPanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  toggleButton: {
    position: 'absolute',
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

  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  const [isLeftHidden, setIsLeftHidden] = useState(false);
  const [isRightHidden, setIsRightHidden] = useState(false);

  const [leftAnimatingOut, setLeftAnimatingOut] = useState(false);
  const [rightAnimatingOut, setRightAnimatingOut] = useState(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const hideLeft = () => {
    setIsLeftHidden(true);
    setLeftAnimatingOut(true);
    setTimeout(() => {
      setLeftAnimatingOut(false);
      setShowLeft(false);
    }, 500);
  };

  const hideRight = () => {
    setIsRightHidden(true);
    setRightAnimatingOut(true);
    setTimeout(() => {
      setRightAnimatingOut(false);
      setShowRight(false);
    }, 500);
  };

  const showLeftPanel = () => setShowLeft(true);
  const showRightPanel = () => setShowRight(true);

  return (
    <Box className={classes.container}>
      {/* Left Panel */}
      {(showLeft || leftAnimatingOut) && (
        <Resizable
          defaultSize={{ width: leftPanelWidth, height: '100%' }}
          minWidth={150}
          maxWidth="75%"
          enable={leftAnimatingOut ? {} : { right: true }}
          onResizeStop={(_, __, ref) => {
            const newWidth = parseFloat(ref.style.width);
            setLeftPanelWidth(newWidth);
          }}
          className={cx(
            classes.panel,
            showLeft && !leftAnimatingOut && 'slide-in-left',
            leftAnimatingOut && 'slide-out-left'
          )}
        >
          <Paper withBorder p="md" className={classes.paper}>
            <Button
            style={{ top: 10, right: 10, position: 'absolute' }}
              variant="light"
              size="xs"
              className={cx(classes.toggleButton, classes.leftButton)}
              onClick={hideLeft}
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
          Center Panel

          {!showLeft && !leftAnimatingOut && (
            <Button
              style={{ top: 10, left: 10, position: 'absolute' }}
              size="xs"
              variant="light"
              className={cx(classes.toggleButton, classes.rightButton)}
              onClick={showLeftPanel}
            >
              ❯
            </Button>
          )}
          {!showRight && !rightAnimatingOut && (
            <Button
              style={{ top: 10, right: 10, position: 'absolute' }}
              size="xs"
              variant="defaulightlt"
              className={cx(classes.toggleButton, classes.leftButton)}
              onClick={showRightPanel}
            >
              ❮
            </Button>
          )}
        </Paper>
      </Box>

      {/* Right Panel */}
      {(showRight || rightAnimatingOut) && (
        <Resizable
          defaultSize={{ width: rightPanelWidth, height: '100%' }}
          minWidth={150}
          maxWidth="75%"
          enable={rightAnimatingOut ? {} : { left: true }}
          onResizeStop={(_, __, ref) => {
            const newWidth = parseFloat(ref.style.width);
            setRightPanelWidth(newWidth);
          }}
          className={cx(
            classes.panel,
            showRight && !rightAnimatingOut && 'slide-in-right',
            rightAnimatingOut && 'slide-out-right'
          )}
        >
          <Paper withBorder p="md" className={classes.paper}>
            <Button
              style={{ top: 10, left: 10, position: 'absolute' }}
              variant="light"
              size="xs"
              className={cx(classes.toggleButton, classes.rightButton)}
              onClick={hideRight}
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
