import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type TransactionType = 'receita' | 'despesa' | 'transferencia' | 'despesa-cartao';

export default function AdicionarTransacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = (location.state?.type || 'despesa') as TransactionType;

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    account: '',
    toAccount: '',
    goal: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    purpose: type === 'transferencia' ? 'transferencia' : ''
  });

  useEffect(() => {
    loadAccounts();
    loadGoals();
  }, []);

  const loadAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const loadGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Erro ao carregar objetivos:', error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'receita': return 'Nova Receita';
      case 'despesa': return 'Nova Despesa';
      case 'transferencia': return 'Nova Transferência';
      case 'despesa-cartao': return 'Nova Despesa no Cartão';
      default: return 'Nova Transação';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'receita': return 'bg-[#34C759]';
      case 'despesa': return 'bg-[#FF4D4F]';
      case 'transferencia': return 'bg-[#007AFF]';
      case 'despesa-cartao': return 'bg-[#FF9500]';
      default: return 'bg-[#34C759]';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const amount = parseFloat(formData.amount.replace(',', '.'));

      if (type === 'transferencia') {
        // Transferência entre contas
        if (formData.purpose === 'transferencia' && formData.toAccount) {
          await supabase.from('transactions').insert({
            user_id: user.id,
            description: `Transferência: ${formData.description}`,
            amount: amount,
            type: 'transfer',
            account_id: formData.account || null,
            to_account_id: formData.toAccount,
            date: formData.date,
            notes: formData.notes || null
          });
        }
        // Pagamento (Despesa)
        else if (formData.purpose === 'despesa') {
          await supabase.from('transactions').insert({
            user_id: user.id,
            description: formData.description,
            amount: amount,
            type: 'expense',
            category_id: formData.category || null,
            account_id: formData.account || null,
            date: formData.date,
            notes: formData.notes || null
          });
        }
        // Transferência para objetivo
        else if (formData.purpose === 'objetivo' && formData.goal) {
          const { data: goal } = await supabase
            .from('goals')
            .select('current_amount')
            .eq('id', formData.goal)
            .single();

          if (goal) {
            await supabase
              .from('goals')
              .update({ current_amount: goal.current_amount + amount })
              .eq('id', formData.goal);

            await supabase.from('transactions').insert({
              user_id: user.id,
              description: `Depósito em objetivo: ${formData.description}`,
              amount: amount,
              type: 'transfer',
              account_id: formData.account || null,
              goal_id: formData.goal,
              date: formData.date,
              notes: formData.notes || null
            });
          }
        }
      } else {
        const transactionType = type === 'receita' ? 'income' : 'expense';
        await supabase.from('transactions').insert({
          user_id: user.id,
          description: formData.description,
          amount: amount,
          type: transactionType,
          category_id: formData.category || null,
          account_id: formData.account || null,
          date: formData.date,
          notes: formData.notes || null
        });
      }

      navigate('/transacoes', { state: { success: true } });
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao adicionar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className={`${getColor()} text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-semibold">{getTitle()}</h1>
        </div>
      </header>

      {/* Form */}
      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Finalidade (apenas para transferência) */}
          {type === 'transferencia' && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finalidade *
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-sm cursor-pointer"
                required
              >
                <option value="transferencia">Transferência entre contas</option>
                <option value="despesa">Pagamento (Despesa)</option>
                <option value="objetivo">Transferência para objetivo</option>
              </select>
            </div>
          )}

          {/* Descrição */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Salário, Aluguel, Compras..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm"
            />
          </div>

          {/* Valor */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                R$
              </span>
              <input
                type="text"
                required
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9,]/g, '');
                  setFormData({ ...formData, amount: value });
                }}
                placeholder="0,00"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm"
              />
            </div>
          </div>

          {/* Categoria (não mostrar para transferência entre contas) */}
          {(type !== 'transferencia' || formData.purpose === 'despesa') && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm cursor-pointer"
              >
                <option value="">Selecione uma categoria</option>
                <option value="1">Alimentação</option>
                <option value="2">Transporte</option>
                <option value="3">Moradia</option>
                <option value="4">Saúde</option>
                <option value="5">Educação</option>
                <option value="6">Lazer</option>
                <option value="7">Salário</option>
                <option value="8">Investimentos</option>
              </select>
            </div>
          )}

          {/* Conta de Origem */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'transferencia' ? 'Conta de Origem' : 'Conta'}
            </label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm cursor-pointer"
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          {/* Conta de Destino (apenas para transferência entre contas) */}
          {type === 'transferencia' && formData.purpose === 'transferencia' && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conta de Destino *
              </label>
              <select
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-sm cursor-pointer"
                required
              >
                <option value="">Selecione uma conta</option>
                {accounts.filter(acc => acc.id !== formData.account).map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Objetivo (apenas para transferência para objetivo) */}
          {type === 'transferencia' && formData.purpose === 'objetivo' && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo *
              </label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] text-sm cursor-pointer"
                required
              >
                <option value="">Selecione um objetivo</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.icon} {goal.name} - R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Data */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm cursor-pointer"
            />
          </div>

          {/* Observações */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Adicione observações (opcional)"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm resize-none"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formData.notes.length}/500
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 ${getColor()} text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap ${
                loading ? 'opacity-50' : ''
              }`}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
