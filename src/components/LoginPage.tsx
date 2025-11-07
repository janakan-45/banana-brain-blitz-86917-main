import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, LogIn, Mail, Lock, User, Sparkles, Zap, Heart, Star, Crown, Gem } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { toast } = useToast();
  const controls = useAnimation();

  useEffect(() => {
    const animateBackground = async () => {
      await controls.start({
        background: [
          "linear-gradient(45deg, #fef3c7, #fde68a, #f59e0b)",
          "linear-gradient(135deg, #fef3c7, #fbbf24, #d97706)",
          "linear-gradient(225deg, #fef3c7, #fde68a, #f59e0b)",
          "linear-gradient(315deg, #fef3c7, #fbbf24, #d97706)",
        ],
        transition: {
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    };
    animateBackground();
  }, [controls]);

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/banana/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        toast({
          title: "🎉 Welcome back!",
          description: `Logged in as ${data.username}`,
          className: "bg-gradient-to-r from-green-400 to-green-600 text-white",
        });
        onLogin(data.username);
      } else {
        toast({
          title: "Login failed",
          description: data.detail || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "Unable to connect to the server. Please check if the backend server is running and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Register data before sending:", {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      confirm_password: registerData.confirmPassword,
    });

    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields, including Confirm Password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/banana/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          confirm_password: registerData.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        toast({
          title: "🎉 Account created!",
          description: `Welcome, ${data.username}!`,
          className: "bg-gradient-to-r from-green-400 to-green-600 text-white",
        });
        onLogin(data.username);
      } else {
        toast({
          title: "Registration failed",
          description:
            data.detail?.username?.[0] ||
            data.detail?.email?.[0] ||
            data.detail?.password?.[0] ||
            data.detail?.confirm_password?.[0] ||
            data.detail ||
            "Please check your input",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Error",
        description: "Unable to connect to the server. Please check if the backend server is running and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-sm"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-orange-400/30 to-red-400/30 rounded-full blur-sm"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
            scale: [1.2, 0.8, 1.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-red-400/30 to-pink-400/30 rounded-full blur-sm"
          animate={{
            y: [0, -15, 0],
            x: [0, 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-yellow-300/30 to-yellow-500/30 rounded-full blur-sm"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-300/40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${5 + (i % 3) * 25}%`,
            }}
            animate={{
              rotate: [0, 180, 360],
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            <Star className="w-4 h-4" />
          </motion.div>
        ))}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-400/50"
            style={{
              left: `${15 + i * 8}%`,
              top: `${15 + (i % 2) * 15}%`,
            }}
            animate={{
              rotate: [0, 180, 360],
              scale: [0.3, 1, 0.3],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-3 h-3" />
          </motion.div>
        ))}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-yellow-300/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-orange-300/20 rounded-full"
          animate={{
            rotate: [360, 0],
            scale: [1.2, 0.8, 1.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <Particles
        id="tsparticles"
        url="https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js"
        options={{
          particles: {
            number: { value: 50 },
            shape: { type: "circle" },
            size: { value: { min: 10, max: 20 } },
            move: { enable: true, speed: 2 },
            opacity: { value: 0.6 },
          },
        }}
        className="absolute inset-0"
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md p-4 sm:p-8 shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl border border-yellow-300 mx-2">
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🍌
            </motion.div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              Banana Cha...
            </h1>
          </motion.div>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-yellow-100/50 rounded-xl p-1">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value="login" asChild>
                <motion.form
                  onSubmit={handleLogin}
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="login-username" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: loginData.username ? [0, -10, 10, 0] : 0,
                          color: loginData.username ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-4 h-4" />
                      </motion.div>
                      Username
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "login-username" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Your username"
                        value={loginData.username}
                        onChange={(e) => {
                          setLoginData({ ...loginData, username: e.target.value });
                          console.log("Username input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("login-username")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: loginData.username ? [0, 2, 0] : 0,
                          color: loginData.username ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <User className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="login-password" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: loginData.password ? [0, -10, 10, 0] : 0,
                          color: loginData.password ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                      Password
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "login-password" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData({ ...loginData, password: e.target.value });
                          console.log("Password input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("login-password")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: loginData.password ? [0, 2, 0] : 0,
                          color: loginData.password ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      background: isLoading
                        ? ["linear-gradient(to right, #fbbf24, #f59e0b)", "linear-gradient(to right, #f59e0b, #fbbf24)"]
                        : "linear-gradient(to right, #fbbf24, #f59e0b)",
                    }}
                    transition={{ duration: 2, repeat: isLoading ? Infinity : 0 }}
                  >
                    <Button
                      type="submit"
                      className="w-full text-lg py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Zap className="w-5 h-5" />
                          Logging in...
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-2"
                        >
                          Login & Play 🚀
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
              <TabsContent value="register" asChild>
                <motion.form
                  onSubmit={handleRegister}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="register-username" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: registerData.username ? [0, -10, 10, 0] : 0,
                          color: registerData.username ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-4 h-4" />
                      </motion.div>
                      Username
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "register-username" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, username: e.target.value });
                          console.log("Username input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("register-username")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: registerData.username ? [0, 2, 0] : 0,
                          color: registerData.username ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <User className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="register-email" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: registerData.email ? [0, -10, 10, 0] : 0,
                          color: registerData.email ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Mail className="w-4 h-4" />
                      </motion.div>
                      Email
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "register-email" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, email: e.target.value });
                          console.log("Email input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("register-email")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: registerData.email ? [0, 2, 0] : 0,
                          color: registerData.email ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Mail className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="register-password" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: registerData.password ? [0, -10, 10, 0] : 0,
                          color: registerData.password ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                      Password
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "register-password" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, password: e.target.value });
                          console.log("Password input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("register-password")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: registerData.password ? [0, 2, 0] : 0,
                          color: registerData.password ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-2 flex items-center gap-2 text-gray-700">
                      <motion.div
                        animate={{
                          rotate: registerData.confirmPassword ? [0, -10, 10, 0] : 0,
                          color: registerData.confirmPassword ? "#f59e0b" : "#d97706",
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                      Confirm Password
                    </label>
                    <motion.div
                      className="relative"
                      animate={{
                        boxShadow: focusedField === "confirm-password" ? "0 0 20px rgba(245, 158, 11, 0.5)" : "0 0 0px rgba(245, 158, 11, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => {
                          setRegisterData({ ...registerData, confirmPassword: e.target.value });
                          console.log("Confirm Password input:", e.target.value);
                        }}
                        onFocus={() => setFocusedField("confirm-password")}
                        onBlur={() => setFocusedField(null)}
                        className="border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 shadow-sm hover:shadow-md hover:border-yellow-400 pl-10"
                      />
                      <motion.div
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center"
                        animate={{
                          x: registerData.confirmPassword ? [0, 2, 0] : 0,
                          color: registerData.confirmPassword ? "#f59e0b" : "#d1d5db",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Lock className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      background: isLoading
                        ? ["linear-gradient(to right, #f97316, #ef4444)", "linear-gradient(to right, #ef4444, #f97316)"]
                        : "linear-gradient(to right, #f97316, #ef4444)",
                    }}
                    transition={{ duration: 2, repeat: isLoading ? Infinity : 0 }}
                  >
                    <Button
                      type="submit"
                      className="w-full text-lg py-6 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/50"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="flex items-center gap-2"
                        >
                          <Zap className="w-5 h-5" />
                          Creating...
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-2"
                        >
                          Create Account & Play 🚀
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
          <motion.div
            className="mt-6 text-center text-sm text-gray-600 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>✨ Event-driven gameplay with real-time scoring</p>
            <p>🔐 Secure authentication with JWT</p>
            <p>🔗 Powered by Banana API</p>
            <p className="text-xs text-gray-500 mt-2">
              💡 Make sure the backend server is running on {apiBaseUrl}
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
