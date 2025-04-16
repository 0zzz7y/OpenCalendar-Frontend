import React from "react";

interface PlainSelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}

const PlainSelectItem = React.forwardRef<HTMLDivElement, PlainSelectItemProps>(
  ({ label, ...others }, ref) => (
    <div ref={ref} {...others}>
      {label}
    </div>
  )
);

export default PlainSelectItem;
