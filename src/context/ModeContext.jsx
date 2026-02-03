import React, { useState } from "react";

// Create the context
const ModeContext = React.createContext({
  mode: "light",
  toggleMode: () => {},
});

// Context Provider component
export const ModeContextProvider = (props) => {
  const [mode, setMode] = useState("light");

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <ModeContext.Provider value={{ mode:mode, toggleMode }}>
      {props.children}
    </ModeContext.Provider>
  );
};

export default ModeContext;
