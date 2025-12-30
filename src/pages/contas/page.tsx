import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function ContasPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [showOpenFinanceModal, setShowOpenFinanceModal] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, [user]);

  const loadAccounts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
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

  const getTotalBalance = () => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  const totalBalance = getTotalBalance();

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return 'ri-bank-line';
      case 'savings': return 'ri-safe-line';
      case 'investment': return 'ri-line-chart-line';
      case 'cash': return 'ri-money-dollar-circle-line';
      default: return 'ri-wallet-line';
    }
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'checking': return 'Conta Corrente';
      case 'savings': return 'Poupança';
      case 'investment': return 'Investimento';
      case 'cash': return 'Dinheiro';
      default: return 'Outra';
    }
  };

  const handleConnectBank = () => {
    setShowOpenFinanceModal(true);
  };

  const handleCloseOpenFinanceModal = () => {
    setShowOpenFinanceModal(false);
  };

  const handleSelectBank = (bankName: string) => {
    // Redirecionar para adicionar conta com o banco pré-selecionado
    navigate('/contas/adicionar', { state: { selectedBank: bankName, isOpenFinance: true } });
  };

  const handleRequestDelete = (accountId: string) => {
    setAccountToDelete(accountId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete || !user) return;
    try {
      const { error } = await supabase.from('accounts').delete().eq('id', accountToDelete).eq('user_id', user.id);
      if (error) throw error;
      setShowDeleteModal(false);
      setAccountToDelete(null);
      await loadAccounts();
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      alert('Erro ao deletar conta. Veja o console para mais detalhes.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/principal')}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Contas</h1>
          <button
            onClick={() => navigate('/contas/adicionar')}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {/* Total */}
        <div className="text-center">
          <p className="text-white/80 text-sm mb-1">Saldo Total</p>
          <p className="text-3xl font-bold">
            R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </header>

      {/* Lista de Contas */}
      <div className="px-5 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#34C759] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-bank-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhuma conta cadastrada</p>
            <button
              onClick={() => navigate('/contas/adicionar')}
              className="px-6 py-2 bg-[#34C759] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Adicionar Conta
            </button>
          </div>
        ) : (
          <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#34C759]/10 rounded-full flex items-center justify-center">
                        <i className={`${getAccountIcon(account.type)} text-2xl text-[#34C759] w-6 h-6 flex items-center justify-center`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{account.name}</p>
                        <p className="text-xs text-gray-500">{getAccountTypeName(account.type)}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                        <button
                          onClick={() => handleRequestDelete(account.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-red-500"
                          title="Excluir conta"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {/* Open Finance */}
        <div className="mt-6 bg-gradient-to-br from-[#5856D6] to-[#3634A3] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-link text-2xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Open Finance</h3>
              <p className="text-sm text-white/80 mb-4">
                Conecte suas contas bancárias automaticamente e tenha controle total das suas finanças em um só lugar.
              </p>
              <button
                onClick={handleConnectBank}
                className="px-6 py-2 bg-white text-[#5856D6] rounded-xl text-sm font-semibold hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Conectar Banco
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Open Finance */}
      {showOpenFinanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conectar com Open Finance</h2>
                <p className="text-sm text-gray-600 mt-1">Sincronize automaticamente suas contas bancárias</p>
              </div>
              <button
                onClick={handleCloseOpenFinanceModal}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl text-gray-600"></i>
              </button>
            </div>

            <div className="p-6">
              {/* Busca */}
              <div className="mb-6">
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
                  <input
                    type="text"
                    placeholder="Buscar banco..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Lista de Bancos */}
              <div className="space-y-3">
                {[
                    { name: 'Nubank', logo: 'https://logo.clearbit.com/nubank.com.br' },
                    { name: 'Itaú', logo: 'https://logo.clearbit.com/itau.com.br' },
                    { name: 'Bradesco', logo: 'https://logo.clearbit.com/bradesco.com.br' },
                    { name: 'Santander', logo: 'https://logo.clearbit.com/santander.com.br' },
                    { name: 'Banco do Brasil', logo: 'https://logo.clearbit.com/bancodobrasil.com.br' },
                    { name: 'Caixa Econômica', logo: 'https://logo.clearbit.com/caixa.gov.br' },
                    { name: 'Inter', logo: 'https://logo.clearbit.com/bancointer.com.br' },
                    { name: 'C6 Bank', logo: 'https://logo.clearbit.com/c6bank.com.br' },
                    { name: 'PicPay', logo: 'https://logo.clearbit.com/picpay.com' },
                    { name: 'Mercado Pago', logo: 'https://logo.clearbit.com/mercadopago.com' },
                    { name: 'PayPal', logo: 'https://logo.clearbit.com/paypal.com' },
                    { name: 'Wise', logo: 'https://logo.clearbit.com/wise.com' },
                    { name: 'Revolut', logo: 'https://logo.clearbit.com/revolut.com' },
                    { name: 'N26', logo: 'https://logo.clearbit.com/n26.com' },
                    { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
                    { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
                    { name: 'HSBC', logo: 'https://logo.clearbit.com/hsbc.com' },
                    { name: 'Citibank', logo: 'https://logo.clearbit.com/citigroup.com' },
                  ].map((bank) => (
                  <button
                    key={bank.name}
                    onClick={() => handleSelectBank(bank.name)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#7C3AED] hover:bg-purple-50 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg border border-gray-200 group-hover:border-[#7C3AED] transition-colors overflow-hidden">
                      <img src={bank.logo} alt={bank.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                      <p className="text-xs text-gray-500">Sincronização automática</p>
                    </div>
                    <i className="ri-arrow-right-line text-xl text-gray-400 group-hover:text-[#7C3AED] transition-colors"></i>
                  </button>
                ))}
              </div>

              {/* Informações de Segurança */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-shield-check-line text-xl text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Conexão Segura</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Utilizamos Open Finance regulamentado pelo Banco Central. Suas credenciais são criptografadas e nunca são armazenadas em nossos servidores.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão Adicionar Manualmente */}
              <button
                onClick={() => {
                  handleCloseOpenFinanceModal();
                  navigate('/contas/adicionar');
                }}
                className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-semibold hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-purple-50 transition-all cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Adicionar Manualmente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Confirmar exclusão</h3>
            <p className="text-sm text-gray-600 mb-6">Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowDeleteModal(false); setAccountToDelete(null); }}
                className="px-4 py-2 bg-gray-100 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
