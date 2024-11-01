import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import steeringWheel from "../images/steering.png";
import gasPedal from "../images/gas.png";

export const FullScreenWidget = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [xCoordinate, setXCoordinate] = useState<number | null>(0);
  const [yCoordinate, setYCoordinate] = useState<number | null>(0);
  const [isPressingGas, setIsPressingGas] = useState(false);
  const debugCoordinatesDiv = useRef<HTMLDivElement | null>(null);
  function handleOrientation(event: DeviceOrientationEvent) {
    if (debugCoordinatesDiv.current) {
      debugCoordinatesDiv.current.textContent = "Running";
    }
    let x = event.beta; // In degree in the range [-180,180)
    let y = event.gamma; // In degree in the range [-90,90)
    if (debugCoordinatesDiv.current) {
      debugCoordinatesDiv.current.textContent += `beta: ${x}\n`;
      debugCoordinatesDiv.current.textContent += `gamma: ${y}\n`;
    }
    if (x !== null && y !== null) {
      //   output.textContent = `beta: ${x}\n`;
      //   output.textContent += `gamma: ${y}\n`;

      // Because we don't want to have the device upside down
      // We constrain the x value to the range [-90,90]
      if (x > 90) {
        x = 90;
      }
      if (x < -90) {
        x = -90;
      }

      // To make computation easier we shift the range of
      // x and y to [0,180]
      x += 90;
      y += 90;

      setXCoordinate(x);
      setYCoordinate(y);

      // 10 is half the size of the ball
      // It centers the positioning point to the center of the ball
      // ball.style.left = `${(maxY * y) / 180 - 10}px`; // rotating device around the y axis moves the ball horizontally
      // ball.style.top = `${(maxX * x) / 180 - 10}px`; // rotating device around the x axis moves the ball vertically
    }
  }
  useLayoutEffect(() => {
    // Check if deviceorientation listener is already added
    window.addEventListener("deviceorientation", handleOrientation);
    // alert("Orientation event added");
    return () => {
      //   alert("Orientation event removed");
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);
  const clickHandler = async () => {
    setIsOpen(!isOpen);
    if (window.document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
          console.log("Document Exited from Full screen mode");
        })
        .catch((err) => console.error(err));
    } else {
      setIsFullScreen(true);
      window.document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    }
    // @ts-ignore
    const oppositeOrientation = window.screen.orientation.type.startsWith(
      "portrait"
    )
      ? "landscape"
      : "portrait";
    window.screen.orientation
      // @ts-ignore
      .lock(oppositeOrientation)
      .then(() => {
        console.log("Orientation locked");
      })
      .catch((error: any) => {
        console.error("Error locking orientation", error);
      });
  };
  return (
    <>
      {" "}
      <button onClick={clickHandler}>
        {isFullScreen ? "Exit Full Screen" : "Full Screen"}
      </button>
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        }  fixed w-full h-full top-0 left-0  items-center justify-center`}
      >
        <div className="absolute w-full h-full bg-white"></div>
        <div className="relative flex flex-col bg-cyan-100 w-full h-full z-50 p-4">
          {/* <div className="flex justify-between items-center pb-2">
            <p className="text-2xl font-bold">Full Screen Mode</p>
          </div> */}
          <div className="flex justify-center flex-1 items-center ">
            <div className="flex flex-1 justify-center items-center align-middle">
              <img
                style={{
                  transform: `rotate(${(xCoordinate || 0) - 90}deg)`,
                }}
                src={steeringWheel}
                alt="steering wheel"
                className="w-80 h-80"
              />
            </div>
            <img
              src={gasPedal}
              alt="gas pedal"
              className="w-24 h-32"
              style={{
                transform: `rotate(${isPressingGas ? 10 : 0}deg) scale(${
                  isPressingGas ? 0.9 : 1
                })`,
                transition: "200ms linear all",
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPressingGas(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPressingGas(false);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>
          <div className="absolute bottom-2 right-3">
            <button
              onClick={clickHandler}
              className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
