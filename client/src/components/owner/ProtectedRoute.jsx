import { Navigate } from 'react-router-dom';
import { useOwnerAuth } from '../../features/owner-auth/OwnerAuthContext.jsx';
import LoadingSkeleton from '../common/LoadingSkeleton.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkingSession } = useOwnerAuth();

  if (checkingSession) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }

  return children;
}
