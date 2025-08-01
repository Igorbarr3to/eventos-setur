import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, FileText, BarChart2, CheckSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { RespostasChart } from "@/components/admin/dashboard/respostas-chart";
import { PesquisasRecentes } from "@/components/admin/dashboard/pesquisas-recentes";

// Componente para os Cards de Estatísticas
function StatCard({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={`${className} border-none shadow-md shadow-zinc-400`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm">
          {title}
          <Icon className="text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {value}
      </CardContent>
    </Card>
  );
}

// A página principal do Dashboard - um Server Component assíncrono
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // 1. Buscar todos os dados diretamente do Prisma no servidor
  const [totalUsuarios, totalPesquisas, totalRespostas, pesquisasAtivas] =
    await Promise.all([
      prisma.user.count(),
      prisma.pesquisa.count(),
      prisma.resposta.count(),
      prisma.pesquisa.count({ where: { status: "EM_ANDAMENTO" } }),
    ]);

  //Buscar dados para o gráfico (respostas nos últimos 7 dias)
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

  const respostasUltimaSemana = await prisma.resposta.findMany({
    where: { dataResposta: { gte: seteDiasAtras } },
    select: { dataResposta: true },
  });

  const pesquisasRecentes = await prisma.pesquisa.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, titulo: true, status: true, createdAt: true },
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo das atividades.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="openModal" asChild>
            <Link href="/pesquisas">Criar Pesquisa</Link>
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={totalUsuarios}
          icon={Users}
          className="bg-blue-300"
        />
        <StatCard
          title="Total de Pesquisas"
          value={totalPesquisas}
          icon={FileText}
          className="bg-emerald-500"
        />
        <StatCard
          title="Total de Respostas"
          value={totalRespostas}
          icon={BarChart2}
          className="bg-sky-400"
        />
        <StatCard
          title="Pesquisas Ativas"
          value={pesquisasAtivas}
          icon={CheckSquare}
          className="bg-yellow-400"
        />
      </div>

      {/* Grid principal para gráficos e listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna principal (ocupa 2/3 do espaço em telas grandes) */}
        <div className="">
          <RespostasChart respostas={respostasUltimaSemana} />
        </div>
        {/* Coluna secundária (ocupa 1/3) */}
        <div>
          <PesquisasRecentes pesquisas={pesquisasRecentes} />
        </div>
      </div>
    </div>
  );
}
