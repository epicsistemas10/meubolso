import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleAddClick = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    // map actions to principal quick-add types when possible
    if (action === 'receita') return navigate('/principal', { state: { type: 'receita' } });
    if (action === 'despesa') return navigate('/principal', { state: { type: 'despesa' } });
    // fallback to the dedicated add transaction page for other actions
    navigate('/transacao/adicionar', { state: { type: action } });
  };

  const navItems = [
    { path: '/principal', icon: 'ri-home-5-line', label: 'Início' },
    { path: '/transacoes', icon: 'ri-exchange-line', label: 'Transações' },
    { path: '/planejamento', icon: 'ri-pie-chart-line', label: 'Planejamento' },
    { path: '/objetivos', icon: 'ri-piggy-bank-line', label: 'Objetivos' },
    { path: '/mais', icon: 'ri-menu-line', label: 'Mais' }
  ];

  return (
    <>
      {/* Menu Flutuante */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={() => setShowMenu(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Botão Fechar Central */}
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
            >
              <i className="ri-close-line text-2xl text-gray-900 w-6 h-6 flex items-center justify-center"></i>
            </button>

            {/* Opções em Círculo */}
            <div className="relative w-64 h-64">
              {/* Receita - Topo */}
              <button
                onClick={() => handleMenuAction('receita')}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#34C759] rounded-full shadow-lg flex items-center justify-center">
                  <i className="ri-arrow-down-circle-line text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Receita</span>
              </button>

              {/* Despesa - Direita */}
              <button
                onClick={() => handleMenuAction('despesa')}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#FF4D4F] rounded-full shadow-lg flex items-center justify-center">
                  <i className="ri-arrow-up-circle-line text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Despesa</span>
              </button>

              {/* Transferência - Baixo */}
              <button
                onClick={() => handleMenuAction('transferencia')}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#007AFF] rounded-full shadow-lg flex items-center justify-center">
                  <i className="ri-exchange-line text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Transferência</span>
              </button>

              {/* Despesa Cartão - Esquerda */}
              <button
                onClick={() => handleMenuAction('despesa-cartao')}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-16 h-16 bg-[#FF9500] rounded-full shadow-lg flex items-center justify-center">
                  <i className="ri-bank-card-line text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
                </div>
                <span className="text-white text-sm font-medium whitespace-nowrap">Despesa cartão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center justify-around relative">
            {/* Principal */}
            <button
              onClick={() => navigate('/principal')}
              className={`flex flex-col items-center gap-1 py-2 px-4 cursor-pointer transition-colors ${
                isActive('/principal') ? 'text-[#34C759]' : 'text-gray-500'
              }`}
            >
              <i className={`ri-home-5-${isActive('/principal') ? 'fill' : 'line'} text-2xl w-6 h-6 flex items-center justify-center`}></i>
              <span className="text-xs font-medium whitespace-nowrap">Principal</span>
            </button>

            {/* Transações */}
            <button
              onClick={() => navigate('/transacoes')}
              className={`flex flex-col items-center gap-1 py-2 px-4 cursor-pointer transition-colors ${
                isActive('/transacoes') ? 'text-[#34C759]' : 'text-gray-500'
              }`}
            >
              <i className={`ri-file-list-3-${isActive('/transacoes') ? 'fill' : 'line'} text-2xl w-6 h-6 flex items-center justify-center`}></i>
              <span className="text-xs font-medium whitespace-nowrap">Transações</span>
            </button>

            {/* Botão Central + */}
            <button
              onClick={handleAddClick}
              className="absolute left-1/2 transform -translate-x-1/2 -top-6 w-14 h-14 bg-gradient-to-br from-[#34C759] to-[#2BA84A] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <i className="ri-add-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
            </button>

            {/* Planejamento */}
            <button
              onClick={() => navigate('/planejamento')}
              className={`flex flex-col items-center gap-1 py-2 px-4 cursor-pointer transition-colors ${
                isActive('/planejamento') ? 'text-[#34C759]' : 'text-gray-500'
              }`}
            >
              <i className={`ri-pie-chart-${isActive('/planejamento') ? 'fill' : 'line'} text-2xl w-6 h-6 flex items-center justify-center`}></i>
              <span className="text-xs font-medium whitespace-nowrap">Planejamento</span>
            </button>

            {/* Mais */}
            <button
              onClick={() => navigate('/mais')}
              className={`flex flex-col items-center gap-1 py-2 px-4 cursor-pointer transition-colors ${
                isActive('/mais') ? 'text-[#34C759]' : 'text-gray-500'
              }`}
            >
              <i className={`ri-menu-${isActive('/mais') ? 'fill' : 'line'} text-2xl w-6 h-6 flex items-center justify-center`}></i>
              <span className="text-xs font-medium whitespace-nowrap">Mais</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
