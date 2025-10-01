"use client";
import PageContainer from '../components/container/PageContainer';
import AreasComunesTable from './components/AreasComunesTable';

export default function AreasComunesPage() {
  return (
    <PageContainer title="Areas Comunes" description="Gestión de areas comunes del condominio">
      <AreasComunesTable />
    </PageContainer>
  );
}
