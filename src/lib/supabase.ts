import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são obrigatórios');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          bank_name: string | null;
          account_type: string | null;
          balance: number;
          is_open_finance: boolean;
          icon: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          icon: string | null;
          color: string | null;
          created_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          category_id: string | null;
          type: 'income' | 'expense' | 'transfer';
          amount: number;
          description: string | null;
          date: string;
          payment_method: string | null;
          is_recurring: boolean;
          recurrence_type: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          month: number;
          year: number;
          planned_amount: number;
          spent_amount: number;
          created_at: string;
          updated_at: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'fixed_income' | 'stocks' | 'funds' | 'crypto' | 'other';
          invested_amount: number;
          current_value: number | null;
          return_percentage: number | null;
          purchase_date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'real_estate' | 'vehicle' | 'other';
          estimated_value: number;
          purchase_date: string | null;
          purchase_value: number | null;
          notes: string | null;
          icon: string | null;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
