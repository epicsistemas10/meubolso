export const dashboardStats = {
  saldoAtual: 15847.32,
  receitasMes: 8500.00,
  despesasMes: 4235.68,
  resultadoMensal: 4264.32,
  patrimonioTotal: 285000.00,
  investimentosTotal: 45000.00
};

export const transacoes = [
  { id: 1, tipo: 'receita', descricao: 'Salário', valor: 7500.00, categoria: 'Salário', data: '2025-01-05', conta: 'Conta Corrente', formaPagamento: 'Transferência' },
  { id: 2, tipo: 'receita', descricao: 'Freelance', valor: 1000.00, categoria: 'Trabalho Extra', data: '2025-01-10', conta: 'Conta Corrente', formaPagamento: 'PIX' },
  { id: 3, tipo: 'despesa', descricao: 'Aluguel', valor: 1500.00, categoria: 'Moradia', data: '2025-01-05', conta: 'Conta Corrente', formaPagamento: 'Transferência' },
  { id: 4, tipo: 'despesa', descricao: 'Supermercado', valor: 650.00, categoria: 'Alimentação', data: '2025-01-08', conta: 'Cartão de Crédito', formaPagamento: 'Crédito' },
  { id: 5, tipo: 'despesa', descricao: 'Conta de Luz', valor: 185.50, categoria: 'Contas', data: '2025-01-12', conta: 'Conta Corrente', formaPagamento: 'Débito Automático' },
  { id: 6, tipo: 'despesa', descricao: 'Internet', valor: 99.90, categoria: 'Contas', data: '2025-01-15', conta: 'Conta Corrente', formaPagamento: 'Débito Automático' },
  { id: 7, tipo: 'despesa', descricao: 'Academia', valor: 120.00, categoria: 'Saúde', data: '2025-01-10', conta: 'Cartão de Crédito', formaPagamento: 'Crédito' },
  { id: 8, tipo: 'despesa', descricao: 'Restaurante', valor: 280.00, categoria: 'Alimentação', data: '2025-01-18', conta: 'Cartão de Crédito', formaPagamento: 'Crédito' },
  { id: 9, tipo: 'despesa', descricao: 'Combustível', valor: 350.00, categoria: 'Transporte', data: '2025-01-20', conta: 'Cartão de Crédito', formaPagamento: 'Crédito' },
  { id: 10, tipo: 'despesa', descricao: 'Streaming', valor: 45.90, categoria: 'Lazer', data: '2025-01-22', conta: 'Cartão de Crédito', formaPagamento: 'Crédito' },
  { id: 11, tipo: 'receita', descricao: 'Dividendos', valor: 250.00, categoria: 'Investimentos', data: '2025-01-25', conta: 'Conta Investimentos', formaPagamento: 'Transferência' },
  { id: 12, tipo: 'despesa', descricao: 'Farmácia', valor: 125.38, categoria: 'Saúde', data: '2025-01-26', conta: 'Cartão de Débito', formaPagamento: 'Débito' }
];

export const categorias = [
  { nome: 'Alimentação', cor: '#FF6B6B', icon: 'ri-restaurant-line' },
  { nome: 'Moradia', cor: '#4ECDC4', icon: 'ri-home-line' },
  { nome: 'Transporte', cor: '#45B7D1', icon: 'ri-car-line' },
  { nome: 'Saúde', cor: '#96CEB4', icon: 'ri-heart-pulse-line' },
  { nome: 'Lazer', cor: '#FFEAA7', icon: 'ri-gamepad-line' },
  { nome: 'Contas', cor: '#DFE6E9', icon: 'ri-file-list-line' },
  { nome: 'Salário', cor: '#2ECC71', icon: 'ri-money-dollar-circle-line' },
  { nome: 'Trabalho Extra', cor: '#27AE60', icon: 'ri-briefcase-line' },
  { nome: 'Investimentos', cor: '#7A3FF2', icon: 'ri-line-chart-line' }
];

export const metas = [
  { id: 1, categoria: 'Alimentação', orcamento: 1000.00, gasto: 930.00, percentual: 93 },
  { id: 2, categoria: 'Transporte', orcamento: 500.00, gasto: 350.00, percentual: 70 },
  { id: 3, categoria: 'Lazer', orcamento: 300.00, gasto: 45.90, percentual: 15 },
  { id: 4, categoria: 'Saúde', orcamento: 400.00, gasto: 245.38, percentual: 61 },
  { id: 5, categoria: 'Contas', orcamento: 800.00, gasto: 285.40, percentual: 36 },
  { id: 6, categoria: 'Moradia', orcamento: 1500.00, gasto: 1500.00, percentual: 100 }
];

export const despesasPorCategoria = [
  { categoria: 'Moradia', valor: 1500.00, percentual: 35.4 },
  { categoria: 'Alimentação', valor: 930.00, percentual: 22.0 },
  { categoria: 'Transporte', valor: 350.00, percentual: 8.3 },
  { categoria: 'Contas', valor: 285.40, percentual: 6.7 },
  { categoria: 'Saúde', valor: 245.38, percentual: 5.8 },
  { categoria: 'Lazer', valor: 45.90, percentual: 1.1 }
];

export const evolucaoMensal = [
  { mes: 'Jul', receitas: 7200, despesas: 4800 },
  { mes: 'Ago', receitas: 7500, despesas: 5200 },
  { mes: 'Set', receitas: 8000, despesas: 4500 },
  { mes: 'Out', receitas: 7800, despesas: 5000 },
  { mes: 'Nov', receitas: 8200, despesas: 4300 },
  { mes: 'Dez', receitas: 9500, despesas: 6200 },
  { mes: 'Jan', receitas: 8500, despesas: 4235.68 }
];
