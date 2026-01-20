import { useState, useEffect } from 'react'
import Card from '../components/Card'
import api from '../services/api'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Wallet, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [investments, setInvestments] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const now = new Date()
      const [summaryData, investmentsData, subscriptionsData] = await Promise.all([
        api.getTransactionsSummary({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        }),
        api.getInvestments(),
        api.getSubscriptions(),
      ])
      setSummary(summaryData)
      setInvestments(investmentsData)
      setSubscriptions(subscriptionsData)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const totalInvestments = investments.reduce((sum, inv) => sum + (inv.estimatedValue || 0), 0)
  const patrimony = (summary?.balance || 0) + totalInvestments

  const subscriptionCategoryTotals = subscriptions.reduce((acc, sub) => {
    const key = sub.category || 'SEM_CATEGORIA'
    acc[key] = (acc[key] || 0) + (sub.amount || 0)
    return acc
  }, {})

  const subscriptionCategoryLabels = {
    LAZER: 'Lazer',
    STREAMING: 'Streaming',
    IA: 'IA',
    TRABALHO: 'Trabalho',
    SEM_CATEGORIA: 'Sem categoria',
  }

  const subscriptionCategoryData = Object.entries(subscriptionCategoryTotals).map(([name, value]) => ({
    name: subscriptionCategoryLabels[name] || name,
    value,
  }))

  const subscriptionTotal = subscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0)

  const categoryData = summary?.expensesByCategory
    ? Object.entries(summary.expensesByCategory).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visao geral das suas financas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receitas"
          value={summary?.totalIncome || 0}
          icon={<TrendingUp className="text-green-600" />}
          color="green"
        />
        <StatCard
          title="Despesas"
          value={summary?.totalExpense || 0}
          icon={<TrendingDown className="text-red-600" />}
          color="red"
        />
        <StatCard
          title="Saldo do Mes"
          value={summary?.balance || 0}
          icon={<Wallet className="text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Patrimonio Estimado"
          value={patrimony}
          icon={<DollarSign className="text-purple-600" />}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Despesas por Categoria">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">Nenhuma despesa categorizada este mes</p>
          )}
        </Card>

        <Card title="Despesas: Fixas vs Variaveis">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Fixas', value: summary?.fixedExpenses || 0 },
                { name: 'Variaveis', value: summary?.variableExpenses || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Assinaturas por Categoria">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{subscriptions.length}</span> assinaturas ativas
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="text-primary-600" size={18} />
            <span>
              Total mensal: <span className="font-semibold text-gray-900">R$ {subscriptionTotal.toFixed(2)}</span>
            </span>
          </div>
        </div>

        {subscriptionCategoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subscriptionCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">Nenhuma assinatura cadastrada</p>
        )}
      </Card>

      {investments.length > 0 && (
        <Card title="Investimentos">
          <div className="space-y-3">
            {investments.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{inv.name}</p>
                  <p className="text-sm text-gray-600">{inv.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">
                    R$ {inv.estimatedValue?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-500">{inv.monthsSinceStart} meses</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
  }

  return (
    <div className={`card ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">R$ {value.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-white rounded-lg">{icon}</div>
      </div>
    </div>
  )
}
