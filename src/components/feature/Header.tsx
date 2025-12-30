
import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  title?: string;
  showMonthSelector?: boolean;
  largeLogo?: boolean;
}

export default function Header({ title, showMonthSelector = false, largeLogo = false }: HeaderProps) {
  const [selectedMonth, setSelectedMonth] = useState('Dezembro 2024');
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user, signOut } = useAuth();

  const getFirstName = () => {
    const full = (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.full_name;
    if (full && typeof full === 'string') return full.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return '';
  };
  const firstName = getFirstName();

  const months = [
    'Janeiro 2024', 'Fevereiro 2024', 'Março 2024', 'Abril 2024',
    'Maio 2024', 'Junho 2024', 'Julho 2024', 'Agosto 2024',
    'Setembro 2024', 'Outubro 2024', 'Novembro 2024', 'Dezembro 2024'
  ];

  return (
    <header className="bg-white text-gray-900 px-6 pt-5 pb-2 rounded-b-3xl shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-6">
          <img
            src="https://static.readdy.ai/image/32e34e04a919b9271ef3ff4f79b7fd86/739492c7d57166e7909ba9a7593d80a6.png"
            alt="Meu Bolso"
            className={"w-auto transition-transform " + (largeLogo ? 'h-24' : 'h-12')}
          />
          {showMonthSelector ? (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-base font-semibold whitespace-nowrap cursor-pointer"
              >
                <span>{title}</span>
                <i className={`ri-arrow-down-s-line text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
              </button>
            </div>
          ) : (
            <div className="ml-1">
              <h1 className="text-lg font-semibold">{title || (firstName ? `Bem-vindo, ${firstName}` : 'Bem-vindo de volta')}</h1>
              {largeLogo && (
                <p className="text-sm text-gray-500 mt-1">Veja seu saldo e metas rapidamente</p>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <i className="ri-notification-3-line text-lg"></i>
            </button>
            <button
              onClick={() => setShowProfileMenu((s) => !s)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
              title="Conta"
            >
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="ri-user-line text-lg"></i>
              )}
            </button>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  if (!user?.email) return alert('Usuário não identificado');
                  try {
                    const { data, error } = await supabase.auth.resetPasswordForEmail(user.email);
                    if (error) throw error;
                    alert('E-mail de redefinição enviado. Verifique sua caixa de entrada.');
                  } catch (err) {
                    console.error(err);
                    alert('Erro ao enviar e-mail de redefinição.');
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                Redefinir senha
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  // trigger file input
                  setTimeout(() => fileInputRef.current?.click(), 50);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                Alterar foto
              </button>

              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  try {
                    await signOut();
                  } catch (err) {
                    console.error('Erro ao deslogar', err);
                  }
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
              >
                Sair
              </button>
            </div>
          )}

          {/* hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !user) return;
              setUploading(true);
              try {
                const ext = file.name.split('.').pop();
                const filePath = `avatars/${user.id}/${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { cacheControl: '3600', upsert: true });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                const publicUrl = data.publicUrl;

                // update auth metadata
                const { error: authError } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
                if (authError) console.warn('auth.updateUser error', authError.message || authError);

                // update profiles table if exists
                const { error: profileError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
                if (profileError) console.warn('profiles update error', profileError.message || profileError);

                // reload page or signal change
                window.location.reload();
              } catch (err) {
                console.error('Erro ao enviar avatar', err);
                alert('Erro ao atualizar foto de perfil');
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
      </div>

      {showMonthSelector && isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute z-50 w-56 max-w-full">
            <div className="bg-white rounded-xl shadow-xl w-56 max-h-64 overflow-y-auto">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => {
                    setSelectedMonth(month);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap ${
                    selectedMonth === month ? 'text-[#7C3AED] font-semibold' : 'text-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      
    </header>
  );
}
