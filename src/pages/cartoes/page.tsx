import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/feature/BottomNav';

export default function CartoesPage() {
  const navigate = useNavigate();
  const [cards] = useState([
    {
      id: 1,
      name: 'Nubank',
      lastDigits: '4532',
      brand: 'Mastercard',
      limit: 5000,
      used: 1250,
      dueDate: '15',
      color: 'from-[#8A05BE] to-[#6B04A0]'
    },
    {
      id: 2,
      name: 'Inter',
      lastDigits: '8765',
      brand: 'Visa',
      limit: 3000,
      used: 890,
      dueDate: '10',
      color: 'from-[#FF7A00] to-[#E66A00]'
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FF9500] to-[#E68600] text-white px-5 pt-12 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Cartões</h1>
          <button
            onClick={() => navigate('/cartoes/adicionar')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>
      </header>

      {/* Lista de Cartões */}
      <div className="px-5 py-6 space-y-4">
        {cards.map((card) => {
          const percentage = getUsagePercentage(card.used, card.limit);
          const available = card.limit - card.used;

          return (
            <div key={card.id} className="cursor-pointer">
              {/* Cartão Visual */}
              <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg mb-3`}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Cartão</p>
                    <p className="text-xl font-bold">{card.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/80">Vencimento</p>
                    <p className="text-lg font-bold">Dia {card.dueDate}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/80 mb-1">Disponível</p>
                  <p className="text-2xl font-bold">{formatCurrency(available)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm">•••• {card.lastDigits}</p>
                  <p className="text-sm font-semibold">{card.brand}</p>
                </div>
              </div>

              {/* Informações de Uso */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Usado</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(card.used)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Limite</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(card.limit)}</p>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage >= 80 ? 'bg-[#FF4D4F]' : percentage >= 50 ? 'bg-[#FF9500]' : 'bg-[#34C759]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 text-right mt-2">
                  {percentage.toFixed(0)}% utilizado
                </p>
              </div>
            </div>
          );
        })}

        {/* Card Adicionar */}
        <button
          onClick={() => navigate('/cartoes/adicionar')}
          className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-dashed border-gray-200"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-add-line text-2xl text-gray-400 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 font-medium">Adicionar Novo Cartão</p>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
