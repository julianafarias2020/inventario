
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const GraficoResumoFinanceiro = ({ dados }) => {
  return (
    <div className="w-full h-72 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo Financeiro</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entrada" fill="#4ade80" name="Entradas" />
          <Bar dataKey="saida" fill="#f87171" name="Saídas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoResumoFinanceiro
