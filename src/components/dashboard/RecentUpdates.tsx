"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui";
import { Leaf, Calendar, TrendingUp } from "lucide-react";

interface Update {
  id: string;
  title: string;
  description: string;
  type: "donation" | "planting" | "milestone";
  created_at: string;
}

export function RecentUpdates({ updates: propUpdates }: { updates: any[] }) {
  // Aplicada a tipagem na desestruturação do hook para corrigir o erro 'unknown'
  const { session } = useAuth() as {
    session: { user?: { id?: string; email?: string | null } } | null;
  };
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonations() {
      if (!session?.user?.id) {
        // Usuário não logado - busca localStorage
        const pending = JSON.parse(
          localStorage.getItem("pending_donations") || "[]",
        );
        setDonations(pending);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("donations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) setDonations(data);
      setLoading(false);
    }

    fetchDonations();
  }, [session]);

  const hasUpdates = propUpdates?.length > 0 || donations?.length > 0;

  if (loading) {
    return <Card className="p-6 text-center">Carregando...</Card>;
  }

  if (!hasUpdates) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h4 className="font-manrope font-semibold text-lg text-primary mb-2">
          Nenhuma atividade ainda
        </h4>
        <p className="font-inter text-sm text-on-surface-variant mb-4">
          Sua primeira doação vai aparecer aqui com fotos das mudas e
          atualizações do plantio. 🌱
        </p>
        <button
          onClick={() => (window.location.href = "/#doe")}
          className="text-secondary font-inter text-sm font-semibold hover:underline"
        >
          Fazer minha primeira doação →
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {propUpdates?.length > 0 &&
        propUpdates.map((update) => (
          <Card
            key={update.id}
            className="p-4 hover:border-secondary transition-colors"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-inter font-semibold text-sm text-primary">
                  {update.title}
                </p>
                <p className="font-inter text-xs text-on-surface-variant mt-0.5">
                  {update.description}
                </p>
                <p className="font-inter text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(update.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Card>
        ))}

      {/* Mostra doações recentes */}
      {donations.slice(0, 3).map((donation) => (
        <Card
          key={donation.id || donation.date}
          className="p-4 border-green-100 bg-green-50/30"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-inter font-semibold text-sm text-primary">
                Você fez uma doação!
              </p>
              <p className="font-inter text-xs text-on-surface-variant mt-0.5">
                R$ {donation.amount?.toFixed(2).replace(".", ",")} →{" "}
                {donation.trees} mudas plantadas
              </p>
              <p className="font-inter text-xs text-on-surface-variant/60 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(
                  donation.created_at || donation.date,
                ).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {donations.length > 3 && (
        <button className="text-secondary text-xs font-inter font-semibold hover:underline mt-2">
          Ver todas as doações →
        </button>
      )}
    </div>
  );
}