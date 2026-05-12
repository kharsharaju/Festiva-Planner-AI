import { Component, useEffect, useState, type ReactNode } from "react";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

interface State {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene unavailable:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return <>{this.props.children}</>;
  }
}

const FALLBACK = (
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,209,192,0.15),transparent_60%),radial-gradient(circle_at_70%_60%,rgba(233,181,71,0.15),transparent_60%),radial-gradient(circle_at_50%_90%,rgba(229,89,52,0.1),transparent_60%)]" />
);

export function SafeCanvas({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  if (supported === null) return null;
  if (!supported) return <>{fallback ?? FALLBACK}</>;

  return (
    <CanvasErrorBoundary fallback={fallback ?? FALLBACK}>{children}</CanvasErrorBoundary>
  );
}
