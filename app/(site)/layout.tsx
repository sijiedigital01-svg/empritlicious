import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto">{children}</main>
      <Footer />
    </>
  )
}
