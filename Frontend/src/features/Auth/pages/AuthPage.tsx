import { Outlet } from 'react-router';

const AuthPage = () => {
  return (
    <main className="min-h-screen">
      <Outlet />
    </main>
  );
};

export default AuthPage;
