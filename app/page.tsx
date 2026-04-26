import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/landing/footer"
import { AuthRedirectHandler } from "@/components/auth-redirect-handler"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthRedirectHandler />
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
