import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import Modal from '../components/Modal'
import api from '../services/api'
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function VaultPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [loadingPasswords, setLoadingPasswords] = useState({})

  useEffect(() => {
    loadAccounts()
  }, [])

  async function loadAccounts() {
    try {
      setLoading(true)
      const data = await api.getVaultAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Failed to load accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja remover esta conta?')) return
    try {
      await api.deleteVaultAccount(id)
      loadAccounts()
    } catch (error) {
      alert('Erro ao remover conta')
    }
  }

  async function togglePasswordVisibility(id) {
    if (visiblePasswords[id]) {
      setVisiblePasswords((prev) => ({ ...prev, [id]: null }))
      return
    }

    try {
      setLoadingPasswords((prev) => ({ ...prev, [id]: true }))
      const { password } = await api.getVaultAccountPassword(id)
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
      key: 'notes',
      label: 'Notas',
      render: (row) => (row.notes ? (
        <span className="text-sm text-gray-600">{row.notes.substring(0, 30)}...</span>
      ) : (
        '-'
      )),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cofre de Contas</h1>
          <p className="text-gray-600 mt-1">Armazene com segurança suas credenciais</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null)
            setModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Conta
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
            data={accounts}
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

      <VaultModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        onSuccess={() => {
          setModalOpen(false)
          loadAccounts()
        }}
      />
    </div>
  )
}

function VaultModal({ isOpen, onClose, editingId, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    platformPhotoUrl: '',
    notes: '',
  })

  useEffect(() => {
    if (editingId) {
      loadAccount()
    } else {
      resetForm()
    }
  }, [editingId])

  async function loadAccount() {
    try {
      const data = await api.getVaultAccount(editingId)
      const { password } = await api.getVaultAccountPassword(editingId)
      setFormData({
        name: data.name,
        email: data.email || '',
        password,
        platformPhotoUrl: data.platformPhotoUrl || '',
        notes: data.notes || '',
      })
    } catch (error) {
      alert('Erro ao carregar conta')
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      email: '',
      password: '',
      platformPhotoUrl: '',
      notes: '',
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editingId) {
        await api.updateVaultAccount(editingId, formData)
      } else {
        await api.createVaultAccount(formData)
      }
      onSuccess()
    } catch (error) {
      alert('Erro ao salvar conta')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingId ? 'Editar Conta' : 'Nova Conta'}>
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
          <label className="label">Notas</label>
          <textarea
            className="input"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
