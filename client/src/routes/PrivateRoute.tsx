import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = observer(({ children, isAuth }: { children: ReactNode, isAuth: boolean }) => {
  const location = useLocation()
  return isAuth ? children : <Navigate to="/login" state={{ from: location }} />
})

export default PrivateRoute