import { Navigate, useRoutes } from 'react-router-dom';
import { Guest, Protected } from '../middleware'
import NotFound from '../views/home/NotFound';
import Home from '../views/home/HomePages'
import Login from '../views/Auth/Login'
import Register from '../views/Auth/Register'
import Profile from '../views/Auth/Profile'
import Jabatan from '../views/home/Jabatan/jabatan'
import Karyawan from '../views/home/Karyawan/karyawan'
import Kehadiran from '../views/home/Kehadiran/kehadiran'
import Gaji from '../views/home/Gaji/gaji'
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
        { path: 'karyawan', element: <Karyawan /> },
        { path: 'kehadiran', element: <Kehadiran /> },
        { path: 'gaji', element: <Gaji /> },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
}