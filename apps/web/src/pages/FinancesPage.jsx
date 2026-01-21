import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import Modal from '../components/Modal'
import api from '../services/api'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function FinancesPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    loadData()
  }, [filters])

  async function loadData() {
    try {
      setLoading(true)
      const [txData, catData] = await Promise.all([
        api.getTransactions(filters),
        api.getCategories(),
      ])
      setTransactions(txData)
      setCategories(catData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja remover esta transacao?')) return
    try {
      await api.deleteTransaction(id)
      loadData()
    } catch (error) {
      alert('Erro ao remover transacao')
    }
  }

  const columns = [
    {
      key: 'date',
      label: 'Data',
      render: (row) => new Date(row.date).toLocaleDateString('pt-BR'),
    },
    { key: 'title', label: 'Titulo' },
    {
      key: 'type',
      label: 'Tipo',
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {row.type === 'INCOME' ? 'Receita' : 'Despesa'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (row) => (
        <span className={row.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
          R$ {row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (row) => row.category?.name || '-',
    },
    {
      key: 'isFixed',
      label: 'Fixa',
      render: (row) => (row.isFixed ? 'Sim' : 'Nao'),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas transacoes financeiras</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Transacao
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="label">Mes</label>
            <select
              className="input"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: Number(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ano</label>
            <input
              type="number"
              className="input"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={transactions}
            actions={(row) => (
              <>
                <button
                  onClick={() => {
                    setEditingId(row.id)
                    setModalOpen(true)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          />
        )}
      </Card>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        categories={categories}
        onSuccess={() => {
          setModalOpen(false)
          loadData()
        }}
      />
    </div>
  )
}

function TransactionModal({ isOpen, onClose, editingId, categories, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    isFixed: false,
    notes: '',
  })

  useEffect(() => {
    if (editingId) {
      loadTransaction()
    } else {
      resetForm()
    }
  }, [editingId])

  async function loadTransaction() {
    try {
      const transactions = await api.getTransactions({})
      const data = transactions.find((t) => t.id === editingId)
      if (data) {
        setFormData({
          type: data.type,
          title: data.title,
          amount: data.amount,
          date: new Date(data.date).toISOString().split('T')[0],
          categoryId: data.categoryId || '',
          isFixed: data.isFixed,
          notes: data.notes || '',
        })
      }
    } catch (error) {
      alert('Erro ao carregar transacao')
    }
  }

  function resetForm() {
    setFormData({
      type: 'EXPENSE',
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      isFixed: false,
      notes: '',
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId || null,
      }

      if (editingId) {
        await api.updateTransaction(editingId, payload)
      } else {
        await api.createTransaction(payload)
      }
      onSuccess()
    } catch (error) {
      alert('Erro ao salvar transacao')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingId ? 'Editar Transacao' : 'Nova Transacao'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Tipo</label>
          <select
            className="input"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>

        <div>
          <label className="label">Titulo</label>
          <input
            type="text"
            className="input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Data</label>
          <input
            type="date"
            className="input"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Categoria</label>
          <select
            className="input"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            <option value="">Sem categoria</option>
            {categories.filter((c) => c.type === formData.type).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFixed"
            checked={formData.isFixed}
            onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
          />
          <label htmlFor="isFixed" className="text-sm">
            {formData.type === 'EXPENSE' ? 'Despesa fixa' : 'Receita fixa'}
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {editingId ? 'Atualizar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
