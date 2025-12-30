import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function MaisPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('gerenciar');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    { id: 1, icon: 'ri-bank-line', title: 'Contas', description: 'Gerencie suas contas bancárias', path: '/contas', color: 'from-blue-500 to-blue-600' },
    { id: 2, icon: 'ri-bank-card-line', title: 'Cartões de crédito', description: 'Adicione e controle seus cartões', path: '/cartoes', color: 'from-purple-500 to-purple-600' },
    { id: 3, icon: 'ri-line-chart-line', title: 'Investimentos', description: 'Acompanhe seus investimentos', path: '/investimentos', color: 'from-teal-500 to-teal-600' },
    { id: 4, icon: 'ri-home-4-line', title: 'Patrimônio', description: 'Gerencie seus bens e ativos', path: '/patrimonio', color: 'from-orange-500 to-orange-600' },
    { id: 5, icon: 'ri-file-chart-line', title: 'Relatórios', description: 'Visualize gráficos e análises', path: '/relatorios', color: 'from-pink-500 to-pink-600' },
    { id: 6, icon: 'ri-link', title: 'Gestão de Open Finance', description: 'Conecte suas contas automaticamente', path: '/open-finance', color: 'from-indigo-500 to-indigo-600' },
    { id: 7, icon: 'ri-piggy-bank-line', title: 'Objetivos', description: 'Defina e acompanhe suas metas', path: '/objetivos/adicionar', color: 'from-red-500 to-red-600' },
    { id: 8, icon: 'ri-price-tag-3-line', title: 'Categorias', description: 'Organize suas transações', path: '/categorias', color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="gradient-header text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <img 
            src="https://static.readdy.ai/image/32e34e04a919b9271ef3ff4f79b7fd86/739492c7d57166e7909ba9a7593d80a6.png" 
            alt="Meu Bolso" 
            className="h-10 w-auto"
          />
          <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-notification-3-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <h1 className="text-lg font-semibold mb-6">Mais</h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setActiveTab('gerenciar')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gerenciar'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Gerenciar
          </button>
          <button
            onClick={() => setActiveTab('acompanhar')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'acompanhar'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Acompanhar
          </button>
          <button
            onClick={() => setActiveTab('sobre')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sobre'
                ? 'bg-white text-[#34C759]'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Sobre
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 py-6 space-y-3">
        {/* Contas */}
        <button
          onClick={() => navigate('/contas')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007AFF]/10 rounded-xl flex items-center justify-center">
              <i className="ri-bank-card-line text-2xl text-[#007AFF] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Contas</p>
              <p className="text-xs text-gray-500">Gerencie suas contas bancárias</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Cartões */}
        <button
          onClick={() => navigate('/cartoes')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF9500]/10 rounded-xl flex items-center justify-center">
              <i className="ri-bank-card-2-line text-2xl text-[#FF9500] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Cartões</p>
              <p className="text-xs text-gray-500">Gerencie seus cartões de crédito</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Categorias */}
        <button
          onClick={() => navigate('/categorias')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#AF52DE]/10 rounded-xl flex items-center justify-center">
              <i className="ri-price-tag-3-line text-2xl text-[#AF52DE] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Categorias</p>
              <p className="text-xs text-gray-500">Gerencie suas categorias</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Investimentos */}
        <button
          onClick={() => navigate('/investimentos')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#34C759]/10 rounded-xl flex items-center justify-center">
              <i className="ri-line-chart-line text-2xl text-[#34C759] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Investimentos</p>
              <p className="text-xs text-gray-500">Acompanhe seus investimentos</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Patrimônio */}
        <button
          onClick={() => navigate('/patrimonio')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#5856D6]/10 rounded-xl flex items-center justify-center">
              <i className="ri-home-smile-line text-2xl text-[#5856D6] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Patrimônio</p>
              <p className="text-xs text-gray-500">Gerencie seus bens e patrimônio</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Relatórios */}
        <button
          onClick={() => navigate('/relatorios')}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF2D55]/10 rounded-xl flex items-center justify-center">
              <i className="ri-bar-chart-box-line text-2xl text-[#FF2D55] w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Relatórios</p>
              <p className="text-xs text-gray-500">Visualize relatórios detalhados</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>

        {/* Sair */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <i className="ri-logout-box-line text-2xl text-red-500 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-500">Sair</p>
              <p className="text-xs text-gray-500">Desconectar da conta</p>
            </div>
            <i className="ri-arrow-right-s-line text-xl text-gray-400 w-5 h-5 flex items-center justify-center"></i>
          </div>
        </button>
      </div>

      {/* Configurações */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm overflow-hidden">
        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <i className="ri-settings-3-line text-white text-2xl w-6 h-6 flex items-center justify-center"></i>
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-900 text-base">Configurações</div>
            <div className="text-sm text-gray-500 mt-0.5">Preferências e ajustes do app</div>
          </div>
          <i className="ri-arrow-right-s-line text-gray-400 text-xl w-6 h-6 flex items-center justify-center"></i>
        </button>
      </div>

      {/* Versão */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Meu Bolso v1.0.0
      </div>

      <BottomNav />
    </div>
  );
}
