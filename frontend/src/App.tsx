import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Checking authentication...
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/todos" replace /> : children;
};

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login"
                            element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            }
                        />
                        <Route path="/register"
                            element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            }
                        />


                        <Route
                            path="/todos"
                            element={
                                <ProtectedRoute>
                                    <TodoList />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
