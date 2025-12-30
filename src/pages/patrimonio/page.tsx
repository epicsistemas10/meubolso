import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

export default function Patrimonio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');

  useEffect(() => {
    loadAssets();
  }, [user]);

  const loadAssets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Erro ao carregar patrimônio:', error);
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

  const getTotalValue = () => {
    return assets.reduce((sum, asset) => {
      const v = asset.estimated_value ?? asset.current_value ?? asset.purchase_value ?? 0;
      return sum + (v || 0);
    }, 0);
  };

  const getTotalPurchaseValue = () => {
    return assets.reduce((sum, asset) => sum + (asset.purchase_value || 0), 0);
  };

  const getAppreciationPercentage = () => {
    const purchaseValue = getTotalPurchaseValue();
    if (purchaseValue === 0) return 0;
    const currentValue = getTotalValue();
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  };

  const handleSellAsset = async () => {
    if (!selectedAsset || !sellPrice) return;

    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', selectedAsset.id);

      if (error) throw error;

      // Registrar transação de venda
      const saleAmount = parseFloat(sellPrice.replace(',', '.'));
      await supabase.from('transactions').insert({
        user_id: user?.id,
        description: `Venda de ${selectedAsset.name}`,
        amount: saleAmount,
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        notes: `Venda de patrimônio - Valor de compra: ${formatCurrency(selectedAsset.purchase_value)}`
      });

      setShowSellModal(false);
      setSelectedAsset(null);
      setSellPrice('');
      loadAssets();
    } catch (error) {
      console.error('Erro ao vender patrimônio:', error);
      alert('Erro ao vender patrimônio. Tente novamente.');
    }
  };

  const getTypeIcon = (asset: any) => {
    return asset.icon || 'ri-archive-line';
  };

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      car: 'Carro',
      motorcycle: 'Moto',
      land: 'Terreno',
      commercial: 'Imóvel Comercial',
      boat: 'Barco',
      jewelry: 'Joia',
      art: 'Obra de Arte',
      electronics: 'Eletrônico',
      furniture: 'Móvel',
      other: 'Outro'
    };
    return types[type] || 'Bem';
  };

  const getTypeColor = (asset: any) => {
    return asset.color || 'from-gray-500 to-gray-600';
  };

  const appreciation = getAppreciationPercentage();
  const isPositive = appreciation >= 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <h1 className="text-2xl font-bold">Patrimônio</h1>
          </div>
          <button
            onClick={() => navigate('/patrimonio/adicionar')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {/* Valor Total */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-sm text-white/80 mb-2">Valor Total do Patrimônio</p>
          <p className="text-3xl font-bold">{formatCurrency(getTotalValue())}</p>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <div>
              <p className="text-xs text-white/70">Valor de Compra</p>
              <p className="text-sm font-semibold">{formatCurrency(getTotalPurchaseValue())}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/70">Valorização</p>
              <p className={`text-sm font-semibold ${isPositive ? 'text-[#34C759]' : 'text-[#FF4D4F]'}`}>
                {isPositive ? '+' : ''}{appreciation.toFixed(2)}%
              </p>
            </div>
          </div>
          
          <p className="text-xs text-white/80 mt-2">{assets.length} {assets.length === 1 ? 'bem cadastrado' : 'bens cadastrados'}</p>
        </div>
      </header>

      {/* Lista de Bens */}
      <div className="px-5 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#FF9500] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-home-4-line text-3xl text-gray-400 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhum bem cadastrado</p>
            <button
              onClick={() => navigate('/patrimonio/adicionar')}
              className="px-6 py-2 bg-[#FF9500] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
            >
              Adicionar Bem
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {assets.map((asset) => {
              const assetAppreciation = asset.purchase_value > 0 
                ? ((asset.current_value - asset.purchase_value) / asset.purchase_value) * 100 
                : 0;
              const assetIsPositive = assetAppreciation >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowSellModal(true);
                  }}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(asset)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <i className={`${getTypeIcon(asset)} text-white text-2xl w-6 h-6 flex items-center justify-center`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-base">{asset.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{getTypeName(asset.type)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 whitespace-nowrap text-base">
                            {formatCurrency(asset.current_value || 0)}
                          </p>
                          <p className={`text-xs font-medium ${assetIsPositive ? 'text-[#34C759]' : 'text-[#FF4D4F]'}`}>
                            {assetIsPositive ? '+' : ''}{assetAppreciation.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Compra: {formatCurrency(asset.purchase_value || 0)}</span>
                      </div>
                      {asset.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{asset.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Venda */}
      {showSellModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-0">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Vender Patrimônio</h3>
              <button
                onClick={() => {
                  setShowSellModal(false);
                  setSelectedAsset(null);
                  setSellPrice('');
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(selectedAsset)} rounded-xl flex items-center justify-center`}>
                  <i className={`${getTypeIcon(selectedAsset)} text-white text-xl`}></i>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedAsset.name}</p>
                  <p className="text-sm text-gray-500">{getTypeName(selectedAsset.type)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor de Compra:</span>
                  <span className="font-semibold">{formatCurrency(selectedAsset.purchase_value || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Atual:</span>
                  <span className="font-semibold">{formatCurrency(selectedAsset.current_value || 0)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor de Venda *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    R$
                  </span>
                  <input
                    type="text"
                    value={sellPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, '');
                      setSellPrice(value);
                    }}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9500] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSellModal(false);
                  setSelectedAsset(null);
                  setSellPrice('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancelar
              </button>
              <button
                onClick={handleSellAsset}
                disabled={!sellPrice}
                className="flex-1 px-6 py-3 bg-[#FF9500] text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Venda
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
