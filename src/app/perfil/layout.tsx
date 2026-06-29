import { DonorShell } from '@/components/layout/DonorShell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DonorShell>{children}</DonorShell>
}
