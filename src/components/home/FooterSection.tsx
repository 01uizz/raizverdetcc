import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Instagram, Lock, Sprout } from 'lucide-react'

export function FooterSection() {
  return (
    <footer className="bg-[#08291b] border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 pattern-topo-light opacity-50 pointer-events-none" />
      <div className="container-page py-16 relative">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/iracambi-logo.jpeg" alt="Iracambi" width={40} height={40} className="rounded-xl object-cover" />
              <div>
                <p className="font-manrope font-bold text-white text-base leading-tight">Iracambi Raiz Verde</p>
                <p className="text-xs font-inter text-white/50 mt-0.5">Plataforma de Transparência</p>
              </div>
            </div>
            <p className="text-sm font-inter text-white/65 leading-relaxed max-w-xs">
              Restaurando a Mata Atlântica com ciência, comunidade e transparência desde 1999.
            </p>
            <div className="inline-flex items-center gap-1.5 mt-5 text-xs font-inter text-[#bfe7cb] bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Sprout className="w-3.5 h-3.5" /> +25 anos de reflorestamento
            </div>
          </div>

          <div>
            <p className="text-xs font-inter font-bold uppercase tracking-widest text-white/40 mb-5">Navegação</p>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Início' },
                { href: '/mapa', label: 'Mapa interativo' },
                { href: '/#projetos', label: 'Projetos' },
                { href: '/#doe', label: 'Fazer doação' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-inter text-white/70 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-inter font-bold uppercase tracking-widest text-white/40 mb-5">Contato</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span className="text-sm font-inter text-white/70 leading-snug">Rosário da Limeira, MG<br />Zona da Mata</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-sm font-inter text-white/70">contato@iracambi.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-sm font-inter text-white/70">@iracambi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs font-inter text-white/45">© {new Date().getFullYear()} Iracambi Raiz Verde. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs font-inter text-white/45 hover:text-white/80 border border-white/15 hover:border-white/30 rounded-full px-3 py-1.5 transition-all">
            <Lock className="w-3 h-3" /> Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}
