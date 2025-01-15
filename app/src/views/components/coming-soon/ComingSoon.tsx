import { ComingSoonCard } from "./ComingSoonCard"

export function ComingSoon() {
  return (
    <section className="container mx-auto p-6">
      <h2 className="mb-8 text-2xl font-bold">Coming Soon</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Large landscape card */}
        <div className="md:col-span-2 lg:col-span-2">
          <ComingSoonCard 
            aspectRatio="landscape" 
            title="Próximamente" 
          />
        </div>
        
        {/* Regular square cards */}
        <ComingSoonCard title="Nuevo Lanzamiento" />
        
        {/* Portrait card */}
        <ComingSoonCard 
          aspectRatio="portrait" 
          title="Muy Pronto" 
        />
        
        {/* Additional square cards */}
        <ComingSoonCard title="En Desarrollo" />
        <ComingSoonCard title="Próxima Colección" />
      </div>
    </section>
  )
}