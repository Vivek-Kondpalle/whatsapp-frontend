import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';
import { ReactNode, useEffect, useState } from 'react';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';
import { UserInfo } from './types/get-user-info.type';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  console.log(' isAuthenticated in Private ', isAuthenticated);
  return isAuthenticated ? children : <Navigate to={'/auth'} />;
};

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  console.log(' isAuthenticated in auth route ', isAuthenticated);
  return isAuthenticated ? <Navigate to={'/chat'} /> : children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get<UserInfo>(GET_USER_INFO, { withCredentials: true });

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [setUserInfo, userInfo]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
