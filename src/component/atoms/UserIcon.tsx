import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/atoms/userIcon.css";

type Props = {
  navigateTo: string;
  size: "sm" | "md" | "lg";
  src: string;
  isPointer: boolean;
  isHide?: boolean;
};

export const UserIcon: React.FC<Props> = ({
  navigateTo,
  size,
  src,
  isPointer,
  isHide = false,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(navigateTo)}
      className={`userIcon__container ${size} ${isPointer && "pointer"} ${isHide && "userIcon__container_hide"}`}
    >
      <img src={src} className="userIcon__image" alt="" />
    </div>
  );
};
