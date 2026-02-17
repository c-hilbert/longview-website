import { Header } from '@/components/layout/Header'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
        {children}
      </main>
    </div>
  )
}
