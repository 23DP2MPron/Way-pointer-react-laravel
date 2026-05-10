import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Countries from './pages/Countries';
import CountryDetails from './pages/CountryDetails';
import Cities from './pages/Cities';
import CityDetails from './pages/CityDetails';
import PlaceDetails from './pages/PlaceDetails';
import ExternalPlaceDetails from './pages/ExternalPlaceDetails';
import RouteDetails from './pages/RouteDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyRoutes from './pages/MyRoutes';
import CreateRoute from './pages/CreateRoute';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AttractionSearch from './pages/AttractionSearch';
import APITest from './pages/APITest';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePlaces from './pages/admin/ManagePlaces';
import ManageInstitutions from './pages/admin/ManageInstitutions';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageReviews from './pages/admin/ManageReviews';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/countries" element={<Countries />} />
        <Route path="/countries/:code" element={<CountryDetails />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/cities/:id" element={<CityDetails />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
        <Route path="/places/external/:xid" element={<ExternalPlaceDetails />} />
        <Route path="/routes/:id" element={<RouteDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attraction-search" element={<AttractionSearch />} />
        <Route path="/api-test" element={<APITest />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-routes" element={<PrivateRoute><MyRoutes /></PrivateRoute>} />
        <Route path="/routes/create" element={<PrivateRoute><CreateRoute /></PrivateRoute>} />
        <Route path="/routes/:id/edit" element={<PrivateRoute><CreateRoute /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/places" element={<AdminRoute><ManagePlaces /></AdminRoute>} />
        <Route path="/admin/institutions" element={<AdminRoute><ManageInstitutions /></AdminRoute>} />
        <Route path="/admin/routes" element={<AdminRoute><ManageRoutes /></AdminRoute>} />
        <Route path="/admin/reviews" element={<AdminRoute><ManageReviews /></AdminRoute>} />
      </Route>
    </Routes>
  );
}