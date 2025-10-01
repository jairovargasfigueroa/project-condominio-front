"use client";
import { Grid } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import ComunicadosTable from './components/ComunicadosTable';

const ComunicadosPage = () => {
  return (
    <PageContainer title="Comunicados" description="Gestión de comunicados del condominio">
      <Grid container spacing={3}>
        <Grid size={12}>
          <ComunicadosTable />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ComunicadosPage;