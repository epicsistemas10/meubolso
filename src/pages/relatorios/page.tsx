import { useState } from 'react';
import BottomNav from '../../components/feature/BottomNav';

export default function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState('mensal');

  const reports = [
    {
      id: 1,
      title: 'Receitas vs Despesas',
      description: 'Comparativo mensal de entradas e saídas',
      icon: 'ri-exchange-line',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Despesas por Categoria',
      description: 'Análise detalhada dos gastos',
      icon: 'ri-pie-chart-line',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Evolução do Saldo',
      description: 'Histórico de saldo ao longo do tempo',
      icon: 'ri-line-chart-line',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      title: 'Metas e Planejamento',
      description: 'Acompanhamento de objetivos',
      icon: 'ri-target-line',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      title: 'Investimentos',
      description: 'Performance da carteira',
      icon: 'ri-stock-line',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 6,
      title: 'Patrimônio',
      description: 'Evolução patrimonial',
      icon: 'ri-building-line',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const summaryData = {
    totalIncome: 12500,
    totalExpenses: 8750,
    balance: 3750,
    savingsRate: 30
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="gradient-header text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <img 
            src="https://static.readdy.ai/image/32e34e04a919b9271ef3ff4f79b7fd86/739492c7d57166e7909ba9a7593d80a6.png" 
            alt="Meu Bolso" 
            className="h-10 w-auto"
          />
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-notification-3-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <h1 className="text-lg font-semibold mb-6">Relatórios</h1>

        {/* Period Selector */}
        <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setSelectedPeriod('mensal')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedPeriod === 'mensal'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setSelectedPeriod('trimestral')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedPeriod === 'trimestral'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Trimestral
          </button>
          <button
            onClick={() => setSelectedPeriod('anual')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              selectedPeriod === 'anual'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="ri-arrow-up-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <span className="text-xs text-gray-500 font-medium">Receitas</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              R$ {summaryData.totalIncome.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="ri-arrow-down-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <span className="text-xs text-gray-500 font-medium">Despesas</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              R$ {summaryData.totalExpenses.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="ri-wallet-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <span className="text-xs text-gray-500 font-medium">Saldo</span>
            </div>
            <div className="text-xl font-bold text-[#34C759]">
              R$ {summaryData.balance.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="ri-percent-line text-white text-base w-5 h-5 flex items-center justify-center"></i>
              </div>
              <span className="text-xs text-gray-500 font-medium">Taxa de Economia</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {summaryData.savingsRate}%
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Relatórios Disponíveis</h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <button
                key={report.id}
                className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <i className={`${report.icon} text-white text-2xl w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 text-base">{report.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{report.description}</div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-xl w-6 h-6 flex items-center justify-center"></i>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Exportar Relatórios</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-md">
              <i className="ri-file-pdf-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-sm">PDF</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-md">
              <i className="ri-file-excel-line text-lg w-5 h-5 flex items-center justify-center"></i>
              <span className="text-sm">Excel</span>
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
