import React from "react";

interface IFlex {
  children?: any;
  className?: string;
  alignItems?: string;
  flexDirection?: string;
  justifyContent?: string;
  mobileFlex?: boolean;
}

const Flex: React.FC<IFlex> = ({
  children,
  className = "",
  alignItems,
  justifyContent,
  mobileFlex = true,
  flexDirection = "row",
}) => {
  const getFlexResponsive = () => (mobileFlex ? "d-flex" : "d-md-flex");
  return (
    <div
      className={`${getFlexResponsive()} ${className} ${
        flexDirection ? "flex-" + flexDirection : ""
      } ${alignItems ? "align-items-" + alignItems : ""} ${
        justifyContent ? "justify-content-" + justifyContent : ""
      }`}
    >
      {children}
    </div>
  );
};
export default Flex;
