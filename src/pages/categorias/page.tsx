import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/feature/BottomNav';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export default function Categorias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'ri-price-tag-3-line',
    color: '#FF4D4F'
  });
  const [iconSearch, setIconSearch] = useState('');

  const iconOptions = [
    'ri-restaurant-line', 'ri-coffee-line', 'ri-food-2-line', 'ri-car-line', 'ri-bus-line', 'ri-truck-line',
    'ri-bicycle-line', 'ri-home-line', 'ri-building-2-line', 'ri-hotel-bed-line', 'ri-heart-pulse-line',
    'ri-stethoscope-line', 'ri-healing-line', 'ri-tools-line', 'ri-book-line', 'ri-gamepad-line',
    'ri-shopping-bag-line', 'ri-shopping-cart-line', 'ri-price-tag-3-line', 'ri-file-list-line',
    'ri-money-dollar-circle-line', 'ri-money-cny-box-line', 'ri-wallet-line', 'ri-bank-line', 'ri-briefcase-line',
    'ri-line-chart-line', 'ri-pie-chart-line', 'ri-gift-line', 'ri-plane-line', 'ri-smartphone-line',
    'ri-t-shirt-line', 'ri-movie-line', 'ri-cake-2-line', 'ri-coupon-2-line', 'ri-plant-line', 'ri-leaf-line',
    'ri-more-line'
  ];

  const colorOptions = [
    '#FF4D4F', '#FF3B30', '#FF6B00', '#FF9500', '#FFCC00', '#F59E0B',
    '#34C759', '#16A34A', '#10B981', '#84CC16', '#A3E635',
    '#00C7BE', '#06B6D4', '#0EA5E9', '#007AFF', '#2563EB',
    '#5856D6', '#6366F1', '#4F46E5', '#7C3AED', '#8B5CF6',
    '#AF52DE', '#F472B6', '#FB7185', '#FF2D55', '#A2845E', '#64748B', '#334155'
  ];

  const filteredIcons = iconOptions.filter(i => i.includes(iconSearch.toLowerCase()));

  const getContrastColor = (hex: string) => {
    try {
      const c = hex.replace('#', '');
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? '#000000' : '#FFFFFF';
    } catch (e) {
      return '#FFFFFF';
    }
  };

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category, type?: 'income' | 'expense') => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color
      });
      setModalType(category.type);
    } else {
      setEditingCategory(null);
      const t = type || 'expense';
      setModalType(t);
      setFormData({
        name: '',
        icon: 'ri-price-tag-3-line',
        color: t === 'income' ? '#34C759' : '#FF4D4F'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      icon: 'ri-price-tag-3-line',
      color: '#FF4D4F'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Atualizar categoria
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            icon: formData.icon,
            color: formData.color
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        // Criar nova categoria
        const { error } = await supabase
          .from('categories')
          .insert({
            user_id: user?.id,
            name: formData.name,
            type: modalType,
            icon: formData.icon,
            color: formData.color
          });

        if (error) throw error;
      }

      handleCloseModal();
      loadCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Tente novamente.');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria. Tente novamente.');
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <header className="bg-[#34C759] text-white px-5 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl w-6 h-6 flex items-center justify-center"></i>
            </button>
            <h1 className="text-2xl font-bold">Categorias</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-add-line text-2xl w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>
      </header>

      {/* Lista de Categorias: Despesas e Receitas */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Despesas</h2>
              <button onClick={() => handleOpenModal(undefined, 'expense')} className="text-sm text-gray-600 hover:text-gray-800">Adicionar</button>
            </div>
            {loading ? null : expenseCategories.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">Nenhuma categoria de despesa</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm divide-y">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color }}>
                        <i className={`${category.icon} text-lg`} style={{ color: getContrastColor(category.color) }}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">Despesa</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(category)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="ri-edit-line text-sm text-gray-600"></i>
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors">
                        <i className="ri-delete-bin-line text-sm text-red-500"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Receitas</h2>
              <button onClick={() => handleOpenModal(undefined, 'income')} className="text-sm text-gray-600 hover:text-gray-800">Adicionar</button>
            </div>
            {loading ? null : incomeCategories.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">Nenhuma categoria de receita</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm divide-y">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color }}>
                        <i className={`${category.icon} text-lg`} style={{ color: getContrastColor(category.color) }}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500">Receita</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(category)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                        <i className="ri-edit-line text-sm text-gray-600"></i>
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors">
                        <i className="ri-delete-bin-line text-sm text-red-500"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Removida a listagem duplicada — uso das listas por tipo acima */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 px-5 pb-5">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600 w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alimentação, Salário..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#34C759] text-sm"
                />
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ícone *
                </label>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Buscar ícone..."
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3"
                  />
                </div>

                <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto pr-2">
                  {filteredIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                        formData.icon === icon
                          ? 'ring-2 ring-offset-1 ring-[#34C759]'
                          : ''
                      }`}
                      style={{ backgroundColor: formData.icon === icon ? formData.color + '20' : 'transparent' }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: formData.icon === icon ? formData.color : 'transparent' }}>
                        <i className={`${icon} text-white text-lg w-5 h-5 flex items-center justify-center`}></i>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cor *
                </label>
                <div className="grid grid-cols-5 gap-2 items-center">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-12 h-12 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        formData.color === color ? 'ring-2 ring-offset-1 ring-gray-300' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.color === color && (
                        <i className="ri-check-line text-white text-xl w-5 h-5 flex items-center justify-center"></i>
                      )}
                    </button>
                  ))}
                  <div className="col-span-5 mt-2 flex items-center gap-2">
                    <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-10 h-10 p-0 border-0" />
                    <input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="px-2 py-2 border rounded-lg text-sm w-full" />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#34C759] text-white rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  {editingCategory ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
