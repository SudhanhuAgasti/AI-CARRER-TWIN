import { useEffect, useState } from 'react';
import AppRoutes from './routes';
import ToastContainer from './components/common/ToastContainer';
import { useAuthStore } from './store/authStore';
import { axiosInstance } from './api/axiosInstance';
import Skeleton from './components/ui/Skeleton';

function App() {
  const { setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axiosInstance.post('/api/auth/refresh');
        if (response.data && response.data.accessToken) {
          setAuth(response.data.accessToken, response.data.user);
        }
      } catch (err) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [setAuth, clearAuth]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-6">
        <div className="space-y-6 w-full max-w-md">
          <Skeleton className="h-8 w-1/3 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
