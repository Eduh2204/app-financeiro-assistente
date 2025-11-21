import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Transaction {
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

interface AddTransactionProps {
  onAddTransaction: (transaction: Transaction) => void;
  categories: Category[];
}

const transactionSchema = z.object({
  amount: z.string().min(1, 'Valor é obrigatório'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function AddTransaction({ onAddTransaction, categories }: AddTransactionProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const selectedType = watch('type');

  const onSubmit = (data: TransactionFormData) => {
    onAddTransaction({
      ...data,
      categoryId: parseInt(data.categoryId),
      amount: parseFloat(data.amount),
    });
    reset({
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const filteredCategories = categories.filter(cat => cat.type === selectedType);

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">Adicionar Transação</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="type" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Transação</Label>
          <RadioGroup
            onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
            defaultValue="expense"
            className="flex space-x-4 mt-3"
          >
            <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg border-2 border-transparent has-[:checked]:border-green-500 transition-all">
              <RadioGroupItem value="income" id="income" />
              <Label htmlFor="income" className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">Receita</Label>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border-2 border-transparent has-[:checked]:border-red-500 transition-all">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense" className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">Despesa</Label>
            </div>
          </RadioGroup>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoria</Label>
          <Select onValueChange={(value) => setValue('categoryId', value)} disabled={!selectedType}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Valor (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount')}
            placeholder="0.00"
            className="mt-2"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descrição</Label>
          <Input
            id="description"
            {...register('description')}
            placeholder="Ex: Compras do mês, Pagamento freelance..."
            className="mt-2"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            className="mt-2"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
          Adicionar Transação
        </Button>
      </form>
    </div>
  );
}
