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
      // Optionally you could add event handlers here to persist layout changes.
    >
      {/* Wrap the panel content in a Box with a visible border */}
      <div style={{
        width: '100%',
        height: '100%',
        border: '2px dashed rgba(0,0,0,0.2)',
        backgroundColor: 'white',
        boxSizing: 'border-box',
      }}>
        {children}
      </div>
    </Rnd>
  );
};

export default FloatingPanel;
