export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="text-center py-16 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Explore the world with TravelGo</h1>
        <p className="opacity-90">Find destinations, book trips, and enjoy exclusive deals.</p>
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Featured Destinations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Bali', 'Phu Quoc', 'Da Nang'].map((d) => (
            <div key={d} className="border rounded p-4">🌴 {d}</div>
          ))}
        </div>
      </section>
    </div>
  );
}