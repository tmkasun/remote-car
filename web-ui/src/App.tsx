import React, { useEffect, useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Footer from "./Components/Footer";
import { Configs } from "./Components/Configs";
import { Controllers } from "./Components/Controllers";
import { CommandsProvider } from "./Components/CommandContext";

const WSEndpoint = "192.168.4.1" || window.location.host;
const mobileAndTabletCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || (window as any).opera);
  return check;
};

function App() {
  const [isForward, setIsForward] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [turning, setTurning] = useState(0);
  const [wsMessage, setWSMessage] = useState("Connecting . . .");
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const isMobileOrTablet = useMemo(mobileAndTabletCheck, []);
  const connectWS = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setIsConnecting(true);
    let ws = new WebSocket("ws://" + WSEndpoint + "/connect-websocket");
    ws.onopen = () => {
      setWSMessage("Connected to WS Server");
      setIsConnected(true);
      setIsConnecting(false);
    };
    ws.onclose = () => {
      setWSMessage("Disconnect from WS Server");
      setIsConnected(false);
      setIsConnecting(false);
    };
    ws.onmessage = (event) => setWSMessage(event.data);
    ws.onerror = (error) => {
      setWSMessage(`Error connecting to WS Server ${error}`);
      setIsConnected(false);
      setIsConnecting(false);
    };

    wsRef.current = ws;
  };
  useEffect(() => {
    connectWS();
    return () => wsRef?.current?.close();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      console.log(`${e.code} down`);

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
        console.log(e.code);
      }
    };

    const handleKeyUp = (e: any) => {
      console.log(`${e.code} up`);

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)
      ) {
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  const handleSpeed = (
    currentSpeed: number,
    nextIsBackward: boolean | null = null
  ) => {
    setSpeed(currentSpeed);
    const adjustedSpeed = currentSpeed === 0 ? 0 : 0.5 + currentSpeed * 0.5;

    if (nextIsBackward !== null) {
      setIsForward(nextIsBackward);
    } else {
      nextIsBackward = isForward;
    }
    wsRef.current?.send(
      `${nextIsBackward ? adjustedSpeed : adjustedSpeed * -1}#${turning}`
    );
  };
  const handleTurn = (currentTurning: number) => {
    setTurning(currentTurning);
    const adjustedTurning =
      currentTurning === 0
        ? 0
        : currentTurning < 0
        ? -0.5 + currentTurning * 0.5
        : 0.5 + currentTurning * 0.5;
    wsRef.current?.send(`-2#${adjustedTurning}`); // -2 is for speed, Because we are not changing the speed
  };
  return (
    <div className="flex-1 flex flex-col justify-start items-stretch mx-1 mt-2">
      <main className="flex flex-col flex-1  items-center">
        <div
          className={`flex w-full items-center justify-center  ${
            isConnected ? "text-teal-600" : "text-red-600"
          }`}
        >
          <button
            className={`text-white w-full flex flex-1 justify-center items-center gap-3  focus:ring-4 ${
              isConnected
                ? "focus:ring-green-300 bg-green-700 hover:bg-green-800"
                : "focus:ring-blue-300 bg-blue-700 hover:bg-blue-800"
            } font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2focus:outline-none `}
            onClick={() => {
              if (isConnected) {
                wsRef.current?.close();
              } else {
                connectWS();
              }
            }}
          >
            {isConnecting
              ? "Connecting ..."
              : isConnected
              ? "Connected"
              : "Connect"}
            {isConnected && (
              <svg
                className="w-6 h-6 text-teal-500  dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
          </button>
          <Configs />
        </div>
        <div className="flex">
          <button
            className=""
            onClick={() => {
              if (isForward) {
                setIsForward(!isForward);
              }
            }}
          >
            <svg
              className={`w-36 h-36  ${
                !isForward ? "text-teal-500" : "text-gray-600"
              } `}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m17 16-4-4 4-4m-6 8-4-4 4-4"
              />
            </svg>
          </button>
          <button
            className=""
            onClick={() => {
              if (!isForward) {
                setIsForward(!isForward);
              }
            }}
          >
            <svg
              className={`w-36 h-36  ${
                isForward ? "text-teal-500" : "text-gray-600"
              } `}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m7 16 4-4-4-4m6 8 4-4-4-4"
              />
            </svg>
          </button>
        </div>
        <CommandsProvider
          value={{
            wsRef: wsRef.current,
            handleSpeed: handleSpeed,
            handleTurn: handleTurn,
          }}
        >
          <Controllers
            isMobileOrTablet={isMobileOrTablet}
            handleTurn={handleTurn}
            handleSpeed={handleSpeed}
          />
        </CommandsProvider>
        <div className="flex gap-12 flex-col w-full">
          <label className="w-full flex flex-1 ">
            <input
              className="flex flex-1 h-6"
              value={speed}
              type="range"
              min={0}
              max={1}
              step={0.1}
              onChange={(e) => {
                const currentSpeed = parseFloat(e.target.value);
                handleSpeed(currentSpeed);
              }}
            />
            Speed {isForward ? speed.toFixed(2) : (speed * -1).toFixed(2)}
          </label>

          <label className="w-full flex flex-1 ">
            <input
              className="flex flex-1"
              value={turning}
              type="range"
              min={-1}
              max={1}
              step={0.1}
              onChange={(e) => handleTurn(parseFloat(e.target.value))}
            />
            Turn {turning.toFixed(2)}
          </label>
        </div>
        <Footer>
          <div>{wsMessage}</div>
        </Footer>
      </main>
    </div>
  );
}

export default App;
