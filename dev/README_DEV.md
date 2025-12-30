**Instruções de Desenvolvimento — Relaxar RLS (AVISO: usar somente em dev)**

O projeto usa Row-Level Security (RLS) no Supabase. Em ambientes de desenvolvimento pode ser útil permitir acesso amplo para testes locais.

Arquivos
- `dev/relax_policies.sql`: SQL que cria políticas permissivas (SELECT/INSERT/UPDATE/DELETE) para as tabelas principais.

Como usar
1. Abra o Supabase Console do seu projeto.
2. Vá em **SQL Editor**.
3. Copie o conteúdo de `dev/relax_policies.sql` e cole no editor.
4. Clique em **Run**.

Advertências
- NUNCA execute esse SQL em produção. Ele concede acesso amplo às tabelas.
- Após testes, REMOVA as políticas com `DROP POLICY` ou desative RLS com `ALTER TABLE ... DISABLE ROW LEVEL SECURITY`.

Reverter (exemplo)
```sql
DROP POLICY IF EXISTS "dev_full_access_profiles" ON public.profiles;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

Se preferir, execute apenas os INSERTs/UPDATES necessários no SQL Editor em vez de afrouxar as políticas.
