import * as React from "react";

const ICON = `M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z`;

const pinStyle = {
  fill: "#d00",
  stroke: "none",
};

function Pin(props) {
  const { size = 50 } = props;

  return (
    <svg height={size} viewBox="-4 0 36 36" style={pinStyle}>
      <path d={ICON} />
      <circle
        xmlns="http://www.w3.org/2000/svg"
        id="Oval"
        fill="#ffff99"
        fillRule="nonzero"
        stroke="#ccc"
        cx="14"
        cy="14"
        r="7"
      ></circle>
    </svg>
  );
}

export default React.memo(Pin);
