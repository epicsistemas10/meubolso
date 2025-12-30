
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/transacoes', icon: 'ri-exchange-line', label: 'Receitas e Despesas' },
    { path: '/planejamento', icon: 'ri-target-line', label: 'Planejamento e Metas' },
    { path: '/investimentos', icon: 'ri-line-chart-line', label: 'Investimentos' },
    { path: '/patrimonio', icon: 'ri-building-line', label: 'Patrimônio' },
    { path: '/relatorios', icon: 'ri-file-chart-line', label: 'Relatórios' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-card border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img 
            src="https://static.readdy.ai/image/32e34e04a919b9271ef3ff4f79b7fd86/bd659f41865079057356b06cd4282117.png" 
            alt="Meu Bolso" 
            className="w-10 h-10"
          />
          <span className="text-xl font-bold text-text-main">Meu Bolso</span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:bg-bg-main hover:text-white'
                  }`}
                >
                  <i className={`${item.icon} text-xl w-6 h-6 flex items-center justify-center`}></i>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:text-white transition-colors rounded-lg hover:bg-bg-main whitespace-nowrap cursor-pointer">
          <i className="ri-settings-3-line text-xl w-6 h-6 flex items-center justify-center"></i>
          <span className="text-sm font-medium">Configurações</span>
        </button>
      </div>
    </aside>
  );
}
