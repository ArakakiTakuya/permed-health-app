import { HealthDashboardScreen } from '@/src/screens/HealthDashboardScreen';
import { LoginScreen } from '@/src/screens/LoginScreen';
import { useMobileAuth } from '@/src/hooks/useMobileAuth';

export function AuthGate() {
  const auth = useMobileAuth();

  if (auth.isAuthenticated) {
    return <HealthDashboardScreen />;
  }

  return <LoginScreen auth={auth} />;
}
