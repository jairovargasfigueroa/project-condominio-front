"use client";
import PageContainer from '../components/container/PageContainer';
import GuardiasTable from './components/GuardiasTable';

export default function GuardiasPage() {
  return (
    <PageContainer title="Guardias" description="Gestión de guardias del condominio">
      <GuardiasTable />
    </PageContainer>
  );
}
