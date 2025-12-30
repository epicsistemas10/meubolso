import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function Planejamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadBudgets();
  }, [user, selectedMonth, selectedYear]);

  const location = useLocation();

  useEffect(() => {
    const s = (location.state as any)?.refreshed;
    if (s) {
      loadBudgets();
      // clear state to avoid repeated reloads
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }
  }, [location.state]);

  const loadBudgets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', selectedMonth)
        .eq('year', selectedYear)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-[#FF4D4F]';
    if (progress >= 80) return 'bg-[#FF9500]';
    return 'bg-[#34C759]';
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#5856D6] to-[#3634A3] text-white px-5 pt-8 pb-3 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Planejamento</h1>
          <button
            onClick={() => navigate('/meta/adicionar')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {/* Seletor de Mês e Ano */}
        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="flex-1 bg-white/20 text-white text-sm font-medium outline-none cursor-pointer rounded-lg px-3 py-2"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1} className="text-gray-900">{month}</option>
            ))}
          </select>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-24 bg-white/20 text-white text-sm font-medium outline-none rounded-lg px-3 py-2 text-center"
          />
        </div>
      </header>

      {/* Lista de Metas */}
      <div className="px-5 py-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {months[selectedMonth - 1]} de {selectedYear}
          </h2>
          <p className="text-sm text-gray-500">
            {budgets.length} {budgets.length === 1 ? 'meta cadastrada' : 'metas cadastradas'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#5856D6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-flag-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhuma meta cadastrada para este mês</p>
            <button
              onClick={() => navigate('/meta/adicionar')}
              className="px-6 py-2 bg-[#5856D6] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Criar Meta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const progress = getProgress(budget.spent_amount || 0, budget.planned_amount);
              const remaining = budget.planned_amount - (budget.spent_amount || 0);

              return (
                <div
                  key={budget.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Categoria Geral</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Meta mensal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(budget.spent_amount || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        de {formatCurrency(budget.planned_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-2">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(progress)} transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={remaining >= 0 ? 'text-[#34C759]' : 'text-[#FF4D4F]'}>
                      {remaining >= 0 ? 'Restam' : 'Excedeu'} {formatCurrency(Math.abs(remaining))}
                    </span>
                    <span className="text-gray-500">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
