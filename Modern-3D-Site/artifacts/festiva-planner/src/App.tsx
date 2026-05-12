import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Setup from "@/pages/Setup";
import Result from "@/pages/Result";
import VendorExplorer from "@/pages/VendorExplorer";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const [location, setLocation] = useLocation();
  const isAuthenticated = localStorage.getItem('festiva_auth') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <Component {...rest} />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        
        {/* Protected Routes */}
        <Route path="/dashboard">
          {(params) => <ProtectedRoute component={Dashboard} {...params} />}
        </Route>
        <Route path="/setup">
          {(params) => <ProtectedRoute component={Setup} {...params} />}
        </Route>
        <Route path="/plan/:id">
          {(params) => <ProtectedRoute component={Result} {...params} />}
        </Route>
        <Route path="/vendors">
          {(params) => <ProtectedRoute component={VendorExplorer} {...params} />}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
