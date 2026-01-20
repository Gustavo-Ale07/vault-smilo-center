import { useState } from 'react'
import Card from '../components/Card'
import api from '../services/api'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImportPage() {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  async function handleImport(e) {
    e.preventDefault()
    if (!file) {
      alert('Selecione um arquivo CSV')
      return
    }

    try {
      setImporting(true)
      setResult(null)
      const data = await api.importCSV(file)
      setResult(data)
      setFile(null)
    } catch (error) {
      alert(`Erro ao importar CSV: ${error.message}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importar Extrato</h1>
        <p className="text-gray-600 mt-1">Importe suas transacoes via CSV</p>
      </div>

      <Card title="Upload de Arquivo CSV">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Formato do CSV</h4>
            <p className="text-sm text-blue-800 mb-2">
              O arquivo deve conter as seguintes colunas (separadas por virgula):
            </p>
            <code className="block bg-white p-2 rounded text-sm font-mono">
              date,title,amount,type,category
            </code>
            <p className="text-xs text-blue-700 mt-2">
              <strong>Exemplo:</strong> 2024-01-15,Salario,5000,INCOME,Trabalho
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>- date: formato YYYY-MM-DD</li>
              <li>- type: EXPENSE ou INCOME</li>
              <li>- category: opcional (sera criada automaticamente)</li>
            </ul>
          </div>

          <form onSubmit={handleImport}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
              <Upload className="mx-auto text-gray-400 mb-4" size={48} />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="btn-primary cursor-pointer inline-block">
                Selecionar Arquivo CSV
              </label>
              {file && (
                <p className="mt-4 text-sm text-gray-600 flex items-center justify-center gap-2">
                  <FileText size={16} />
                  {file.name}
                </p>
              )}
            </div>

            {file && (
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={importing} className="btn-primary">
                  {importing ? 'Importando...' : 'Importar Transacoes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </Card>

      {result && (
        <Card title="Resultado da Importacao">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle />
                <span className="font-semibold">{result.imported} transacoes importadas</span>
              </div>
              {result.errors > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle />
                  <span className="font-semibold">{result.errors} erros</span>
                </div>
              )}
              {result.skipped > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle />
                  <span className="font-semibold">{result.skipped} duplicadas ignoradas</span>
                </div>
              )}
            </div>

            {result.details.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Erros encontrados:</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  {result.details.errors.map((err, idx) => (
                    <li key={idx}>
                      Linha {err.line}: {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.imported > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  As transacoes foram importadas com sucesso. Acesse a pagina de Financas para visualiza-las.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
