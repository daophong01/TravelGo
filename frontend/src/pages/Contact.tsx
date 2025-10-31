export default function Contact() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <form className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Your email" />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Message" rows={5} />
        <button type="button" className="px-4 py-2 rounded bg-sky-500 text-white">Send</button>
      </form>
    </div>
  );
}