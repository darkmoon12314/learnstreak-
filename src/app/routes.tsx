import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { LessonViewer } from './pages/LessonViewer';
import { Leaderboard } from './pages/Leaderboard';
import { Certificates } from './pages/Certificates';
import { Profile } from './pages/Profile';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'courses',
        element: <Courses />
      },
      {
        path: 'course/:courseId',
        element: <CourseDetail />
      },
      {
        path: 'course/:courseId/lesson/:moduleId/:lessonId',
        element: <LessonViewer />
      },
      {
        path: 'leaderboard',
        element: <Leaderboard />
      },
      {
        path: 'certificates',
        element: <Certificates />
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);
