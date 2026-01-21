import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import Modal from '../components/Modal'
import api from '../services/api'
import { Plus, Edit, Trash2, TrendingUp, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [projectionData, setProjectionData] = useState(null)
  const [projectionLoading, setProjectionLoading] = useState(false)

  useEffect(() => {
    loadInvestments()
  }, [])

  async function loadInvestments() {
    try {
      setLoading(true)
      const data = await api.getInvestments()
      setInvestments(data)
    } catch (error) {
      console.error('Failed to load investments:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja remover este investimento?')) return
    try {
      await api.deleteInvestment(id)
      loadInvestments()
    } catch (error) {
      alert('Erro ao remover investimento')
    }
  }

  async function showProjection(id) {
    try {
      setProjectionLoading(true)
      const data = await api.getInvestmentProjection(id)
      setProjectionData(data)
    } catch (error) {
      alert('Erro ao carregar projeção')
    } finally {
      setProjectionLoading(false)
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    {
      key: 'principal',
      label: 'Principal',
      render: (row) => `R$ ${row.principal.toFixed(2)}`,
    },
    {
      key: 'annualRateBps',
      label: 'Taxa Anual',
      render: (row) => `${(row.annualRateBps / 100).toFixed(2)}%`,
    },
    {
      key: 'estimatedValue',
      label: 'Valor Estimado',
      render: (row) => (
        <span className="text-green-600 font-semibold">R$ {row.estimatedValue?.toFixed(2) || '0.00'}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investimentos</h1>
          <p className="text-gray-600 mt-1">Acompanhe seus investimentos e projeções</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Investimento
        </button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={investments}
            actions={(row) => (
              <>
                <button
                  onClick={() => showProjection(row.id)}
                  className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg"
                  title="Ver Projeção"
                  disabled={projectionLoading}
                >
                  {projectionLoading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                </button>
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

      {projectionData && (
        <Card title={`Projeção: ${projectionData.investment.name}`}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> {projectionData.formula}
            </p>
            <p className="text-xs text-gray-500">{projectionData.note}</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData.projection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <InvestmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        onSuccess={() => {
          setModalOpen(false)
          loadInvestments()
        }}
      />
    </div>
  )
}

function InvestmentModal({ isOpen, onClose, editingId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CDI',
    principal: '',
    monthlyContribution: '0',
    annualRateBps: '',
    startDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (editingId) {
      loadInvestment()
    } else {
      resetForm()
    }
  }, [editingId])

  async function loadInvestment() {
    try {
      const data = await api.getInvestment(editingId)
      setFormData({
        name: data.name,
        type: data.type,
        principal: data.principal,
        monthlyContribution: data.monthlyContribution,
        annualRateBps: data.annualRateBps,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
      })
    } catch (error) {
      alert('Erro ao carregar investimento')
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      type: 'CDI',
      principal: '',
      monthlyContribution: '0',
      annualRateBps: '',
      startDate: new Date().toISOString().split('T')[0],
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        principal: parseFloat(formData.principal),
        monthlyContribution: parseFloat(formData.monthlyContribution),
        annualRateBps: parseInt(formData.annualRateBps, 10),
      }

      if (editingId) {
        await api.updateInvestment(editingId, payload)
      } else {
        await api.createInvestment(payload)
      }
      onSuccess()
    } catch (error) {
      alert('Erro ao salvar investimento')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingId ? 'Editar Investimento' : 'Novo Investimento'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nome</label>
          <input
            type="text"
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Tipo</label>
          <select
            className="input"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="CDI">CDI</option>
            <option value="FIXED">Renda Fixa</option>
            <option value="STOCKS">Acoes</option>
            <option value="CRYPTO">Criptomoedas</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>

        <div>
          <label className="label">Principal (R$)</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={formData.principal}
            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="label">Aporte Mensal (R$)</label>
          <input
            type="number"
            step="0.01"
            className="input"
            value={formData.monthlyContribution}
            onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Taxa Anual (bps)</label>
          <input
            type="number"
            className="input"
            value={formData.annualRateBps}
            onChange={(e) => setFormData({ ...formData, annualRateBps: e.target.value })}
            placeholder="Ex: 1200 = 12% a.a."
            required
          />
          <p className="text-xs text-gray-500 mt-1">1200 = 12% a.a. | 1000 = 10% a.a.</p>
        </div>

        <div>
          <label className="label">Data de Início</label>
          <input
            type="date"
            className="input"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
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
