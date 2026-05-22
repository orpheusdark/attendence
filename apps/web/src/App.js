import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Shell } from './components/shell';
import { pages } from './pages';
function RoutedPage({ element }) {
    return element;
}
export default function App() {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/login", element: pages.login }), _jsx(Route, { path: "/*", element: _jsx(Shell, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(RoutedPage, { element: pages.admin }) }), _jsx(Route, { path: "/teacher", element: _jsx(RoutedPage, { element: pages.teacher }) }), _jsx(Route, { path: "/hod", element: _jsx(RoutedPage, { element: pages.hod }) }), _jsx(Route, { path: "/sessions", element: _jsx(RoutedPage, { element: pages.sessions }) }), _jsx(Route, { path: "/logs", element: _jsx(RoutedPage, { element: pages.logs }) }), _jsx(Route, { path: "/settings", element: _jsx(RoutedPage, { element: pages.settings }) }), _jsx(Route, { path: "/reports", element: _jsx(RoutedPage, { element: pages.reports }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) })] }, location.pathname) }));
}
