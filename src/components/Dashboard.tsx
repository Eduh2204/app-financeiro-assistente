import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  categoryId: number;
  description: string;
  date: string;
}

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
}

export function Dashboard({ transactions, categories }: DashboardProps) {
  // Dados para gráfico de pizza (despesas por categoria)
  const expenseData = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value: total };
    })
    .filter(item => item.value > 0);

  // Dados para gráfico de barras (receitas vs despesas por mês)
  const monthlyData = [];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  for (let i = 0; i < 12; i++) {
    const monthTransactions = transactions.filter(t => new Date(t.date).getMonth() === i);
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    monthlyData.push({ month: months[i], income, expense });
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">Receitas vs Despesas Mensais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200">Últimas Transações</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Data</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Descrição</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Tipo</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-10).reverse().map((transaction) => {
                const category = categories.find(c => c.id === transaction.categoryId);
                return (
                  <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                      {transaction.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {category ? category.name : 'N/A'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-right text-sm font-bold ${
                      transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      R$ {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
