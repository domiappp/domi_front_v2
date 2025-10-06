import React from 'react'
import LayoutServices from '../../features/services/LayoutServices';
import BusinessHoursEditor from '../../shared/components/HorariosComponent';

const DashboardPage: React.FC = () => {



  return (
    <>
      <LayoutServices />

      <BusinessHoursEditor />
    </>
  )
}

export default DashboardPage