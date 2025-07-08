// components/DashboardGrafico.tsx
'use client'

import useSWR from 'swr'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardGrafico() {
  const { data, error } = useSWR('/api/relatorios', fetcher)
  if (error) return <p>Erro ao carregar dados.</p>
  if (!data) return <p>Carregando...</p>

  // Defina quais campos usar como pizza ou barra
  const camposPizza = [
    'comoSoube', 'veioOutraCidade', 'beneficiosEconomicos',
    'impactoAmbiental', 'sustentabilidade', 'visitaTuristica',
    'recomendaria'
  ]
  const todosCampos = Object.keys(data).filter(k => k !== 'total')

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold">Total de Respostas: {data.total}</h1>

      {todosCampos.map((campo) => {
        const dist = data[campo]
        const labels = dist.map((d: any) => d[campo])
        const counts = dist.map((d: any) => d._count._all)

        const chartProps = {
          data: {
            labels,
            datasets: [{
              label: campo,
              data: counts,
              backgroundColor: camposPizza.includes(campo)
                ? ['#60A5FA','#34D399','#FBBF24','#F87171','#A78BFA','#F472B6']
                : '#3B82F6'
            }]
          }
        }

        return (
          <div key={campo} className="max-w-lg mx-auto">
            <h2 className="text-sm font-semibold mb-2">{campo}</h2>
            {camposPizza.includes(campo)
              ? <Pie {...chartProps} />
              : <Bar {...chartProps} />}
          </div>
        )
      })}
    </div>
  )
}
