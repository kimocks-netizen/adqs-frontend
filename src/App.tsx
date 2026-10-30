import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Providers } from '@/providers/Providers';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';

import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import InsightsPage from '@/pages/InsightsPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import DisclaimerPage from '@/pages/DisclaimerPage';
import NotFoundPage from '@/pages/NotFoundPage';

import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ArticlesPage from '@/pages/admin/ArticlesPage';
import ArticleEditorPage from '@/pages/admin/ArticleEditorPage';
import EnquiriesPage from '@/pages/admin/EnquiriesPage';

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/services/:slug', element: <ServiceDetailPage /> },
      { path: '/insights', element: <InsightsPage /> },
      { path: '/insights/:slug', element: <ArticleDetailPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/disclaimer', element: <DisclaimerPage /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/articles', element: <ArticlesPage /> },
          { path: '/admin/articles/new', element: <ArticleEditorPage /> },
          { path: '/admin/articles/:id/edit', element: <ArticleEditorPage /> },
          { path: '/admin/enquiries', element: <EnquiriesPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
