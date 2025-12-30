import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function AdicionarMeta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const categories = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação',
    'Lazer', 'Compras', 'Contas', 'Outros'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      if (!currentUser) throw new Error('Usuário não autenticado');

      const planned = parseFloat(String(formData.amount));
      if (isNaN(planned) || planned <= 0) throw new Error('Valor inválido');

      const { data: inserted, error } = await supabase
        .from('budgets')
        .insert([{
          user_id: currentUser.id,
          category_id: null,
          month: formData.month,
          year: formData.year,
          planned_amount: planned,
          spent_amount: 0,
        }])
        .select();

      if (error) throw error;

      console.info('Inserted budget:', inserted);
      alert('Meta criada com sucesso');
      // navigate and signal refresh to the planejamento page
      navigate('/planejamento', { state: { refreshed: true, created: inserted?.[0] } });
    } catch (error: any) {
      alert('Erro ao criar meta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPreviousMonth = async () => {
    setLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      if (!currentUser) {
        alert('Usuário não autenticado');
        return;
      }
      // Calcular mês anterior
      let prevMonth = formData.month - 1;
      let prevYear = formData.year;
      
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear = prevYear - 1;
      }

      // Buscar metas do mês anterior
      const { data: previousBudgets, error: fetchError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('month', prevMonth)
        .eq('year', prevYear);

      if (fetchError) throw fetchError;

      if (!previousBudgets || previousBudgets.length === 0) {
        alert('Nenhuma meta encontrada no mês anterior');
        return;
      }

      // Copiar metas para o mês atual
      const newBudgets = previousBudgets.map(budget => ({
        user_id: currentUser.id,
        category_id: budget.category_id,
        month: formData.month,
        year: formData.year,
        planned_amount: budget.planned_amount,
        spent_amount: 0,
      }));

      const { error: insertError } = await supabase
        .from('budgets')
        .insert(newBudgets);

      if (insertError) throw insertError;

      alert(`${newBudgets.length} meta(s) copiada(s) com sucesso!`);
      navigate('/planejamento');
    } catch (error: any) {
      alert('Erro ao copiar metas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-6">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#5856D6] to-[#3634A3] text-white px-5 pt-12 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Criar Meta</h1>
        </div>
      </header>

      {/* Formulário */}
      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mês e Ano */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês
            </label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent outline-none transition-all text-sm cursor-pointer"
              required
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent outline-none transition-all text-sm"
              required
            />
          </div>

          {/* Categoria */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent outline-none transition-all text-sm cursor-pointer"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Limite
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5856D6] focus:border-transparent outline-none transition-all text-sm"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Botão Copiar Mês Anterior */}
          <button
            type="button"
            onClick={handleCopyPreviousMonth}
            disabled={loading}
            className="w-full bg-white border-2 border-[#5856D6] text-[#5856D6] py-4 rounded-2xl font-semibold hover:bg-[#5856D6]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
          >
            <i className="ri-file-copy-line text-lg"></i>
            Repetir Metas do Mês Anterior
          </button>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5856D6] to-[#3634A3] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Salvando...' : 'Criar Meta'}
          </button>
        </form>
      </div>
    </div>
  );
}
