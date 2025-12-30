import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

type GoalStatus = 'active' | 'paused' | 'completed';

export default function ObjetivosPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [processingDeposit, setProcessingDeposit] = useState(false);

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*, accounts!goals_savings_account_id_fkey(name, balance)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao carregar objetivos:', error);
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

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getMonthsRemaining = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 1);
  };

  const calculateMonthlySavings = (remaining: number, deadline: string) => {
    const months = getMonthsRemaining(deadline);
    return remaining / months;
  };

  const getGoalStatus = (goal: any): GoalStatus => {
    if (goal.status) return goal.status;
    if (goal.current_amount >= goal.target_amount) return 'completed';
    return 'active';
  };

  const handleGoalClick = (goal: any) => {
    setSelectedGoal(goal);
    setShowActionModal(true);
  };

  const handleAddDeposit = () => {
    setShowActionModal(false);
    setShowDepositModal(true);
  };

  const handleCompleteGoal = async () => {
    if (!selectedGoal) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({ status: 'completed' })
        .eq('id', selectedGoal.id);

      if (error) throw error;
      
      setShowActionModal(false);
      loadGoals();
    } catch (error) {
      console.error('Erro ao concluir objetivo:', error);
      alert('Erro ao concluir objetivo');
    }
  };

  const handlePauseGoal = async () => {
    if (!selectedGoal) return;

    try {
      const currentStatus = getGoalStatus(selectedGoal);
      const newStatus = currentStatus === 'paused' ? 'active' : 'paused';

      const { error } = await supabase
        .from('goals')
        .update({ status: newStatus })
        .eq('id', selectedGoal.id);

      if (error) throw error;
      
      setShowActionModal(false);
      loadGoals();
    } catch (error) {
      console.error('Erro ao pausar/reativar objetivo:', error);
      alert('Erro ao atualizar objetivo');
    }
  };

  const handleEditGoal = () => {
    setShowActionModal(false);
    navigate('/objetivos/editar', { state: { goal: selectedGoal } });
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount) return;

    setProcessingDeposit(true);

    try {
      const amount = parseFloat(depositAmount);
      
      // Atualizar saldo da conta poupança
      const { error: accountError } = await supabase
        .from('accounts')
        .update({ 
          balance: selectedGoal.accounts.balance + amount 
        })
        .eq('id', selectedGoal.savings_account_id);

      if (accountError) throw accountError;

      // Criar transação
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          account_id: selectedGoal.savings_account_id,
          type: 'income',
          amount: amount,
          description: `Depósito no objetivo: ${selectedGoal.name}`,
          date: new Date().toISOString().split('T')[0]
        }]);

      if (transactionError) throw transactionError;

      // Atualizar valor atual do objetivo
      const { error: goalError } = await supabase
        .from('goals')
        .update({ 
          current_amount: selectedGoal.current_amount + amount 
        })
        .eq('id', selectedGoal.id);

      if (goalError) throw goalError;

      setShowDepositModal(false);
      setDepositAmount('');
      loadGoals();
    } catch (error) {
      console.error('Erro ao adicionar depósito:', error);
      alert('Erro ao adicionar depósito');
    } finally {
      setProcessingDeposit(false);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'all') return true;
    return getGoalStatus(goal) === filterStatus;
  });

  const statusCounts = {
    all: goals.length,
    active: goals.filter(g => getGoalStatus(g) === 'active').length,
    paused: goals.filter(g => getGoalStatus(g) === 'paused').length,
    completed: goals.filter(g => getGoalStatus(g) === 'completed').length
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FF2D55] to-[#D91E47] text-white px-5 pt-12 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-right-circle-line text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold">Objetivos</h1>
          </div>
          <button
            onClick={() => navigate('/objetivos/adicionar')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <p className="text-sm text-white/80 mb-4">
          Defina e acompanhe seus objetivos financeiros
        </p>

        {/* Filtros de Status */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-[#FF2D55]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Todos ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-white text-[#FF2D55]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Ativos ({statusCounts.active})
          </button>
          <button
            onClick={() => setFilterStatus('paused')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'paused'
                ? 'bg-white text-[#FF2D55]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Pausados ({statusCounts.paused})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-white text-[#FF2D55]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Alcançados ({statusCounts.completed})
          </button>
        </div>
      </header>

      {/* Lista de Objetivos */}
      <div className="px-5 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#FF2D55] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-arrow-right-circle-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all' 
                ? 'Nenhum objetivo cadastrado'
                : `Nenhum objetivo ${filterStatus === 'active' ? 'ativo' : filterStatus === 'paused' ? 'pausado' : 'alcançado'}`
              }
            </p>
            <button
              onClick={() => navigate('/objetivos/adicionar')}
              className="px-6 py-2 bg-[#FF2D55] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Criar Primeiro Objetivo
            </button>
          </div>
        ) : (
          <>
            {filteredGoals.map((goal) => {
              const progress = getProgress(goal.current_amount, goal.target_amount);
              const remaining = goal.target_amount - goal.current_amount;
              const daysLeft = getDaysRemaining(goal.deadline);
              const monthlySavings = calculateMonthlySavings(remaining, goal.deadline);
              const status = getGoalStatus(goal);

              return (
                <div 
                  key={goal.id} 
                  onClick={() => handleGoalClick(goal)}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                    status === 'paused' ? 'opacity-60' : ''
                  }`}
                >
                  {/* Header do Card */}
                  <div className={`bg-gradient-to-br ${goal.color} p-4 text-white relative`}>
                    {/* Badge de Status */}
                    {status === 'completed' && (
                      <div className="absolute top-3 right-3 bg-white/90 text-[#34C759] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                        Alcançado
                      </div>
                    )}
                    {status === 'paused' && (
                      <div className="absolute top-3 right-3 bg-white/90 text-[#FF9500] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <i className="ri-pause-line w-4 h-4 flex items-center justify-center"></i>
                        Pausado
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <i className={`${goal.icon} text-2xl w-6 h-6 flex items-center justify-center`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{goal.name}</h3>
                        <p className="text-xs text-white/80">
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
                        </p>
                      </div>
                    </div>

                    {/* Progresso */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{formatCurrency(goal.current_amount)}</span>
                        <span>{formatCurrency(goal.target_amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-white/90">
                      {progress.toFixed(0)}% concluído
                    </p>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Falta</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(remaining)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Prazo</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Mensal */}
                    {status === 'active' && remaining > 0 && (
                      <div className="bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-xl p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <i className="ri-calendar-line text-[#007AFF] w-5 h-5 flex items-center justify-center"></i>
                            <span className="text-xs text-gray-600">Poupar por mês</span>
                          </div>
                          <span className="text-sm font-bold text-[#007AFF]">
                            {formatCurrency(monthlySavings)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Porquinho */}
                    {goal.accounts && (
                      <div className="bg-[#34C759]/10 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#34C759]/20 rounded-full flex items-center justify-center">
                          <i className="ri-piggy-bank-line text-lg text-[#34C759] w-5 h-5 flex items-center justify-center"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600">Porquinho</p>
                          <p className="text-sm font-semibold text-gray-900">{goal.accounts.name}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-xl text-gray-400 w-6 h-6 flex items-center justify-center"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Card Adicionar */}
            <button
              onClick={() => navigate('/objetivos/adicionar')}
              className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-dashed border-gray-200"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-add-line text-2xl text-gray-400 w-6 h-6 flex items-center justify-center"></i>
                </div>
                <p className="text-gray-600 font-medium">Criar Novo Objetivo</p>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Modal de Ações */}
      {showActionModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-t-3xl w-full max-w-lg animate-slide-up">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedGoal.color} rounded-full flex items-center justify-center text-white`}>
                  <i className={`${selectedGoal.icon} text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{selectedGoal.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(selectedGoal.current_amount)} de {formatCurrency(selectedGoal.target_amount)}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                {getGoalStatus(selectedGoal) !== 'completed' && (
                  <>
                    <button
                      onClick={handleAddDeposit}
                      className="w-full bg-[#34C759] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <i className="ri-add-circle-line text-xl w-6 h-6 flex items-center justify-center"></i>
                      Adicionar Depósito
                    </button>

                    <button
                      onClick={handleCompleteGoal}
                      className="w-full bg-[#007AFF] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <i className="ri-check-line text-xl w-6 h-6 flex items-center justify-center"></i>
                      Concluir Objetivo
                    </button>

                    <button
                      onClick={handlePauseGoal}
                      className="w-full bg-[#FF9500] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <i className={`${getGoalStatus(selectedGoal) === 'paused' ? 'ri-play-line' : 'ri-pause-line'} text-xl w-6 h-6 flex items-center justify-center`}></i>
                      {getGoalStatus(selectedGoal) === 'paused' ? 'Reativar' : 'Pausar'} Objetivo
                    </button>
                  </>
                )}

                <button
                  onClick={handleEditGoal}
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <i className="ri-edit-line text-xl w-6 h-6 flex items-center justify-center"></i>
                  Editar Objetivo
                </button>

                <button
                  onClick={() => setShowActionModal(false)}
                  className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Depósito */}
      {showDepositModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Adicionar Depósito</h3>
            <p className="text-sm text-gray-600 mb-6">
              Deposite no objetivo: {selectedGoal.name}
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Depósito
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#34C759] focus:border-transparent outline-none transition-all text-sm"
                    placeholder="0,00"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processingDeposit}
                  className="flex-1 bg-[#34C759] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {processingDeposit ? 'Processando...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
