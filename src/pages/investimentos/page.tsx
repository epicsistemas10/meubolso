import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function Investimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadInvestments();
  }, [user]);

  const loadInvestments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuotes = async () => {
    setUpdating(true);
    
    // Simular atualização de cotações (em produção, você integraria com APIs reais)
    try {
      const updatedInvestments = investments.map(inv => {
        // Simular variação de -5% a +5%
        const variation = (Math.random() - 0.5) * 0.1;
        const newValue = inv.current_value * (1 + variation);
        
        return {
          ...inv,
          current_value: newValue
        };
      });

      // Atualizar no banco
      for (const inv of updatedInvestments) {
        await supabase
          .from('investments')
          .update({ current_value: inv.current_value })
          .eq('id', inv.id);
      }

      setInvestments(updatedInvestments);
      
      // Mostrar notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-[#34C759] text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in';
      notification.textContent = 'Cotações atualizadas com sucesso!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao atualizar cotações:', error);
      alert('Erro ao atualizar cotações');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalInvested = () => {
    return investments.reduce((sum, inv) => sum + inv.invested_amount, 0);
  };

  const getTotalCurrentValue = () => {
    return investments.reduce((sum, inv) => sum + (inv.current_value || inv.invested_amount), 0);
  };

  const getTotalProfit = () => {
    return getTotalCurrentValue() - getTotalInvested();
  };

  const getProfitPercentage = () => {
    const invested = getTotalInvested();
    if (invested === 0) return 0;
    return ((getTotalProfit() / invested) * 100).toFixed(2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stocks': return 'ri-line-chart-line';
      case 'funds': return 'ri-funds-line';
      case 'fixed_income': return 'ri-money-dollar-circle-line';
      case 'variable_income': return 'ri-stock-line';
      case 'crypto': return 'ri-bit-coin-line';
      case 'real_estate': return 'ri-building-line';
      default: return 'ri-wallet-line';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'stocks': return 'Ações';
      case 'funds': return 'Fundos';
      case 'fixed_income': return 'Renda Fixa';
      case 'variable_income': return 'Renda Variável';
      case 'crypto': return 'Criptomoedas';
      case 'real_estate': return 'Imóveis';
      default: return 'Outro';
    }
  };

  const extractTickerFromNotes = (notes: string | null) => {
    if (!notes) return null;
    const match = notes.match(/Ticker:\s*([^\|]+)/);
    return match ? match[1].trim() : null;
  };

  const extractQuantityFromNotes = (notes: string | null) => {
    if (!notes) return null;
    const match = notes.match(/Quantidade:\s*([^\|]+)/);
    return match ? match[1].trim() : null;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <h1 className="text-2xl font-bold">Investimentos</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={updateQuotes}
              disabled={updating || investments.length === 0}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Atualizar cotações"
            >
              <i className={`ri-refresh-line text-xl w-6 h-6 flex items-center justify-center ${updating ? 'animate-spin' : ''}`}></i>
            </button>
            <button
              onClick={() => navigate('/investimentos/adicionar')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
            >
              <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        {/* Resumo Total */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm mb-4">
          <p className="text-sm text-white/80 mb-2">Patrimônio Total</p>
          <p className="text-3xl font-bold mb-3">{formatCurrency(getTotalCurrentValue())}</p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-white/80">Investido</p>
              <p className="text-sm font-semibold">{formatCurrency(getTotalInvested())}</p>
            </div>
            <div>
              <p className="text-xs text-white/80">Rendimento</p>
              <p className={`text-sm font-semibold ${getTotalProfit() >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                {getTotalProfit() >= 0 ? '+' : ''}{formatCurrency(getTotalProfit())} ({getProfitPercentage()}%)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Lista de Investimentos */}
      <div className="px-5 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : investments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-line-chart-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhum investimento cadastrado</p>
            <button
              onClick={() => navigate('/investimentos/adicionar')}
              className="px-6 py-2 bg-[#007AFF] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Adicionar Investimento
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {investments.map((investment) => {
              const profit = (investment.current_value || investment.invested_amount) - investment.invested_amount;
              const profitPercentage = ((profit / investment.invested_amount) * 100).toFixed(2);
              const ticker = extractTickerFromNotes(investment.notes);
              const quantity = extractQuantityFromNotes(investment.notes);

              return (
                <div
                  key={investment.id}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#007AFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className={`${getTypeIcon(investment.type)} text-2xl text-[#007AFF] w-6 h-6 flex items-center justify-center`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{investment.name}</p>
                            {ticker && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {ticker}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{getTypeName(investment.type)}</p>
                          {quantity && (
                            <p className="text-xs text-gray-400 mt-1">Qtd: {quantity}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 whitespace-nowrap">
                            {formatCurrency(investment.current_value || investment.invested_amount)}
                          </p>
                          <p className={`text-xs whitespace-nowrap ${profit >= 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                            {profit >= 0 ? '+' : ''}{formatCurrency(profit)} ({profitPercentage}%)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Investido: {formatCurrency(investment.invested_amount)}</span>
                      </div>
                    </div>
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
