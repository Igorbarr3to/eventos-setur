import FormMotoCross from "./components/form";

function App() {
  return (
    <div className="bg-slate-100 min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-center mb-4">Campeonato Estadual de Motocross Rondoniense 2025 - Pesquisa</h1>
      <p className="text-center text-gray-600 mb-2">Data: 28/06 a 29/06/2025</p>
      <p className="text-center text-gray-600 mb-8">Local: Pista de motocross - Linha P50, Km 02 (antigo lixão)</p>
      <FormMotoCross />
    </div>
  );
}

export default App;