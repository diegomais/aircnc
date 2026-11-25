import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/auth';
import { Navigation } from '@/navigation';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Navigation />
    </AuthProvider>
  );
}
