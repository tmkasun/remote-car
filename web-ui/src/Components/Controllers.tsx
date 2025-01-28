import { useRef } from "react";
import { ParentalControl } from "./ParentalControl";
import { FullScreenWidget } from "./FullScreenWidget";
import { useCommands } from "./CommandContext";

export const MAX_TURNING_TIME = 1000;

const commonStyle =
  "border dark:border-blue-500 border-blue-700 rounded-xl flex items-center justify-center";
export const arrowButtonClass =
  "text-blue-700 w-full h-full hover:text-white flex items-center justify-center  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800";

export const arrowSVGSize = "w-16 h-16";

export const isFullScreen = () => {
  return Boolean(window.document.fullscreenElement);
};
export const Controllers = ({
  handleSpeed,
  isMobileOrTablet,
  handleTurn,
}: {
  handleSpeed: (speed: number, isForward?: boolean) => void;
  handleTurn: (direction: number) => void;
  isMobileOrTablet: boolean;
}) => {
  const turningTimeOut = useRef<NodeJS.Timeout | null>(null);
  const { sendCommand } = useCommands();

  return (
    <div className="grid grid-cols-3 gap-1 px-0 py-0  ">
      <div className={commonStyle}>
        <ParentalControl />
      </div>
      <div className={commonStyle}>
        <button
          type="button"
          onTouchStart={(e) => {
            // Forward
            handleSpeed(1, true);
          }}
          onTouchEnd={(e) => {
            handleSpeed(0);
          }}
          onMouseDown={(e) => {
            if (isMobileOrTablet) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            handleSpeed(1, true);
          }}
          onMouseUp={(e) => {
            if (isMobileOrTablet) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            handleSpeed(0);
          }}
          className={arrowButtonClass}
        >
          {/* Forward */}
          <svg
            className={`${arrowSVGSize} text-gray-800`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v13m0-13 4 4m-4-4-4 4"
            />
          </svg>
        </button>
      </div>
      <div className={commonStyle}>
        <FullScreenWidget />
      </div>
      <div className={commonStyle}>
        <button
          type="button"
          onTouchStart={() => {
            handleTurn(1);
            if (turningTimeOut.current) {
              clearTimeout(turningTimeOut.current);
            }
            turningTimeOut.current = setTimeout(() => {
              handleTurn(0);
            }, MAX_TURNING_TIME);
          }}
          onTouchEnd={() => {
            handleTurn(0);
          }}
          onMouseDown={() => {
            if (isMobileOrTablet) {
              return;
            }
            handleTurn(1);
          }}
          onMouseUp={() => {
            if (isMobileOrTablet) {
              return;
            }
            handleTurn(0);
          }}
          className={arrowButtonClass}
        >
          <svg
            className={`${arrowSVGSize} text-gray-800`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M5 12l4-4m-4 4 4 4"
            />
          </svg>
        </button>
      </div>
      <div
        className={`border dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 ${commonStyle} `}
      >
        <button
          type="button"
          onClick={() => {
            handleSpeed(0);
          }}
        >
          <svg
            className={`${arrowSVGSize} text-red-800`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className={commonStyle}>
        {" "}
        <button
          onTouchStart={() => {
            handleTurn(-1);
            if (turningTimeOut.current) {
              clearTimeout(turningTimeOut.current);
            }
            turningTimeOut.current = setTimeout(() => {
              handleTurn(0);
            }, MAX_TURNING_TIME);
          }}
          onTouchEnd={() => {
            handleTurn(0);
          }}
          onMouseDown={() => {
            if (isMobileOrTablet) {
              return;
            }
            handleTurn(-1);
          }}
          onMouseUp={() => {
            if (isMobileOrTablet) {
              return;
            }
            handleTurn(0);
          }}
          type="button"
          className={arrowButtonClass}
        >
          <svg
            className={`${arrowSVGSize} text-gray-800`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5m14 0-4 4m4-4-4-4"
            />
          </svg>
        </button>
      </div>
      <div className={commonStyle}>
        <button
          type="button"
          onClick={() => {
            sendCommand("honk", true);
            handleSpeed(0);
            handleTurn(0);
          }}
        >
          Honk
        </button>
      </div>
      <div className={commonStyle}>
        <button
          type="button"
          onTouchStart={(e) => {
            // backward
            handleSpeed(1, false);
          }}
          onTouchEnd={(e) => {
            handleSpeed(0);
          }}
          onMouseDown={(e) => {
            if (isMobileOrTablet) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            handleSpeed(1, false);
            // setIsBackward(false);
          }}
          onMouseUp={(e) => {
            if (isMobileOrTablet) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            handleSpeed(0);
          }}
          className={arrowButtonClass}
        >
          {/* Backward */}
          <svg
            className={`${arrowSVGSize} text-gray-800`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>
        </button>
      </div>
      <div
      //   className={commonStyle}
      >
        {/* Reserved */}
      </div>
    </div>
  );
};
