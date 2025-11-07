import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award, Home, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardProps {
  currentScore: number;
  username: string;
  onPlayAgain: () => void;
  onBackToLogin: () => void;
}

interface LeaderboardEntry {
  username: string;
  score: number;
}

const Leaderboard = ({ currentScore, username, onPlayAgain, onBackToLogin }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_BASE_API || "http://localhost:8000";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No access token found. Please log in again.");

        // ✅ Include Bearer token in Authorization header
        const response = await fetch(`${apiBaseUrl}/banana/leaderboard/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }

        if (!response.ok) {
          throw new Error("Could not fetch leaderboard data from the server.");
        }

        const data: LeaderboardEntry[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from leaderboard API.");
        }

        setLeaderboard(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
          title: "API Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [apiBaseUrl, toast]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>;
    }
  };

  const userRank = leaderboard.findIndex((entry) => entry.username === username) + 1;

  const getRankEmoji = () => {
    if (userRank === 1) return "🏆";
    if (userRank === 2) return "🥈";
    if (userRank === 3) return "🥉";
    return "🎉";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl p-8 shadow-xl animate-slide-in">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">{getRankEmoji()}</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Game Over!
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Great job, <span className="font-bold text-foreground">{username}</span>!
          </p>
          <div className="inline-block gradient-primary text-primary-foreground px-6 py-3 rounded-full text-2xl font-bold shadow-glow mb-2">
            Your Score: {currentScore}
          </div>
          {userRank > 0 && (
            <p className="text-lg text-muted-foreground">
              You are ranked #{userRank} on the leaderboard!
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Top 10 Players
          </h2>
          <div className="space-y-2">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading scores...</p>
            ) : leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    entry.username === username
                      ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-muted hover:bg-card"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankIcon(index)}
                    <span className="font-semibold text-lg">{entry.username}</span>
                  </div>
                  <span className="text-xl font-bold">{entry.score}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No leaderboard data found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={onPlayAgain}
            className="gradient-primary hover:scale-105 transition-transform shadow-glow text-lg py-6"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="hover:scale-105 transition-transform text-lg py-6"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
