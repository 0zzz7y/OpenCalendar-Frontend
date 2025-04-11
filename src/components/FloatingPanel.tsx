import React from 'react';
import { Rnd } from 'react-rnd';

interface FloatingPanelProps {
  children: React.ReactNode;
  defaultWidth: number | string;
  defaultHeight: number | string;
  defaultX: number;
  defaultY: number;
  bounds?: string | HTMLElement;
  dragGrid?: [number, number];
  resizeGrid?: [number, number];
  disableDragging?: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  children,
  defaultWidth,
  defaultHeight,
  defaultX,
  defaultY,
  bounds = 'parent',
  dragGrid = [10, 10],
  resizeGrid = [10, 10],
  disableDragging = false,
}) => {
  return (
    <Rnd
      default={{
        width: defaultWidth,
        height: defaultHeight,
        x: defaultX,
        y: defaultY,
      }}
      bounds={bounds}
      dragGrid={dragGrid}
      resizeGrid={resizeGrid}
      disableDragging={disableDragging}
    >
      {children}
    </Rnd>
  );
};

export default FloatingPanel;
