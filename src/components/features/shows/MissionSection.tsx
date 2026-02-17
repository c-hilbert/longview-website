import { Card } from '@/components/ui/Card'

export function MissionSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-[var(--ink-black)] mb-6 tracking-[-0.01em]">
          Our Mission
        </h2>
        
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-source-serif)] mb-8">
          In an age of fragmented attention, we believe in the power of long-form conversation. 
          Each episode is an invitation to slow down, think deeply, and engage with ideas that matter.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Depth Over Speed',
              description: 'Conversations that take time to explore ideas fully, not rushed soundbites.'
            },
            {
              title: 'Expert Voices',
              description: 'Access to leading thinkers, researchers, and innovators across fields.'
            },
            {
              title: 'Curated Quality',
              description: 'Every episode meticulously produced and edited for the best experience.'
            }
          ].map((item, index) => (
            <Card key={index} variant="subtle" className="p-6 text-left">
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--ink-black)] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--text-tertiary)] leading-relaxed font-[family-name:var(--font-inter)]">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
