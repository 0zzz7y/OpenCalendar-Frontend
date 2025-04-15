import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface ResizableComponentProperties {
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizableComponent({
  children,
  defaultWidth = 240,
  minWidth = 150,
  maxWidth = 400,
}: ResizableComponentProperties) {
  return (
    <ResizableBox
      width={defaultWidth}
      height={Infinity}
      axis="x"
      resizeHandles={["e"]}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, 0]}
      handle={
        <span
          style={{
            width: 6,
            backgroundColor: "transparent",
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            cursor: "ew-resize",
            zIndex: 10,
          }}
        />
      }
    >
      {children}
    </ResizableBox>
  );
}
