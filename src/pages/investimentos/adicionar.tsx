import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Dados das principais criptomoedas
const topCryptos = [
  'Bitcoin (BTC)', 'Ethereum (ETH)', 'Tether (USDT)', 'BNB (BNB)', 'XRP (XRP)',
  'USDC (USDC)', 'Cardano (ADA)', 'Dogecoin (DOGE)', 'Solana (SOL)', 'TRON (TRX)',
  'Polkadot (DOT)', 'Polygon (MATIC)', 'Litecoin (LTC)', 'Shiba Inu (SHIB)', 'Avalanche (AVAX)',
  'Dai (DAI)', 'Wrapped Bitcoin (WBTC)', 'Chainlink (LINK)', 'Uniswap (UNI)', 'Cosmos (ATOM)',
  'Monero (XMR)', 'Ethereum Classic (ETC)', 'Bitcoin Cash (BCH)', 'Stellar (XLM)', 'Filecoin (FIL)',
  'Internet Computer (ICP)', 'Hedera (HBAR)', 'Aptos (APT)', 'VeChain (VET)', 'Algorand (ALGO)',
  'Near Protocol (NEAR)', 'Quant (QNT)', 'The Graph (GRT)', 'Fantom (FTM)', 'Aave (AAVE)',
  'Elrond (EGLD)', 'Theta Network (THETA)', 'Axie Infinity (AXS)', 'EOS (EOS)', 'Tezos (XTZ)',
  'Flow (FLOW)', 'The Sandbox (SAND)', 'Decentraland (MANA)', 'Chiliz (CHZ)', 'Enjin Coin (ENJ)',
  'Maker (MKR)', 'BitTorrent (BTT)', 'PancakeSwap (CAKE)', 'Curve DAO (CRV)', 'Compound (COMP)',
  'Synthetix (SNX)', 'Zilliqa (ZIL)', 'Kusama (KSM)', 'Dash (DASH)', 'Zcash (ZEC)',
  'Waves (WAVES)', 'Mina (MINA)', 'Kava (KAVA)', 'Harmony (ONE)', 'Celo (CELO)',
  'Ravencoin (RVN)', 'Sushi (SUSHI)', '1inch (1INCH)', 'Loopring (LRC)', 'Ankr (ANKR)',
  'Basic Attention Token (BAT)', 'OMG Network (OMG)', 'Qtum (QTUM)', 'IOTA (MIOTA)', 'NEM (XEM)',
  'Holo (HOT)', 'Nexo (NEXO)', 'Arweave (AR)', 'Stacks (STX)', 'Helium (HNT)',
  'Convex Finance (CVX)', 'Gala (GALA)', 'Immutable X (IMX)', 'Render Token (RNDR)', 'Injective (INJ)',
  'Optimism (OP)', 'Arbitrum (ARB)', 'Lido DAO (LDO)', 'Rocket Pool (RPL)', 'Frax (FRAX)',
  'GMX (GMX)', 'dYdX (DYDX)', 'Blur (BLUR)', 'Pepe (PEPE)', 'Floki Inu (FLOKI)',
  'Bonk (BONK)', 'Worldcoin (WLD)', 'Sei (SEI)', 'Celestia (TIA)', 'Sui (SUI)',
  'Kaspa (KAS)', 'Starknet (STRK)', 'Mantle (MNT)', 'Pendle (PENDLE)', 'Jupiter (JUP)'
];

// Principais ações da B3
const topStocks = [
  'PETR4 - Petrobras PN', 'VALE3 - Vale ON', 'ITUB4 - Itaú Unibanco PN', 'BBDC4 - Bradesco PN',
  'ABEV3 - Ambev ON', 'BBAS3 - Banco do Brasil ON', 'WEGE3 - WEG ON', 'RENT3 - Localiza ON',
  'SUZB3 - Suzano ON', 'RAIL3 - Rumo ON', 'JBSS3 - JBS ON', 'B3SA3 - B3 ON',
  'MGLU3 - Magazine Luiza ON', 'LREN3 - Lojas Renner ON', 'RADL3 - Raia Drogasil ON',
  'HAPV3 - Hapvida ON', 'VIVT3 - Telefônica Brasil ON', 'ELET3 - Eletrobras ON',
  'CMIG4 - Cemig PN', 'CPLE6 - Copel PNB', 'GGBR4 - Gerdau PN', 'CSNA3 - CSN ON',
  'USIM5 - Usiminas PNA', 'GOAU4 - Metalúrgica Gerdau PN', 'KLBN11 - Klabin Unit',
  'EMBR3 - Embraer ON', 'AZUL4 - Azul PN', 'GOLL4 - Gol PN', 'CIEL3 - Cielo ON',
  'PRIO3 - Prio ON', 'CSAN3 - Cosan ON', 'RAIZ4 - Raízen PN', 'UGPA3 - Ultrapar ON',
  'BRFS3 - BRF ON', 'MRFG3 - Marfrig ON', 'BEEF3 - Minerva ON', 'SLCE3 - SLC Agrícola ON',
  'ARZZ3 - Arezzo ON', 'SOMA3 - Grupo Soma ON', 'PETZ3 - Petz ON', 'VIIA3 - Via ON',
  'AMER3 - Americanas ON', 'ASAI3 - Assaí ON', 'CRFB3 - Carrefour Brasil ON',
  'PCAR3 - Grupo Pão de Açúcar ON', 'NTCO3 - Natura ON', 'TOTS3 - TOTVS ON',
  'LWSA3 - Locaweb ON', 'POSI3 - Positivo ON', 'QUAL3 - Qualicorp ON'
];

// Opções de Renda Fixa
const fixedIncomeOptions = [
  { name: 'Tesouro Selic', rate: '100% Selic', currentRate: '13,75% a.a.' },
  { name: 'Tesouro Prefixado', rate: 'Taxa fixa', currentRate: '12,50% a.a.' },
  { name: 'Tesouro IPCA+', rate: 'IPCA +', currentRate: 'IPCA + 6,50% a.a.' },
  { name: 'CDB', rate: '100% CDI', currentRate: '13,65% a.a.' },
  { name: 'CDB', rate: '110% CDI', currentRate: '15,02% a.a.' },
  { name: 'CDB', rate: '120% CDI', currentRate: '16,38% a.a.' },
  { name: 'CDB', rate: '130% CDI', currentRate: '17,75% a.a.' },
  { name: 'LCI', rate: '90% CDI', currentRate: '12,29% a.a.' },
  { name: 'LCA', rate: '90% CDI', currentRate: '12,29% a.a.' },
  { name: 'LC', rate: '115% CDI', currentRate: '15,70% a.a.' },
  { name: 'Debênture', rate: 'IPCA +', currentRate: 'IPCA + 7,00% a.a.' },
  { name: 'CRI', rate: 'IPCA +', currentRate: 'IPCA + 6,80% a.a.' },
  { name: 'CRA', rate: 'IPCA +', currentRate: 'IPCA + 6,80% a.a.' }
];

// Fundos de Investimento
const fundsOptions = [
  'Fundo DI', 'Fundo Renda Fixa', 'Fundo Multimercado', 'Fundo de Ações',
  'Fundo Cambial', 'Fundo Imobiliário (FII)', 'ETF Ibovespa (BOVA11)',
  'ETF S&P 500 (IVVB11)', 'ETF Small Caps (SMAL11)', 'Fundo de Previdência',
  'Fundo de Investimento em Direitos Creditórios (FIDC)', 'Fundo de Investimento em Participações (FIP)'
];

// Tipos de Imóveis
const realEstateOptions = [
  'Apartamento', 'Casa', 'Terreno', 'Sala Comercial', 'Loja',
  'Galpão Industrial', 'Chácara', 'Fazenda', 'Cobertura', 'Kitnet'
];

export default function AdicionarInvestimento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks',
    amount: '',
    current_value: '',
    ticker: '',
    quantity: '',
    rate: '',
    currentRate: ''
  });

  const types = [
    { value: 'stocks', label: 'Ações', icon: 'ri-line-chart-line' },
    { value: 'crypto', label: 'Criptomoedas', icon: 'ri-bit-coin-line' },
    { value: 'fixed_income', label: 'Renda Fixa', icon: 'ri-money-dollar-circle-line' },
    { value: 'variable_income', label: 'Renda Variável', icon: 'ri-stock-line' },
    { value: 'funds', label: 'Fundos', icon: 'ri-funds-line' },
    { value: 'real_estate', label: 'Imóveis', icon: 'ri-building-line' }
  ];

  // Filtrar opções baseado no tipo selecionado
  const getFilteredOptions = () => {
    let options: any[] = [];
    
    switch (formData.type) {
      case 'crypto':
        options = topCryptos;
        break;
      case 'stocks':
        options = topStocks;
        break;
      case 'fixed_income':
        options = fixedIncomeOptions;
        break;
      case 'funds':
        options = fundsOptions;
        break;
      case 'real_estate':
        options = realEstateOptions;
        break;
      default:
        return [];
    }

    if (!searchTerm) return options;

    return options.filter((option: any) => {
      const searchText = typeof option === 'string' ? option : option.name;
      return searchText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleSelectOption = (option: any) => {
    if (formData.type === 'fixed_income') {
      setFormData({
        ...formData,
        name: option.name,
        rate: option.rate,
        currentRate: option.currentRate,
        ticker: ''
      });
    } else if (formData.type === 'crypto') {
      const ticker = option.match(/\(([^)]+)\)/)?.[1] || '';
      setFormData({
        ...formData,
        name: option,
        ticker: ticker
      });
    } else if (formData.type === 'stocks') {
      const ticker = option.split(' - ')[0];
      setFormData({
        ...formData,
        name: option,
        ticker: ticker
      });
    } else {
      setFormData({
        ...formData,
        name: option,
        ticker: ''
      });
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let notes = '';
      if (formData.ticker) notes += `Ticker: ${formData.ticker}`;
      if (formData.quantity) notes += `${notes ? ' | ' : ''}Quantidade: ${formData.quantity}`;
      if (formData.rate) notes += `${notes ? ' | ' : ''}Taxa: ${formData.rate}`;
      if (formData.currentRate) notes += `${notes ? ' | ' : ''}Rentabilidade: ${formData.currentRate}`;

      const { error } = await supabase
        .from('investments')
        .insert([{
          user_id: user?.id,
          name: formData.name,
          type: formData.type,
          invested_amount: parseFloat(formData.amount),
          current_value: parseFloat(formData.current_value || formData.amount),
          purchase_date: new Date().toISOString().split('T')[0],
          notes: notes || null
        }]);

      if (error) throw error;

      navigate('/investimentos');
    } catch (error: any) {
      console.error('Erro ao adicionar investimento:', error);
      alert('Erro ao adicionar investimento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-6">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white px-5 pt-12 pb-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Adicionar Investimento</h1>
        </div>
      </header>

      {/* Formulário */}
      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Investimento */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Investimento
            </label>
            <div className="grid grid-cols-2 gap-3">
              {types.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setFormData({ 
                      ...formData, 
                      type: type.value,
                      name: '',
                      ticker: '',
                      rate: '',
                      currentRate: ''
                    });
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.type === type.value
                      ? 'border-[#007AFF] bg-[#007AFF]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <i className={`${type.icon} text-2xl w-6 h-6 flex items-center justify-center mx-auto mb-1`}></i>
                  <p className="text-xs text-center text-gray-600">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Ativo */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.type === 'crypto' && 'Selecione a Criptomoeda'}
              {formData.type === 'stocks' && 'Selecione a Ação'}
              {formData.type === 'fixed_income' && 'Selecione o Título'}
              {formData.type === 'funds' && 'Selecione o Fundo'}
              {formData.type === 'real_estate' && 'Tipo de Imóvel'}
              {formData.type === 'variable_income' && 'Nome do Investimento'}
            </label>
            
            {formData.type !== 'variable_income' ? (
              <>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm"
                  placeholder={`Buscar ${types.find(t => t.value === formData.type)?.label.toLowerCase()}...`}
                />
                
                {showDropdown && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-xl bg-white">
                    {getFilteredOptions().length > 0 ? (
                      getFilteredOptions().map((option: any, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectOption(option)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          {formData.type === 'fixed_income' ? (
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{option.name}</div>
                              <div className="text-xs text-gray-500">{option.rate} - {option.currentRate}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-900">{option}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        Nenhum resultado encontrado
                      </div>
                    )}
                  </div>
                )}

                {formData.name && (
                  <div className="mt-3 p-3 bg-[#007AFF]/10 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{formData.name}</div>
                        {formData.rate && (
                          <div className="text-xs text-gray-600 mt-1">
                            {formData.rate} - {formData.currentRate}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, name: '', ticker: '', rate: '', currentRate: '' })}
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm"
                placeholder="Ex: COE, Opções, Futuros..."
                required
              />
            )}
          </div>

          {/* Ticker/Código - Apenas para Renda Variável */}
          {formData.type === 'variable_income' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticker/Código (opcional)
              </label>
              <input
                type="text"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm uppercase"
                placeholder="Ex: WINJ24, PETRF25..."
              />
            </div>
          )}

          {/* Quantidade */}
          {(formData.type === 'crypto' || formData.type === 'stocks' || formData.type === 'variable_income') && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade {formData.type === 'crypto' || formData.type === 'variable_income' ? '(opcional)' : ''}
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm"
                placeholder={
                  formData.type === 'crypto' ? 'Ex: 0.5 BTC, 10 ETH...' :
                  formData.type === 'stocks' ? 'Ex: 100 ações...' :
                  'Ex: 10 contratos...'
                }
              />
            </div>
          )}

          {/* Valor Investido */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Investido
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Valor Atual */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Atual (opcional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="number"
                step="0.01"
                value={formData.current_value}
                onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007AFF] focus:border-transparent outline-none transition-all text-sm"
                placeholder="Deixe vazio para usar o valor investido"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Se não souber o valor atual, deixe em branco. Você poderá atualizar depois.
            </p>
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            disabled={loading || !formData.name}
            className="w-full bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Salvando...' : 'Adicionar Investimento'}
          </button>
        </form>
      </div>
    </div>
  );
}
