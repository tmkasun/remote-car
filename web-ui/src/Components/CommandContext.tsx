import React, { createContext } from "react";

const commandContext = createContext<{
  sendCommand: (command: string, value: string | boolean) => void;
  handleSpeed: (speed: number, isForward?: boolean) => void;
  handleTurn: (direction: number) => void;
}>({
  sendCommand: (command: string, value: string | boolean) => {},
  handleSpeed: (speed: number, isForward?: boolean) => {},
  handleTurn: (direction: number) => {},
});

const CommandsProvider = ({
  children,
  value: { wsRef, handleSpeed, handleTurn },
}: {
  children: React.ReactNode;
  value: {
    wsRef: WebSocket | null;
    handleSpeed: (speed: number, isForward?: boolean) => void;
    handleTurn: (direction: number) => void;
  };
}) => {
  const sendCommand = (command: string, value: string | boolean) => {
    if (wsRef) {
      console.log(`Sending command ${command} with value ${value}`);
      wsRef.send(`${command}#${value}`);
    }
  };
  return (
    <commandContext.Provider value={{ sendCommand, handleSpeed, handleTurn }}>
      {children}
    </commandContext.Provider>
  );
};

const useCommands = () => {
  return React.useContext(commandContext);
};

export { CommandsProvider, commandContext, useCommands };
