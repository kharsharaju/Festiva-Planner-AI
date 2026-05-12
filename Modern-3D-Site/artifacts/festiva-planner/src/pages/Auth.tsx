import { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [nameText, setNameText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('festiva_auth') === 'true';
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/signup";
      const body = isLogin 
        ? { email: emailText, password: passwordText }
        : { email: emailText, password: passwordText, name: nameText };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Successful auth
      localStorage.setItem('festiva_auth', 'true');
      localStorage.setItem('festiva_user', JSON.stringify(data.user || { email: emailText, name: nameText }));
      window.dispatchEvent(new Event('storage'));

      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin ? `Good to see you again, ${data.user?.name || 'planner'}!` : "Redirecting to your dashboard...",
      });

      setTimeout(() => setLocation("/dashboard"), 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Blinking animation for characters
  const blinkVariants = {
    open: { scaleY: 1 },
    closed: { scaleY: 0.1 },
  };

  const [blinkState, setBlinkState] = useState("open");

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState("closed");
      setTimeout(() => setBlinkState("open"), 150);
    }, 4000); // Blink every 4 seconds
    return () => clearInterval(blinkInterval);
  }, []);

  const eyeState = isPasswordFocused && !showPassword ? "closed" : blinkState;

  // Mouse tracking for eyes
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Translate constraints for pupils
  const pupilX = useTransform(mouseX, [-1, 1], [-2.5, 2.5]);
  const pupilY = useTransform(mouseY, [-1, 1], [-2.5, 2.5]);

  // Larger movement for solid black eyes
  const solidEyeX = useTransform(mouseX, [-1, 1], [-3.5, 3.5]);
  const solidEyeY = useTransform(mouseY, [-1, 1], [-3.5, 3.5]);

  // Body parallax constraints
  const body1X = useTransform(mouseX, [-1, 1], [-6, 6]); // Back
  const body1Y = useTransform(mouseY, [-1, 1], [-3, 3]);
  const body2X = useTransform(mouseX, [-1, 1], [-12, 12]); // Middle
  const body2Y = useTransform(mouseY, [-1, 1], [-5, 5]);
  const body3X = useTransform(mouseX, [-1, 1], [-20, 20]); // Front
  const body3Y = useTransform(mouseY, [-1, 1], [-8, 8]);

  const smoothPupilX = useSpring(pupilX, { stiffness: 300, damping: 30 });
  const smoothPupilY = useSpring(pupilY, { stiffness: 300, damping: 30 });
  const smoothSolidEyeX = useSpring(solidEyeX, { stiffness: 300, damping: 30 });
  const smoothSolidEyeY = useSpring(solidEyeY, { stiffness: 300, damping: 30 });

  const smoothBody1X = useSpring(body1X, { stiffness: 150, damping: 25 });
  const smoothBody1Y = useSpring(body1Y, { stiffness: 150, damping: 25 });
  const smoothBody2X = useSpring(body2X, { stiffness: 150, damping: 25 });
  const smoothBody2Y = useSpring(body2Y, { stiffness: 150, damping: 25 });
  const smoothBody3X = useSpring(body3X, { stiffness: 150, damping: 25 });
  const smoothBody3Y = useSpring(body3Y, { stiffness: 150, damping: 25 });

  return (
    <div className="fixed inset-0 z-[100] w-full flex bg-white text-black font-sans overflow-hidden">

      {/* Left Column - Animated Characters (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#F8F8F8] to-[#EAEAEA] items-center justify-center relative flex-col shadow-[inset_-10px_0_30px_rgba(0,0,0,0.02)]">

        {/* Subtle background particles or blobs could go here, but for now we rely on the clean gradient and larger characters */}

        {/* Animated Characters Container */}
        <div className="relative w-[400px] h-[400px] flex items-end justify-center scale-[1.3] 2xl:scale-[1.5]">

          {/* Purple Character (Back) */}
          <motion.div style={{ x: smoothBody1X, y: smoothBody1Y }} className="absolute left-[60px] bottom-[20px] z-0">
            <motion.div
              className="w-[120px] h-[240px] bg-[#8B5CF6] rounded-t-[40px] rounded-b-xl flex flex-col items-center pt-8 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.1),_0_10px_20px_rgba(139,92,246,0.3)]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex gap-4">
                <motion.div variants={blinkVariants} animate={eyeState} className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <motion.div style={{ x: smoothPupilX, y: smoothPupilY }} className="w-1.5 h-1.5 bg-black rounded-full" />
                </motion.div>
                <motion.div variants={blinkVariants} animate={eyeState} className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <motion.div style={{ x: smoothPupilX, y: smoothPupilY }} className="w-1.5 h-1.5 bg-black rounded-full" />
                </motion.div>
              </div>
              <div className="w-6 h-2 border-b-4 border-black rounded-full mt-2 opacity-80" />
            </motion.div>
          </motion.div>

          {/* Pink Character (Middle) */}
          <motion.div style={{ x: smoothBody2X, y: smoothBody2Y }} className="absolute left-[160px] bottom-[20px] z-10">
            <motion.div
              className="w-[80px] h-[180px] bg-[#EC4899] rounded-t-[30px] rounded-b-xl flex flex-col items-center pt-6 shadow-[inset_0_-8px_15px_rgba(0,0,0,0.1),_0_8px_15px_rgba(236,72,153,0.3)]"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="flex gap-2">
                <motion.div variants={blinkVariants} animate={eyeState} className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <motion.div style={{ x: smoothPupilX, y: smoothPupilY }} className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
                <motion.div variants={blinkVariants} animate={eyeState} className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <motion.div style={{ x: smoothPupilX, y: smoothPupilY }} className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Yellow Character (Middle) */}
          <motion.div style={{ x: smoothBody2X, y: smoothBody2Y }} className="absolute right-[60px] bottom-[20px] z-10">
            <motion.div
              className="w-[100px] h-[140px] bg-[#FCD34D] rounded-t-[50px] rounded-b-xl flex flex-col items-center pt-8 shadow-[inset_0_-8px_15px_rgba(0,0,0,0.05),_0_8px_15px_rgba(252,211,77,0.3)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex gap-6 relative right-2">
                <motion.div variants={blinkVariants} animate={eyeState} style={{ x: smoothSolidEyeX, y: smoothSolidEyeY }} className="w-1.5 h-1.5 bg-black rounded-full opacity-80" />
                <motion.div variants={blinkVariants} animate={eyeState} style={{ x: smoothSolidEyeX, y: smoothSolidEyeY }} className="w-1.5 h-1.5 bg-black rounded-full opacity-80" />
              </div>
              <div className="w-12 h-1 bg-black mt-3 relative right-1 opacity-80" />
            </motion.div>
          </motion.div>

          {/* Orange Character (Front) */}
          <motion.div style={{ x: smoothBody3X, y: smoothBody3Y }} className="absolute left-[30px] bottom-[20px] z-20">
            <motion.div
              className="w-[200px] h-[100px] bg-[#F97316] rounded-t-full flex flex-col items-center justify-start pt-8 shadow-[inset_0_-5px_20px_rgba(0,0,0,0.1),_0_15px_25px_rgba(249,115,22,0.2)]"
              animate={{ scaleY: [1, 1.02, 1] }}
              style={{ originY: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex gap-8 relative top-2">
                <motion.div variants={blinkVariants} animate={eyeState} style={{ x: smoothSolidEyeX, y: smoothSolidEyeY }} className="w-2.5 h-2.5 bg-black rounded-full opacity-90" />
                <motion.div variants={blinkVariants} animate={eyeState} style={{ x: smoothSolidEyeX, y: smoothSolidEyeY }} className="w-2.5 h-2.5 bg-black rounded-full opacity-90" />
              </div>
              <div className="w-8 h-4 bg-black rounded-b-full mt-2 relative top-2 opacity-90" />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative pt-24 lg:pt-32">

        {/* Back to Home Button */}
        <button
          onClick={() => setLocation("/")}
          className="absolute top-8 left-8 text-sm font-medium text-gray-400 hover:text-black transition-colors flex items-center gap-2"
        >
          ← Back to home
        </button>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 rotate-12 hover:rotate-0 transition-transform cursor-pointer shadow-lg shadow-black/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              {isLogin ? "Welcome back!" : "Create an account"}
            </h1>
            <p className="text-sm text-gray-500">
              {isLogin ? "Please enter your details" : "Join us to start planning"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    value={nameText}
                    onChange={(e) => setNameText(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-transparent transition-colors bg-transparent placeholder-gray-300 peer text-lg"
                    placeholder="John Doe"
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 peer-focus:w-full"></div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Email</label>
              <div className="relative group">
                <input
                  required
                  type="email"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-transparent transition-colors bg-transparent placeholder-gray-300 peer text-lg"
                  placeholder="name@example.com"
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 peer-focus:w-full"></div>
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Password</label>
              <div className="relative group">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={passwordText}
                  onChange={(e) => setPasswordText(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-transparent transition-colors bg-transparent pr-10 peer text-lg"
                  placeholder="••••••••"
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 peer-focus:w-full"></div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-black transition-colors font-medium">
                  <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 transition-colors" />
                  Remember me
                </label>
                <a href="#" className="text-gray-400 hover:text-black transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            <div className="pt-4 space-y-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </motion.button>

              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-black font-medium rounded-full py-4 transition-all flex items-center justify-center gap-3 active:scale-[0.98] border border-gray-200 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {isLogin ? "Log in with Google" : "Sign up with Google"}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
