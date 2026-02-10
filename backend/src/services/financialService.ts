import type { User, Car, SimulationResult } from '../types';
import { GamificationLevel } from '../types';

export const calculateFinancialService = async (serviceType: string, user: User): Promise<SimulationResult> => {
  const scoreMultiplier = user.gamification.level === GamificationLevel.Platinum ? 0.8 : 1.0;

  switch (serviceType) {
    case 'financing': {
      const loanAmount = 30000;
      const rate = 1.49 * scoreMultiplier;
      const months = 48;
      const installment = (loanAmount * (1 + (rate / 100) * months)) / months;

      return {
        title: 'Simulação de Financiamento',
        details: [
          { label: 'Valor Simulado', value: 'R$ 30.000,00' },
          { label: 'Taxa de Juros', value: `${rate.toFixed(2)}% a.m.` },
          { label: 'Prazo', value: `${months} meses` },
          {
            label: 'Parcela Mensal',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(installment),
          },
        ],
        disclaimer: 'Taxas personalizadas baseadas no seu perfil de crédito e nível no app.',
      };
    }

    case 'consortium': {
      const letterCredit = 50000;
      const adminFee = 15;
      const duration = 60;
      const monthlyConsortium = (letterCredit * (1 + adminFee / 100)) / duration;

      return {
        title: 'Simulação de Consórcio',
        details: [
          {
            label: 'Carta de Crédito',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(letterCredit),
          },
          { label: 'Taxa de Administração', value: `${adminFee}% (Total)` },
          { label: 'Prazo', value: `${duration} meses` },
          {
            label: 'Parcela Estimada',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyConsortium),
          },
        ],
        disclaimer: 'Valores sujeitos a reajuste anual.',
      };
    }

    case 'equity': {
      const equityValue = 20000;
      const equityRate = 1.99 * scoreMultiplier;

      return {
        title: 'Car Equity (Empréstimo com Garantia)',
        details: [
          {
            label: 'Crédito Disponível',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(equityValue),
          },
          { label: 'Veículo Garantia', value: 'Até 90% da FIPE' },
          { label: 'Taxa de Juros', value: `${equityRate.toFixed(2)}% a.m.` },
          { label: 'Liberação', value: 'Em até 24h' },
        ],
        disclaimer: 'Requer veículo quitado e em bom estado.',
      };
    }

    case 'insurance': {
      const insuranceValue = 2500 * scoreMultiplier;

      return {
        title: 'Cotação de Seguro Auto',
        details: [
          { label: 'Cobertura', value: 'Compreensiva (Roubo/Colisão)' },
          { label: 'Assistência 24h', value: 'Guincho ilimitado' },
          { label: 'Carro Reserva', value: '7 dias' },
          {
            label: 'Valor Anual',
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insuranceValue),
          },
          { label: 'Franquia', value: 'R$ 2.800,00' },
        ],
        disclaimer: 'Cotação baseada no perfil simplificado.',
      };
    }

    default:
      throw new Error('Serviço desconhecido');
  }
};

export const checkVehicleStatus = async (
  type: 'fines' | 'ipva' | 'insurance_status',
  car: Car
): Promise<SimulationResult> => {
  const hasIssues = car.year < 2020 && Math.random() > 0.7;

  if (type === 'fines') {
    return {
      title: 'Situação de Multas',
      details: hasIssues
        ? [
            { label: 'Infração', value: 'Excesso de velocidade' },
            { label: 'Data', value: '15/01/2025' },
            { label: 'Valor', value: 'R$ 195,23' },
            { label: 'Pontos', value: '5' },
          ]
        : [
            { label: 'Status', value: 'Nada consta' },
            { label: 'Última atualização', value: 'Hoje' },
          ],
      disclaimer: 'Dados consultados no DETRAN.',
    };
  }

  if (type === 'ipva') {
    const ipvaValue = 2500;
    return {
      title: 'IPVA 2025',
      details: [
        { label: 'Status', value: 'Em aberto' },
        {
          label: 'Valor Integral',
          value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ipvaValue),
        },
        { label: 'Vencimento 1ª Parcela', value: '15/03/2025' },
      ],
      disclaimer: 'Aproveite 5% de desconto na cota única.',
    };
  }

  if (type === 'insurance_status') {
    return {
      title: 'Seguro Atual',
      details: [
        { label: 'Seguradora', value: 'Auto Genius Seguros' },
        { label: 'Vigência', value: 'Até 12/2025' },
        { label: 'Status', value: 'Ativo' },
        { label: 'Apólice', value: '8374.2938.1029' },
      ],
      disclaimer: 'Cobertura completa ativa.',
    };
  }

  return { title: 'Erro', details: [], disclaimer: '' };
};
