'use client';
import { Typography, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CopropietariosTable from './components/CopropietariosTable';

const CopropietariosPage = () => {
  return (
    <PageContainer title="Copropietarios" description="Gestión de copropietarios">
      <DashboardCard title="Copropietarios">
        <Box>
          <Typography>Gestión de copropietarios del condominio</Typography>
          <CopropietariosTable />
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default CopropietariosPage;
