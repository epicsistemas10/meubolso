import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/feature/Header';
import BottomNav from '../../components/feature/BottomNav';
import Card from '../../components/base/Card';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function PrincipalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [monthIncome, setMonthIncome] = useState<number>(0);
  const [monthExpenses, setMonthExpenses] = useState<number>(0);
  const [accountMonthSummary, setAccountMonthSummary] = useState<Record<string, { income: number; expense: number }>>({});
  const [showValues, setShowValues] = useState<boolean>(true);
  const [quickAddType, setQuickAddType] = useState<'income' | 'expense' | null>(null);
  const [quickForm, setQuickForm] = useState({ description: '', amount: '', account: '', category: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, selectedMonth, selectedYear]);

  // open quick-add modal when navigated with state.type ('income'|'expense')
  useEffect(() => {
    const t = (location.state as any)?.type;
    if (t && (t === 'income' || t === 'expense' || t === 'receita' || t === 'despesa')) {
      const mapped = t === 'income' || t === 'receita' ? 'income' : 'expense';
      const firstCat = categories.find(c => c.type === mapped);
      setQuickAddType(mapped as 'income' | 'expense');
      setQuickForm({ description: '', amount: '', account: accounts[0]?.id || '', category: firstCat?.id || '' });
      // clear location.state to avoid reopening on back/refresh
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }
  }, [location.state, categories, accounts]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const budgetMonth = selectedMonth;
      const budgetYear = selectedYear;


      const [accountsRes, investmentsRes, goalsRes, assetsRes, budgetsRes, categoriesRes] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', user?.id),
        supabase.from('investments').select('*').eq('user_id', user?.id),
        supabase.from('goals').select('*').eq('user_id', user?.id),
        supabase.from('assets').select('*').eq('user_id', user?.id),
        supabase.from('budgets').select('*').eq('user_id', user?.id).eq('month', budgetMonth).eq('year', budgetYear),
        supabase.from('categories').select('*').eq('user_id', user?.id)
      ]);

      if (accountsRes.data) setAccounts(accountsRes.data);
      if (investmentsRes.data) setInvestments(investmentsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (assetsRes.data) setAssets(assetsRes.data);
      if (budgetsRes.data) setBudgets(budgetsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      
      // Buscar transações do mês atual e calcular receitas/despesas
      try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const startStr = start.toISOString().split('T')[0];
        const nextStr = next.toISOString().split('T')[0];

        const transRes = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user?.id)
          .gte('date', startStr)
          .lt('date', nextStr);

        if (transRes.data) {
          let income = 0;
          let expense = 0;
          const byAccount: Record<string, { income: number; expense: number }> = {};
          transRes.data.forEach((t: any) => {
            const amt = parseFloat(t.amount) || 0;
            if (t.type === 'income') income += amt;
            else if (t.type === 'expense') expense += amt;

            const accId = t.account_id || t.to_account_id || null;
            if (accId) {
              const key = String(accId);
              if (!byAccount[key]) byAccount[key] = { income: 0, expense: 0 };
              if (t.type === 'income') byAccount[key].income += amt;
              else if (t.type === 'expense') byAccount[key].expense += amt;
            }
          });
          setMonthIncome(income);
          setMonthExpenses(expense);
          setAccountMonthSummary(byAccount);
        } else {
          setMonthIncome(0);
          setMonthExpenses(0);
          setAccountMonthSummary({});
        }
      } catch (err) {
        console.error('Erro ao buscar transações do mês:', err);
        setMonthIncome(0);
        setMonthExpenses(0);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  const getAccountIcon = (type: string | null) => {
    switch (type) {
      case 'checking': return 'ri-bank-line';
      case 'savings': return 'ri-safe-line';
      case 'investment': return 'ri-line-chart-line';
      default: return 'ri-wallet-line';
    }
  };

  const getInvestmentIcon = (type: string) => {
    switch (type) {
      case 'stocks': return 'ri-stock-line';
      case 'fixed_income': return 'ri-money-dollar-circle-line';
      case 'funds': return 'ri-pie-chart-line';
      case 'crypto': return 'ri-bit-coin-line';
      default: return 'ri-line-chart-line';
    }
  };

  const getInvestmentColor = (type: string) => {
    switch (type) {
      case 'stocks': return '#3B82F6';
      case 'fixed_income': return '#10B981';
      case 'funds': return '#F59E0B';
      case 'crypto': return '#8B5CF6';
      default: return '#6366F1';
    }
  };

  const totalAccounts = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const totalInvestments = investments.reduce((sum, inv) => sum + (inv.current_value || inv.invested_amount || 0), 0);
  const totalGoals = goals.reduce((sum, goal) => sum + (goal.current_amount || 0), 0);
  const totalAssets = assets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0);
  const scoreTotal = totalAccounts + totalInvestments + totalGoals + totalAssets;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-purple-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <Header largeLogo />

      <main className="pt-8 px-0 pb-6">
        {/* Full-width quick navigation */}
        <div className="w-full px-4 mb-3">
          <div className="bg-white rounded-2xl p-3 shadow-sm max-w-6xl mx-auto">
            <div className="flex items-stretch gap-3">
              <button onClick={() => navigate('/contas')} className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-bank-line text-2xl text-[#7C3AED]"></i>
                <span className="font-medium">Minhas Contas</span>
              </button>

              <button onClick={() => navigate('/investimentos')} className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-line-chart-line text-2xl text-[#007AFF]"></i>
                <span className="font-medium">Investimentos</span>
              </button>

              <button onClick={() => navigate('/planejamento')} className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-flag-line text-2xl text-[#7C3AED]"></i>
                <span className="font-medium">Metas</span>
              </button>

              <button onClick={() => navigate('/objetivos')} className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-arrow-right-circle-line text-2xl text-[#FF2D55]"></i>
                <span className="font-medium">Objetivos</span>
              </button>

              <button onClick={() => navigate('/patrimonio')} className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <i className="ri-home-4-line text-2xl text-[#FF9500]"></i>
                <span className="font-medium">Patrimônios</span>
              </button>

              
            </div>
          </div>
          {/* Quick Add Modal */}
          {quickAddType && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Nova {quickAddType === 'income' ? 'Receita' : 'Despesa'}</h3>
                  <button onClick={() => setQuickAddType(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">✕</button>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const amount = parseFloat(quickForm.amount.replace(',', '.')) || 0;
                    const transactionType = quickAddType === 'income' ? 'income' : 'expense';
                      await supabase.from('transactions').insert({
                      user_id: user?.id,
                      description: '',
                      amount: amount,
                      type: transactionType,
                        account_id: quickForm.account || null,
                        category_id: quickForm.category || null,
                      date: new Date().toISOString().split('T')[0]
                    });
                    setQuickAddType(null);
                    loadData();
                  } catch (err) {
                    console.error('Erro quick add:', err);
                    alert('Erro ao adicionar transação.');
                  }
                }}>
                  <div className="space-y-3">
                    {/* descrição removida conforme solicitado - apenas categoria e valor são exibidos */}
                    <div>
                      <label className="text-sm text-gray-700">Valor</label>
                      <div className="mt-1">
                        <input value={quickForm.amount} onChange={(e) => setQuickForm(f => ({ ...f, amount: e.target.value.replace(/[^0-9,\.]/g, '') }))} placeholder="0,00" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Conta</label>
                      <select value={quickForm.account} onChange={(e) => setQuickForm(f => ({ ...f, account: e.target.value }))} className="w-full px-3 py-2 border rounded-lg mt-1">
                        <option value="">Sem conta</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Categoria</label>
                      <select value={quickForm.category} onChange={(e) => setQuickForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border rounded-lg mt-1">
                        <option value="">Sem categoria</option>
                        {categories.filter((c: any) => c.type === quickAddType).map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setQuickAddType(null)} className="flex-1 py-2 rounded-lg border">Cancelar</button>
                      <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 text-white">Adicionar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-[1400px] px-6 mx-auto space-y-3">
          {/* Bloco central estilo mobile: Saldo + Receita/Despesa */}
          <div className="w-full flex justify-center mb-4 px-4">
            <div className="w-full max-w-md">
              <Card className="p-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Saldo atual em contas</p>
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        {showValues ? formatCurrency(totalAccounts) : '••••••••'}
                      </p>
                      <button onClick={() => setShowValues(v => !v)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                        <i className={`ri-${showValues ? 'eye-line' : 'eye-off-line'} text-lg text-gray-700`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                      onClick={() => { const firstCat = categories.find(c => c.type === 'income'); setQuickAddType('income'); setQuickForm({ description: '', amount: '', account: accounts[0]?.id || '', category: firstCat?.id || '' }); }}
                    className="flex items-center gap-3 justify-center py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    aria-label="Adicionar Receita"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                      <i className="ri-arrow-up-s-line text-2xl text-green-600"></i>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Receitas</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(monthIncome)}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { const firstCat = categories.find(c => c.type === 'expense'); setQuickAddType('expense'); setQuickForm({ description: '', amount: '', account: accounts[0]?.id || '', category: firstCat?.id || '' }); }}
                    className="flex items-center gap-3 justify-center py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    aria-label="Adicionar Despesa"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                      <i className="ri-arrow-down-s-line text-2xl text-red-600"></i>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Despesas</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(monthExpenses)}</p>
                    </div>
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Objetivo rápido removido */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contas */}
          <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><i className="ri-bank-line text-xl text-[#7C3AED]"></i>Minhas Contas</h2>
              <button
                onClick={() => navigate('/contas')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap cursor-pointer"
              >
                Ver todas
              </button>
            </div>

            {accounts.length === 0 ? (
              <Card className="p-8 text-center">
                <i className="ri-bank-line text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 mb-4">Nenhuma conta cadastrada</p>
                <button
                  onClick={() => navigate('/contas')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Adicionar Conta
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                {accounts.slice(0, 3).map((account) => (
                  <Card
                    key={account.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate('/contas')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: account.color || '#7C3AED' }}
                        >
                          <i className={`${account.icon || getAccountIcon(account.account_type)} text-xl text-white`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{account.name}</h3>
                          <p className="text-sm text-gray-500">{account.bank_name || 'Conta'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                        <div className="mt-2 flex items-center justify-end gap-3 text-xs">
                          {(() => {
                            const summary = accountMonthSummary[String(account.id)] || { income: 0, expense: 0 };
                            return (
                              <>
                                <div className="flex items-center gap-1 text-green-600">
                                  <i className="ri-arrow-up-s-line"></i>
                                  <span className="font-medium">{formatCurrency(summary.income)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-red-600">
                                  <i className="ri-arrow-down-s-line"></i>
                                  <span className="font-medium">{formatCurrency(summary.expense)}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {accounts.length > 3 && (
                  <button
                    onClick={() => navigate('/contas')}
                    className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium text-sm whitespace-nowrap cursor-pointer"
                  >
                    Ver mais {accounts.length - 3} conta(s)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Investimentos */}
          <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><i className="ri-line-chart-line text-xl text-[#007AFF]"></i>Investimentos</h2>
              <button
                onClick={() => navigate('/investimentos')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            {investments.length === 0 ? (
              <Card className="p-8 text-center">
                <i className="ri-line-chart-line text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 mb-4">Nenhum investimento cadastrado</p>
                <button
                  onClick={() => navigate('/investimentos/adicionar')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Adicionar Investimento
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                {investments.slice(0, 3).map((investment) => {
                  const currentValue = investment.current_value || investment.invested_amount;
                  const returnPercentage = investment.return_percentage || 
                    ((currentValue - investment.invested_amount) / investment.invested_amount * 100);
                  
                  return (
                    <Card
                      key={investment.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate('/investimentos')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: getInvestmentColor(investment.type) }}
                          >
                            <i className={`${getInvestmentIcon(investment.type)} text-xl text-white`}></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                            <p className="text-sm text-gray-500">
                              {investment.type === 'stocks' && 'Ações'}
                              {investment.type === 'fixed_income' && 'Renda Fixa'}
                              {investment.type === 'funds' && 'Fundos'}
                              {investment.type === 'crypto' && 'Criptomoedas'}
                              {investment.type === 'other' && 'Outros'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(currentValue)}</p>
                          <p className={`text-sm font-medium ${returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {investments.length > 3 && (
                  <button
                    onClick={() => navigate('/investimentos')}
                    className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium text-sm whitespace-nowrap cursor-pointer"
                  >
                    Ver mais {investments.length - 3} investimento(s)
                  </button>
                )}
              </div>
            )}
          </div>

          </div>
          {/* Cartões */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Meus Cartões</h2>
              <button
                onClick={() => navigate('/cartoes')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap cursor-pointer"
              >
                Ver todos
              </button>
            </div>

            <Card className="p-8 text-center">
              <i className="ri-bank-card-line text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500 mb-4">Nenhum cartão cadastrado</p>
              <button
                onClick={() => navigate('/cartoes')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                Adicionar Cartão
              </button>
            </Card>
          </div>

          {/* Metas */}
          <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Metas</h2>
                <div className="flex items-center gap-3">
                  <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="px-2 py-1 border rounded-md text-sm">
                    <option value={1}>Jan</option>
                    <option value={2}>Fev</option>
                    <option value={3}>Mar</option>
                    <option value={4}>Abr</option>
                    <option value={5}>Mai</option>
                    <option value={6}>Jun</option>
                    <option value={7}>Jul</option>
                    <option value={8}>Ago</option>
                    <option value={9}>Set</option>
                    <option value={10}>Out</option>
                    <option value={11}>Nov</option>
                    <option value={12}>Dez</option>
                  </select>
                  <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value || '0'))} className="w-20 px-2 py-1 border rounded-md text-sm" />
                  <button
                    onClick={() => navigate('/objetivos')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap cursor-pointer"
                  >
                    Ver todas
                  </button>
                </div>
            </div>

            {budgets.length === 0 ? (
              <Card className="p-6 text-center">
                <i className="ri-flag-line text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-500 mb-4">Nenhuma meta cadastrada</p>
                <button
                  onClick={() => navigate('/planejamento')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Criar Meta
                </button>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="hidden md:flex items-center justify-between text-sm text-gray-500 px-3">
                  <div className="w-1/2 font-medium">Categoria</div>
                  <div className="w-1/6 text-right font-medium">Valor</div>
                  <div className="w-1/6 text-right font-medium">Gasto</div>
                  <div className="w-1/6 text-right font-medium">Status</div>
                </div>

                {budgets.slice(0, 3).map((b: any) => {
                  const cat = categories.find((c: any) => c.id === b.category_id) || null;
                  const planned = b.planned_amount || 0;
                  const spent = b.spent_amount || 0;
                  const progressPercent = Math.min(100, Math.round((spent / (planned || 1)) * 100));
                  const status = spent > planned ? 'Extrapolada' : (spent >= planned ? 'Atingida' : 'Em andamento');

                  return (
                    <Card key={b.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/planejamento')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-1/2">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: b.color || '#007AFF' }}>
                            <i className="ri-flag-line text-white"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{cat ? cat.name : b.name || 'Meta mensal'}</p>
                            <p className="text-xs text-gray-500">{b.month}/{b.year}</p>
                          </div>
                        </div>

                        <div className="w-1/6 text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(planned)}</p>
                        </div>

                        <div className="w-1/6 text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(spent)}</p>
                        </div>

                        <div className="w-1/6 text-right">
                          <p className={`font-semibold ${status === 'Extrapolada' ? 'text-[#FF4D4F]' : status === 'Atingida' ? 'text-[#34C759]' : 'text-gray-500'}`}>{status}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {budgets.length > 3 && (
                  <button
                    onClick={() => navigate('/planejamento')}
                    className="w-full py-3 text-purple-600 hover:text-purple-700 font-medium text-sm whitespace-nowrap cursor-pointer"
                  >
                    Ver mais {budgets.length - 3} meta(s)
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
