"use client";
import { Leaf, Trees, Factory, MapPin } from "lucide-react";
import { Card } from "@/components/ui";

interface Stats {
  total_donated: number;
  total_trees: number;
  total_co2: number;
  total_area: number;
}

interface Props {
  stats: Stats;
  loading: boolean;
}

export function DashboardStatCards({ stats, loading }: Props) {
  // Normaliza para evitar erros caso algum campo venha indefinido.
  const totalDonated = Number(stats?.total_donated) || 0;
  const totalTrees = Number(stats?.total_trees) || 0;
  const totalCo2 = Number(stats?.total_co2) || 0;
  const totalArea = Number(stats?.total_area) || 0;
  const hasImpact = totalTrees > 0 || totalDonated > 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!hasImpact) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="font-manrope font-bold text-xl text-primary mb-2">
            🌱 Comece sua jornada
          </h3>
          <p className="font-inter text-on-surface-variant mb-4 max-w-md mx-auto">
            Faça sua primeira doação e veja seu impacto ambiental aparecer aqui.
            Cada real vira muda plantada na Mata Atlântica!
          </p>
          <button
            onClick={() => (window.location.href = "/#doe")}
            className="bg-primary text-white px-6 py-2 rounded-lg font-inter font-semibold hover:bg-primary/90"
          >
            Fazer primeira doação
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-inter font-semibold text-on-surface-variant uppercase tracking-wider">
            Doações
          </span>
          <span className="text-2xl">💰</span>
        </div>
        <p className="font-manrope font-bold text-2xl text-primary">
          R$ {totalDonated.toFixed(2).replace(".", ",")}
        </p>
        <p className="text-xs font-inter text-on-surface-variant mt-1">
          total doado
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-inter font-semibold text-on-surface-variant uppercase tracking-wider">
            Árvores
          </span>
          <Trees className="w-5 h-5 text-green-600" />
        </div>
        <p className="font-manrope font-bold text-2xl text-primary">
          {totalTrees}
        </p>
        <p className="text-xs font-inter text-on-surface-variant mt-1">
          mudas plantadas
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-inter font-semibold text-on-surface-variant uppercase tracking-wider">
            CO₂
          </span>
          <Factory className="w-5 h-5 text-blue-600" />
        </div>
        <p className="font-manrope font-bold text-2xl text-primary">
          {totalCo2.toFixed(2)}
        </p>
        <p className="text-xs font-inter text-on-surface-variant mt-1">
          toneladas compensadas
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-inter font-semibold text-on-surface-variant uppercase tracking-wider">
            Área
          </span>
          <MapPin className="w-5 h-5 text-orange-600" />
        </div>
        <p className="font-manrope font-bold text-2xl text-primary">
          {totalArea.toFixed(2)}
        </p>
        <p className="text-xs font-inter text-on-surface-variant mt-1">
          hectares recuperados
        </p>
      </Card>
    </div>
  );
}
