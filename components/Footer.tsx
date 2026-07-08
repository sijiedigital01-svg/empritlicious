export default function Footer() {
  return (
    <footer className="bg-brown-800 text-cream px-8 py-9 mt-16">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-5">
        <div>
          <div className="font-display font-bold text-lg text-gold">Empritlicious</div>
          <p className="text-xs text-cream-dark mt-2 leading-relaxed">
            Yogyakarta &middot; Oleh-oleh dibuat tangan, dititipkan rasa.
          </p>
        </div>
        <div className="text-xs text-cream-dark leading-loose">
          <div>📱 WhatsApp Admin</div>
          <div>🛍️ Shopee: empritlicious</div>
          <div>📸 Instagram: @empritlicious</div>
        </div>
      </div>
    </footer>
  )
}
