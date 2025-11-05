import { Outlet } from 'react-router-dom';
import ReportsLayout from '../../layouts/ReportsLayout';

const ReportsPage = () => {

  return (
    <ReportsLayout>
      <Outlet />
    </ReportsLayout>
  );
};

export default ReportsPage;
