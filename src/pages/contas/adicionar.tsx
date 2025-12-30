import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const bancos = [
  { id: 'nubank', name: 'Nubank', logo: 'https://readdy.ai/api/search-image?query=Nubank%20purple%20logo%20icon%20on%20white%20background%20clean%20modern%20fintech%20banking%20app%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=nubank001&orientation=squarish' },
  { id: 'itau', name: 'Itaú', logo: 'https://readdy.ai/api/search-image?query=Itau%20bank%20orange%20logo%20icon%20on%20white%20background%20clean%20modern%20brazilian%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=itau001&orientation=squarish' },
  { id: 'bradesco', name: 'Bradesco', logo: 'https://readdy.ai/api/search-image?query=Bradesco%20bank%20red%20logo%20icon%20on%20white%20background%20clean%20modern%20brazilian%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=bradesco001&orientation=squarish' },
  { id: 'santander', name: 'Santander', logo: 'https://readdy.ai/api/search-image?query=Santander%20bank%20red%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=santander001&orientation=squarish' },
  { id: 'bb', name: 'Banco do Brasil', logo: 'https://readdy.ai/api/search-image?query=Banco%20do%20Brasil%20yellow%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20brazilian%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=bb001&orientation=squarish' },
  { id: 'caixa', name: 'Caixa', logo: 'https://readdy.ai/api/search-image?query=Caixa%20Economica%20Federal%20blue%20orange%20logo%20icon%20on%20white%20background%20clean%20modern%20brazilian%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=caixa001&orientation=squarish' },
  { id: 'inter', name: 'Inter', logo: 'https://readdy.ai/api/search-image?query=Banco%20Inter%20orange%20logo%20icon%20on%20white%20background%20clean%20modern%20digital%20banking%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=inter001&orientation=squarish' },
  { id: 'c6', name: 'C6 Bank', logo: 'https://readdy.ai/api/search-image?query=C6%20Bank%20gray%20black%20logo%20icon%20on%20white%20background%20clean%20modern%20digital%20banking%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=c6001&orientation=squarish' },
  { id: 'picpay', name: 'PicPay', logo: 'https://readdy.ai/api/search-image?query=PicPay%20green%20logo%20icon%20on%20white%20background%20clean%20modern%20digital%20wallet%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=picpay001&orientation=squarish' },
  { id: 'mercadopago', name: 'Mercado Pago', logo: 'https://readdy.ai/api/search-image?query=Mercado%20Pago%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20digital%20wallet%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=mercadopago001&orientation=squarish' },
  { id: 'paypal', name: 'PayPal', logo: 'https://readdy.ai/api/search-image?query=PayPal%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20payment%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=paypal001&orientation=squarish' },
  { id: 'wise', name: 'Wise', logo: 'https://readdy.ai/api/search-image?query=Wise%20green%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20money%20transfer%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=wise001&orientation=squarish' },
  { id: 'revolut', name: 'Revolut', logo: 'https://readdy.ai/api/search-image?query=Revolut%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20digital%20banking%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=revolut001&orientation=squarish' },
  { id: 'n26', name: 'N26', logo: 'https://readdy.ai/api/search-image?query=N26%20bank%20turquoise%20logo%20icon%20on%20white%20background%20clean%20modern%20european%20digital%20banking%20fintech%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=n26001&orientation=squarish' },
  { id: 'chase', name: 'Chase', logo: 'https://readdy.ai/api/search-image?query=Chase%20bank%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20american%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=chase001&orientation=squarish' },
  { id: 'bofa', name: 'Bank of America', logo: 'https://readdy.ai/api/search-image?query=Bank%20of%20America%20red%20blue%20logo%20icon%20on%20white%20background%20clean%20modern%20american%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=bofa001&orientation=squarish' },
  { id: 'hsbc', name: 'HSBC', logo: 'https://readdy.ai/api/search-image?query=HSBC%20bank%20red%20white%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=hsbc001&orientation=squarish' },
  { id: 'citibank', name: 'Citibank', logo: 'https://readdy.ai/api/search-image?query=Citibank%20blue%20red%20logo%20icon%20on%20white%20background%20clean%20modern%20international%20banking%20simple%20minimalist%20design%20high%20quality%20professional%20branding&width=200&height=200&seq=citibank001&orientation=squarish' },
  { id: 'outro', name: 'Outro Banco', logo: 'https://readdy.ai/api/search-image?query=Generic%20bank%20building%20icon%20gray%20on%20white%20background%20clean%20modern%20simple%20minimalist%20design%20high%20quality%20professional%20neutral%20banking&width=200&height=200&seq=outro001&orientation=squarish' },
];

const accountTypes = [
  { id: 'checking', name: 'Conta Corrente', icon: 'ri-bank-line' },
  { id: 'savings', name: 'Poupança', icon: 'ri-safe-line' },
  { id: 'investment', name: 'Investimento', icon: 'ri-line-chart-line' },
  { id: 'cash', name: 'Dinheiro', icon: 'ri-money-dollar-circle-line' },
];

export default function AdicionarConta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'select' | 'manual' | 'openfinance'>('select');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = bancos.filter(banco =>
    banco.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenFinance = () => {
    // Simulação de conexão Open Finance
    alert('🔗 Open Finance\n\nEm breve você poderá conectar suas contas bancárias automaticamente através do Open Finance.\n\nPor enquanto, adicione suas contas manualmente.');
    setMode('manual');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const selectedBankData = bancos.find(b => b.id === selectedBank);
      
      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          name: accountName || selectedBankData?.name || 'Minha Conta',
          bank_name: selectedBankData?.name || accountName,
          account_type: accountType,
          balance: parseFloat(balance) || 0,
          is_open_finance: false,
          icon: selectedBankData?.logo || null,
          color: null,
        });

      if (error) throw error;

      navigate('/contas');
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      alert('Erro ao adicionar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        {/* Header */}
        <header className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white px-5 pt-8 pb-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/contas')}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <h1 className="text-xl font-bold">Adicionar Conta</h1>
          </div>
        </header>

        {/* Opções */}
        <div className="px-5 py-6 space-y-4">
          {/* Open Finance */}
          <button
            onClick={handleOpenFinance}
            className="w-full bg-gradient-to-br from-[#34C759] to-[#2BA84A] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-link text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg mb-1">Conectar com Open Finance</h3>
                <p className="text-sm text-white/90">Sincronize automaticamente suas contas bancárias</p>
              </div>
              <i className="ri-arrow-right-s-line text-2xl w-6 h-6 flex items-center justify-center"></i>
            </div>
          </button>

          {/* Manual */}
          <button
            onClick={() => setMode('manual')}
            className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
                <i className="ri-edit-line text-3xl text-[#7C3AED] w-8 h-8 flex items-center justify-center"></i>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg text-gray-900 mb-1">Adicionar Manualmente</h3>
                <p className="text-sm text-gray-500">Cadastre sua conta com saldo inicial</p>
              </div>
              <i className="ri-arrow-right-s-line text-2xl text-gray-400 w-6 h-6 flex items-center justify-center"></i>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="px-5 mt-8">
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
            <i className="ri-information-line text-xl text-blue-600 w-6 h-6 flex items-center justify-center flex-shrink-0"></i>
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium mb-1">Open Finance</p>
              <p className="text-xs text-blue-700">
                Com o Open Finance, você pode conectar suas contas bancárias de forma segura e ter seus saldos atualizados automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white px-5 pt-8 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setMode('select')}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Adicionar Conta Manual</h1>
        </div>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 py-6">
        {/* Buscar Banco */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Banco
          </label>
          <div className="relative">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg w-5 h-5 flex items-center justify-center"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do banco..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Bancos */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecione o Banco
          </label>
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredBanks.map((banco) => (
              <button
                key={banco.id}
                type="button"
                onClick={() => setSelectedBank(banco.id)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedBank === banco.id
                    ? 'border-[#7C3AED] bg-[#7C3AED]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-white">
                  <img
                    src={banco.logo}
                    alt={banco.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-700 font-medium text-center truncate">
                  {banco.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Nome da Conta */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Conta
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Ex: Conta Corrente Principal"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
          />
        </div>

        {/* Tipo de Conta */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Conta
          </label>
          <div className="grid grid-cols-2 gap-3">
            {accountTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setAccountType(type.id)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  accountType === type.id
                    ? 'border-[#7C3AED] bg-[#7C3AED]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <i className={`${type.icon} text-2xl mb-2 w-6 h-6 flex items-center justify-center mx-auto ${
                  accountType === type.id ? 'text-[#7C3AED]' : 'text-gray-400'
                }`}></i>
                <p className="text-xs text-gray-700 font-medium text-center">
                  {type.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Saldo Inicial */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saldo Inicial
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0,00"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMode('select')}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !selectedBank}
            className="flex-1 py-3 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {loading ? 'Salvando...' : 'Adicionar Conta'}
          </button>
        </div>
      </form>
    </div>
  );
}
