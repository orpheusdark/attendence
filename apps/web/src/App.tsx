import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Shell } from './components/shell';
import { pages } from './pages';

function RoutedPage({ element }: { element: JSX.Element }) {
  return element;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={pages.login} />
        <Route
          path="/*"
          element={
            <Shell>
              <Routes>
                <Route path="/" element={<RoutedPage element={pages.admin} />} />
                <Route path="/teacher" element={<RoutedPage element={pages.teacher} />} />
                <Route path="/hod" element={<RoutedPage element={pages.hod} />} />
                <Route path="/sessions" element={<RoutedPage element={pages.sessions} />} />
                <Route path="/logs" element={<RoutedPage element={pages.logs} />} />
                <Route path="/settings" element={<RoutedPage element={pages.settings} />} />
                <Route path="/reports" element={<RoutedPage element={pages.reports} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Shell>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}