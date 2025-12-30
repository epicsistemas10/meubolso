import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function Transacoes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    loadTransactions();
  }, [user, filter]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', filter)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-[#34C759] text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Transações</h1>
          <button
            onClick={() => navigate('/transacao/adicionar')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">Receitas</p>
            <p className="text-sm font-semibold whitespace-nowrap">{formatCurrency(getTotalIncome())}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">Despesas</p>
            <p className="text-sm font-semibold whitespace-nowrap">{formatCurrency(getTotalExpense())}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-xs text-white/80 mb-1">Saldo</p>
            <p className="text-sm font-semibold whitespace-nowrap">{formatCurrency(getBalance())}</p>
          </div>
        </div>
      </header>

      {/* Filtro Toggle */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-full p-1 shadow-sm flex items-center">
          <button
            onClick={() => setFilter('expense')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'expense'
                ? 'bg-[#FF4D4F] text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              filter === 'income'
                ? 'bg-[#34C759] text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="px-5 pb-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#34C759] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-file-list-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhuma transação encontrada</p>
            <button
              onClick={() => navigate('/transacao/adicionar')}
              className="px-6 py-2 bg-[#34C759] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-[#34C759]/10' : 'bg-[#FF4D4F]/10'
                  }`}>
                    <i className={`text-2xl w-6 h-6 flex items-center justify-center ${
                      transaction.type === 'income'
                        ? 'ri-arrow-down-line text-[#34C759]'
                        : 'ri-arrow-up-line text-[#FF4D4F]'
                    }`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-[#34C759]' : 'text-[#FF4D4F]'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
