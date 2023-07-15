import { Navigate, useRoutes } from 'react-router-dom';
import { Guest, Protected } from '../middleware'
import NotFound from '../views/home/NotFound';
import Home from '../views/home/HomePages'
import Login from '../views/Auth/Login'
import Register from '../views/Auth/Register'
import Profile from '../views/home/Profile'

export default function Web() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Guest><Login /></Guest>,
    },
    {
      path: 'login',
      element: <Guest><Login /></Guest>,
    },
    {
      path: 'register',
      element: <Guest><Register /></Guest>,
    },
    {
      path: '/home',
      element: <Protected><Home /></Protected>,
    },
    {
      path: '/home/profile',
      element: <Protected><Profile /></Protected>,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
}