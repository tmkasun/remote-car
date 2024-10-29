import { useState } from "react";
import { useCommands } from "./CommandContext";
import { arrowButtonClass } from "./Controllers";

export const ParentalControl = () => {
  const [isParentControl, setIsParentControl] = useState(false);
  const { sendCommand, handleSpeed, handleTurn } = useCommands();

  return (
    <button
      type="button"
      onClick={() => {
        setIsParentControl(!isParentControl);
        sendCommand("parent_control", !isParentControl);
        handleSpeed(0);
        handleTurn(0);
      }}
      className={`${
        isParentControl ? "bg-yellow-200" : ""
      } ${arrowButtonClass}`}
    >
      Parent Control {isParentControl ? "ON" : "OFF"}
    </button>
  );
};
