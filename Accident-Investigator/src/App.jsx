import { useEffect } from "react";
import { initGame } from "./game";

function App() {
  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div id="game-container"></div>
    </div>
  );
}

export default App;
