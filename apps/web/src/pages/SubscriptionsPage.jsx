import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import Modal from '../components/Modal'
import api from '../services/api'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [loadingPasswords, setLoadingPasswords] = useState({})

  useEffect(() => {
    loadSubscriptions()
  }, [])

  async function loadSubscriptions() {
    try {
      setLoading(true)
      const data = await api.getSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja remover esta assinatura?')) return
    try {
      await api.deleteSubscription(id)
      loadSubscriptions()
    } catch (error) {
      alert('Erro ao remover assinatura')
    }
  }

  async function togglePasswordVisibility(id) {
    if (visiblePasswords[id]) {
      setVisiblePasswords((prev) => ({ ...prev, [id]: null }))
      return
    }

    try {
      setLoadingPasswords((prev) => ({ ...prev, [id]: true }))
      const { password } = await api.getSubscriptionPassword(id)
      setVisiblePasswords((prev) => ({ ...prev, [id]: password }))
    } catch (error) {
      alert('Erro ao obter senha')
    } finally {
      setLoadingPasswords((prev) => ({ ...prev, [id]: false }))
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    {
      key: 'password',
      label: 'Senha',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">
            {visiblePasswords[row.id] || '********'}
          </span>
          <button
            onClick={() => togglePasswordVisibility(row.id)}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={loadingPasswords[row.id]}
          >
            {loadingPasswords[row.id] ? (
              <Loader2 size={16} className="animate-spin" />
            ) : visiblePasswords[row.id] ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (row) => `R$ ${row.amount.toFixed(2)}`,
    },
    { key: 'recurrence', label: 'Recorrencia' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assinaturas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas assinaturas e servicos</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Assinatura
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
            data={subscriptions}
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

      <SubscriptionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        onSuccess={() => {
          setModalOpen(false)
          loadSubscriptions()
        }}
      />
    </div>
  )
}

function SubscriptionModal({ isOpen, onClose, editingId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoUrl: '',
    amount: '',
    recurrence: 'MONTHLY',
    paymentDay: 1,
    nextPaymentDate: '',
  })

  useEffect(() => {
    if (editingId) {
      loadSubscription()
    } else {
      resetForm()
    }
  }, [editingId])

  async function loadSubscription() {
    try {
      const data = await api.getSubscription(editingId)
      const { password } = await api.getSubscriptionPassword(editingId)
      setFormData({
        name: data.name,
        email: data.email || '',
        password,
        photoUrl: data.photoUrl || '',
        amount: data.amount,
        recurrence: data.recurrence,
        paymentDay: data.paymentDay,
        nextPaymentDate: data.nextPaymentDate ? data.nextPaymentDate.split('T')[0] : '',
      })
    } catch (error) {
      alert('Erro ao carregar assinatura')
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      email: '',
      password: '',
      photoUrl: '',
      amount: '',
      recurrence: 'MONTHLY',
      paymentDay: 1,
      nextPaymentDate: '',
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        paymentDay: parseInt(formData.paymentDay, 10),
      }

      if (editingId) {
        await api.updateSubscription(editingId, payload)
      } else {
        await api.createSubscription(payload)
      }
      onSuccess()
    } catch (error) {
      alert('Erro ao salvar assinatura')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingId ? 'Editar Assinatura' : 'Nova Assinatura'}>
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
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Senha</label>
          <input
            type="text"
            className="input font-mono"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <label className="label">Recorrencia</label>
          <select
            className="input"
            value={formData.recurrence}
            onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
          >
            <option value="MONTHLY">Mensal</option>
            <option value="QUARTERLY">Trimestral</option>
            <option value="SEMIANNUAL">Semestral</option>
            <option value="ANNUAL">Anual</option>
          </select>
        </div>

        <div>
          <label className="label">Dia de Pagamento</label>
          <input
            type="number"
            min="1"
            max="31"
            className="input"
            value={formData.paymentDay}
            onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value })}
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
