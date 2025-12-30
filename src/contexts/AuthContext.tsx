import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          // Limpar sessão inválida
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token atualizado');
      }
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) throw error;
    
    // Criar perfil do usuário
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
      });
      
      // Criar categorias padrão
      await createDefaultCategories(data.user.id);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estado local
      setSession(null);
      setUser(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Criar categorias padrão para novos usuários
async function createDefaultCategories(userId: string) {
  const defaultCategories = [
    // Receitas
    { name: 'Salário', type: 'income', icon: 'ri-money-dollar-circle-line', color: '#34C759' },
    { name: 'Freelance', type: 'income', icon: 'ri-briefcase-line', color: '#34C759' },
    { name: 'Investimentos', type: 'income', icon: 'ri-line-chart-line', color: '#34C759' },
    { name: 'Outros', type: 'income', icon: 'ri-add-circle-line', color: '#34C759' },
    
    // Despesas
    { name: 'Alimentação', type: 'expense', icon: 'ri-restaurant-line', color: '#FF4D4F' },
    { name: 'Transporte', type: 'expense', icon: 'ri-car-line', color: '#FF4D4F' },
    { name: 'Moradia', type: 'expense', icon: 'ri-home-line', color: '#FF4D4F' },
    { name: 'Saúde', type: 'expense', icon: 'ri-heart-pulse-line', color: '#FF4D4F' },
    { name: 'Educação', type: 'expense', icon: 'ri-book-line', color: '#FF4D4F' },
    { name: 'Lazer', type: 'expense', icon: 'ri-gamepad-line', color: '#FF4D4F' },
    { name: 'Compras', type: 'expense', icon: 'ri-shopping-bag-line', color: '#FF4D4F' },
    { name: 'Contas', type: 'expense', icon: 'ri-file-list-line', color: '#FF4D4F' },
    { name: 'Outros', type: 'expense', icon: 'ri-more-line', color: '#FF4D4F' },
  ];

  await supabase.from('categories').insert(
    defaultCategories.map(cat => ({ ...cat, user_id: userId }))
  );
}
