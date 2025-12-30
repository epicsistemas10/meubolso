import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function AdicionarObjetivo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '0',
    deadline: '',
    icon: 'ri-flag-line',
    color: 'from-[#34C759] to-[#2BA84A]'
  });

  const icons = [
    { value: 'ri-plane-line', label: 'Viagem' },
    { value: 'ri-car-line', label: 'Carro' },
    { value: 'ri-home-line', label: 'Casa' },
    { value: 'ri-building-line', label: 'Imóvel' },
    { value: 'ri-shield-check-line', label: 'Reserva' },
    { value: 'ri-graduation-cap-line', label: 'Educação' },
    { value: 'ri-heart-line', label: 'Casamento' },
    { value: 'ri-gift-line', label: 'Presente' },
    { value: 'ri-bike-line', label: 'Bicicleta' },
    { value: 'ri-motorbike-line', label: 'Moto' },
    { value: 'ri-ship-line', label: 'Barco' },
    { value: 'ri-rocket-line', label: 'Startup' },
    { value: 'ri-briefcase-line', label: 'Negócio' },
    { value: 'ri-computer-line', label: 'Computador' },
    { value: 'ri-smartphone-line', label: 'Celular' },
    { value: 'ri-camera-line', label: 'Câmera' },
    { value: 'ri-gamepad-line', label: 'Games' },
    { value: 'ri-music-line', label: 'Música' },
    { value: 'ri-palette-line', label: 'Arte' },
    { value: 'ri-book-line', label: 'Livros' },
    { value: 'ri-hospital-line', label: 'Saúde' },
    { value: 'ri-stethoscope-line', label: 'Médico' },
    { value: 'ri-tooth-line', label: 'Dentista' },
    { value: 'ri-run-line', label: 'Esporte' },
    { value: 'ri-football-line', label: 'Futebol' },
    { value: 'ri-basketball-line', label: 'Basquete' },
    { value: 'ri-riding-line', label: 'Equitação' },
    { value: 'ri-sailboat-line', label: 'Vela' },
    { value: 'ri-tent-line', label: 'Camping' },
    { value: 'ri-umbrella-line', label: 'Praia' },
    { value: 'ri-sun-line', label: 'Férias' },
    { value: 'ri-moon-line', label: 'Noite' },
    { value: 'ri-restaurant-line', label: 'Restaurante' },
    { value: 'ri-cake-line', label: 'Festa' },
    { value: 'ri-champagne-line', label: 'Celebração' },
    { value: 'ri-shopping-bag-line', label: 'Compras' },
    { value: 'ri-t-shirt-line', label: 'Roupas' },
    { value: 'ri-handbag-line', label: 'Bolsa' },
    { value: 'ri-glasses-line', label: 'Óculos' },
    { value: 'ri-watch-line', label: 'Relógio' },
    { value: 'ri-plant-line', label: 'Jardim' },
    { value: 'ri-leaf-line', label: 'Natureza' },
    { value: 'ri-tree-line', label: 'Árvore' },
    { value: 'ri-flower-line', label: 'Flores' },
    { value: 'ri-bear-smile-line', label: 'Pet' },
    { value: 'ri-dog-line', label: 'Cachorro' },
    { value: 'ri-cat-line', label: 'Gato' },
    { value: 'ri-bird-line', label: 'Pássaro' },
    { value: 'ri-fish-line', label: 'Peixe' },
    { value: 'ri-bug-line', label: 'Inseto' },
    { value: 'ri-star-line', label: 'Estrela' },
    { value: 'ri-trophy-line', label: 'Troféu' },
    { value: 'ri-medal-line', label: 'Medalha' },
    { value: 'ri-award-line', label: 'Prêmio' },
    { value: 'ri-crown-line', label: 'Coroa' },
    { value: 'ri-vip-crown-line', label: 'VIP' },
    { value: 'ri-fire-line', label: 'Fogo' },
    { value: 'ri-flashlight-line', label: 'Lanterna' },
    { value: 'ri-lightbulb-line', label: 'Ideia' },
    { value: 'ri-key-line', label: 'Chave' },
    { value: 'ri-lock-line', label: 'Segurança' },
    { value: 'ri-safe-line', label: 'Cofre' },
    { value: 'ri-bank-card-line', label: 'Cartão' },
    { value: 'ri-wallet-line', label: 'Carteira' },
    { value: 'ri-money-dollar-circle-line', label: 'Dinheiro' },
    { value: 'ri-coin-line', label: 'Moeda' },
    { value: 'ri-copper-coin-line', label: 'Moedas' },
    { value: 'ri-flag-line', label: 'Outro' }
  ];

  const colors = [
    { value: 'from-[#34C759] to-[#2BA84A]', label: 'Verde' },
    { value: 'from-[#007AFF] to-[#0051D5]', label: 'Azul' },
    { value: 'from-[#5856D6] to-[#3634A3]', label: 'Roxo' },
    { value: 'from-[#FF9500] to-[#E68600]', label: 'Laranja' },
    { value: 'from-[#FF2D55] to-[#D91E47]', label: 'Rosa' },
    { value: 'from-[#FF3B30] to-[#D32F2F]', label: 'Vermelho' },
    { value: 'from-[#00C7BE] to-[#00A39A]', label: 'Turquesa' },
    { value: 'from-[#AF52DE] to-[#8E3FBF]', label: 'Lilás' },
    { value: 'from-[#FFD60A] to-[#E6C200]', label: 'Amarelo' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar conta poupança para o objetivo
      const { data: savingsAccount, error: accountError } = await supabase
        .from('accounts')
        .insert([{
          user_id: user?.id,
          name: `Poupança - ${formData.name}`,
          account_type: 'savings',
          balance: parseFloat(formData.current),
          color: formData.color.split("'")[1],
          icon: formData.icon
        }])
        .select()
        .single();

      if (accountError) throw accountError;

      // Criar o objetivo vinculado à conta
      const { error: goalError } = await supabase
        .from('goals')
        .insert([{
          user_id: user?.id,
          name: formData.name,
          target_amount: parseFloat(formData.target),
          current_amount: parseFloat(formData.current),
          deadline: formData.deadline,
          icon: formData.icon,
          color: formData.color,
          savings_account_id: savingsAccount.id,
          status: 'active'
        }]);

      if (goalError) throw goalError;

      navigate('/objetivos');
    } catch (error: any) {
      console.error('Erro ao criar objetivo:', error);
      alert('Erro ao criar objetivo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMonthsRemaining = () => {
    if (!formData.deadline) return 0;
    const today = new Date();
    const end = new Date(formData.deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 1);
  };

  const calculateMonthlySavings = () => {
    const target = parseFloat(formData.target) || 0;
    const current = parseFloat(formData.current) || 0;
    const remaining = target - current;
    const months = getMonthsRemaining();
    
    if (months === 0 || remaining <= 0) return 0;
    return remaining / months;
  };

  const monthlySavings = calculateMonthlySavings();

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-6">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FF2D55] to-[#D91E47] text-white px-5 pt-12 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Criar Objetivo</h1>
        </div>
      </header>

      {/* Formulário */}
      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Objetivo */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Objetivo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent outline-none transition-all text-sm"
              placeholder="Ex: Viagem para Europa"
              required
            />
          </div>

          {/* Valor Meta */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Meta
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent outline-none transition-all text-sm"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Valor Inicial */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Inicial (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent outline-none transition-all text-sm"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Data Limite */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Limite
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF2D55] focus:border-transparent outline-none transition-all text-sm cursor-pointer"
              required
            />
          </div>

          {/* Cálculo de Poupança Mensal */}
          {formData.target && formData.deadline && monthlySavings > 0 && (
            <div className="bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <i className="ri-calendar-check-line text-2xl text-[#007AFF] w-6 h-6 flex items-center justify-center flex-shrink-0"></i>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Meta de Poupança Mensal</p>
                  <p className="text-2xl font-bold text-[#007AFF] mb-2">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlySavings)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Para alcançar seu objetivo em {getMonthsRemaining()} {getMonthsRemaining() === 1 ? 'mês' : 'meses'}, você precisa poupar este valor mensalmente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ícone */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ícone
            </label>
            <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {icons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: icon.value })}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.icon === icon.value
                      ? 'border-[#FF2D55] bg-[#FF2D55]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <i className={`${icon.value} text-2xl w-6 h-6 flex items-center justify-center mx-auto mb-1`}></i>
                  <p className="text-xs text-center text-gray-600">{icon.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cor
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.color === color.value
                      ? 'border-gray-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-8 rounded-lg bg-gradient-to-br ${color.value} mb-2`}></div>
                  <p className="text-xs text-center text-gray-600">{color.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Informação sobre Porquinho */}
          <div className="bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-xl text-[#34C759] w-6 h-6 flex items-center justify-center flex-shrink-0"></i>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Porquinho Automático</p>
                <p className="text-xs text-gray-600">
                  Ao criar este objetivo, será criada uma conta poupança especial. Toda vez que você adicionar dinheiro nesta conta, o valor será automaticamente computado no progresso do seu objetivo!
                </p>
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF2D55] to-[#D91E47] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Criando...' : 'Criar Objetivo'}
          </button>
        </form>
      </div>
    </div>
  );
}
