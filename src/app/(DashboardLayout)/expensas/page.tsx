'use client';
import { Typography, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ExpensasTable from './components/ExpensasTable';

const ExpensasPage = () => {
  return (
    <PageContainer title="Expensas" description="Gestión de expensas del condominio">
      <Box>
        <ExpensasTable />
      </Box>
    </PageContainer>
  );
};

export default ExpensasPage;
