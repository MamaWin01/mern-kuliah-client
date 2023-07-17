import { Navigate, useRoutes } from 'react-router-dom';
import { Guest, Protected } from '../middleware'
import NotFound from '../views/home/NotFound';
import Home from '../views/home/HomePages'
import Login from '../views/Auth/Login'
import Register from '../views/Auth/Register'
import Profile from '../views/Auth/Profile'
import Jabatan from '../views/home/Jabatan/jabatan'
import Layout from '../views/layout/MainPages'

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
      element: <Protected><Layout /></Protected>,
      children: [
        { element: <Home />, index: true },
        { path: 'profile', element: <Profile /> },
        { path: 'jabatan', element: <Jabatan /> },
        { path: 'jabatan/edit/id', element: <Jabatan /> },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
}