import Sidebar from '../../components/feature/Sidebar';
import Header from '../../components/feature/Header';
import StatCard from '../../components/base/StatCard';
import Card from '../../components/base/Card';
import { dashboardStats, despesasPorCategoria, evolucaoMensal } from '../../mocks/financialData';

export default function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main mb-2">Dashboard</h1>
            <p className="text-text-muted">Visão geral da sua vida financeira</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Saldo Atual"
              value={formatCurrency(dashboardStats.saldoAtual)}
              icon="ri-wallet-3-line"
              trend={12.5}
            />
            <StatCard
              title="Receitas do Mês"
              value={formatCurrency(dashboardStats.receitasMes)}
              icon="ri-arrow-down-circle-line"
              type="success"
              trend={8.3}
            />
            <StatCard
              title="Despesas do Mês"
              value={formatCurrency(dashboardStats.despesasMes)}
              icon="ri-arrow-up-circle-line"
              type="danger"
              trend={-5.2}
            />
            <StatCard
              title="Resultado Mensal"
              value={formatCurrency(dashboardStats.resultadoMensal)}
              icon="ri-funds-line"
              type="success"
              trend={15.7}
            />
            <StatCard
              title="Patrimônio Total"
              value={formatCurrency(dashboardStats.patrimonioTotal)}
              icon="ri-building-line"
              trend={3.2}
            />
            <StatCard
              title="Investimentos"
              value={formatCurrency(dashboardStats.investimentosTotal)}
              icon="ri-line-chart-line"
              type="warning"
              trend={6.8}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-main mb-6">Despesas por Categoria</h3>
              <div className="space-y-4">
                {despesasPorCategoria.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-muted">{item.categoria}</span>
                      <span className="text-sm font-semibold text-text-main">{formatCurrency(item.valor)}</span>
                    </div>
                    <div className="w-full bg-bg-main rounded-full h-2">
                      <div
                        className="gradient-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.percentual}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-main mb-6">Receitas x Despesas</h3>
              <div className="space-y-4">
                {evolucaoMensal.slice(-6).map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-text-muted w-12">{item.mes}</span>
                    <div className="flex-1 flex gap-2">
                      <div className="flex-1 bg-bg-main rounded-full h-8 flex items-center overflow-hidden">
                        <div
                          className="bg-success h-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.receitas / 10000) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(item.receitas)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 bg-bg-main rounded-full h-8 flex items-center overflow-hidden">
                        <div
                          className="bg-danger h-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.despesas / 10000) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(item.despesas)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-text-muted">Receitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-danger rounded-full"></div>
                  <span className="text-sm text-text-muted">Despesas</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-main mb-6">Evolução do Saldo</h3>
            <div className="h-64 flex items-end gap-4">
              {evolucaoMensal.map((item, index) => {
                const resultado = item.receitas - item.despesas;
                const maxValue = 5000;
                const height = (Math.abs(resultado) / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-48">
                      <span className="text-xs text-text-muted mb-2">
                        {formatCurrency(resultado)}
                      </span>
                      <div
                        className={`w-full rounded-t-lg ${resultado >= 0 ? 'bg-success' : 'bg-danger'}`}
                        style={{ height: `${Math.min(height, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-text-muted">{item.mes}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
