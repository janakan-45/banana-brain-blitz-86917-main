import { useState, useEffect } from "react";
import LoginPage from "@/components/LoginPage";
import GamePage from "@/components/GamePage";
import Leaderboard from "@/components/Leaderboard";

type GameState = "login" | "playing" | "leaderboard";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("login");
  const [username, setUsername] = useState("");
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    // Check for existing user session (Virtual Identity)
    const storedUser = localStorage.getItem("banana-user");
    if (storedUser) {
      setUsername(storedUser);
      // Auto-login if user exists, but start at login screen
      // User can choose to continue or change username
    }
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    localStorage.setItem("banana-user", user);
    setGameState("playing");
  };

  const handleLogout = () => {
    localStorage.removeItem("banana-user");
    setUsername("");
    setGameState("login");
  };

  const handleGameComplete = (score: number) => {
    setFinalScore(score);
    setGameState("leaderboard");
  };

  const handlePlayAgain = () => {
    setGameState("playing");
  };

  return (
    <>
      {gameState === "login" && <LoginPage onLogin={handleLogin} />}
      {gameState === "playing" && (
        <GamePage
          username={username}
          onLogout={handleLogout}
          onGameComplete={handleGameComplete}
        />
      )}
      {gameState === "leaderboard" && (
        <Leaderboard
          currentScore={finalScore}
          username={username}
          onPlayAgain={handlePlayAgain}
          onBackToLogin={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
