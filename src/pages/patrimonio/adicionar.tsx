import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const assetTypes = [
  { id: 'real_estate', name: 'Casa', icon: 'ri-home-4-line', color: 'from-orange-500 to-orange-600' },
  { id: 'real_estate', name: 'Apartamento', icon: 'ri-building-line', color: 'from-blue-500 to-blue-600' },
  { id: 'vehicle', name: 'Carro', icon: 'ri-car-line', color: 'from-red-500 to-red-600' },
  { id: 'vehicle', name: 'Moto', icon: 'ri-motorbike-line', color: 'from-purple-500 to-purple-600' },
  { id: 'real_estate', name: 'Terreno', icon: 'ri-landscape-line', color: 'from-green-500 to-green-600' },
  { id: 'real_estate', name: 'Imóvel Comercial', icon: 'ri-store-line', color: 'from-teal-500 to-teal-600' },
  { id: 'vehicle', name: 'Barco', icon: 'ri-sailboat-line', color: 'from-cyan-500 to-cyan-600' },
  { id: 'other', name: 'Joia', icon: 'ri-vip-diamond-line', color: 'from-pink-500 to-pink-600' },
  { id: 'other', name: 'Obra de Arte', icon: 'ri-palette-line', color: 'from-indigo-500 to-indigo-600' },
  { id: 'other', name: 'Eletrônico', icon: 'ri-smartphone-line', color: 'from-gray-500 to-gray-600' },
  { id: 'other', name: 'Móvel', icon: 'ri-sofa-line', color: 'from-amber-500 to-amber-600' },
  { id: 'other', name: 'Outro', icon: 'ri-archive-line', color: 'from-slate-500 to-slate-600' },
];

export default function AdicionarPatrimonio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    purchase_value: '',
    estimated_value: '',
    purchase_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedType) return;

    setLoading(true);

    try {
      const selectedAssetType = assetTypes.find(t => t.name === selectedType);
      
      const { error } = await supabase
        .from('assets')
        .insert([{
          user_id: user.id,
          type: selectedAssetType?.id || 'other',
          name: formData.name,
          notes: formData.notes || null,
          purchase_value: parseFloat(formData.purchase_value) || null,
          estimated_value: parseFloat(formData.estimated_value),
          purchase_date: formData.purchase_date || null,
          icon: selectedAssetType?.icon || 'ri-archive-line',
          color: selectedAssetType?.color || 'from-gray-500 to-gray-600'
        }]);

      if (error) throw error;

      navigate('/patrimonio');
    } catch (error) {
      console.error('Erro ao adicionar patrimônio:', error);
      alert('Erro ao adicionar patrimônio');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTypeData = () => {
    return assetTypes.find(t => t.name === selectedType);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/patrimonio')}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
          <h1 className="text-xl font-bold">Adicionar Patrimônio</h1>
        </div>
        <p className="text-sm text-white/80">
          Cadastre seus bens e ativos
        </p>
      </header>

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Tipo de Patrimônio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {assetTypes.map((type, index) => (
                <button
                  key={`${type.id}-${index}`}
                  type="button"
                  onClick={() => setSelectedType(type.name)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all cursor-pointer ${
                    selectedType === type.name
                      ? 'bg-white shadow-lg ring-2 ring-[#FF9500]'
                      : 'bg-white shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <i className={`${type.icon} text-white text-xl w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulário */}
          {selectedType && (
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSelectedTypeData()?.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <i className={`${getSelectedTypeData()?.icon} text-white text-xl w-6 h-6 flex items-center justify-center`}></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo selecionado</p>
                  <p className="font-semibold text-gray-900">{getSelectedTypeData()?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Bem *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Ex: Apartamento Centro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none transition-all text-sm resize-none"
                  placeholder="Detalhes adicionais sobre o bem"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor de Compra
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.purchase_value}
                      onChange={(e) => setFormData({ ...formData, purchase_value: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none transition-all text-sm"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Estimado *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none transition-all text-sm"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Aquisição
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/patrimonio')}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedType}
              className="flex-1 bg-[#FF9500] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              {loading ? 'Salvando...' : 'Salvar Patrimônio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
