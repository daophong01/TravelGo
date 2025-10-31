export default function SignUp() {
  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Full name" />
        <input className="border rounded px-3 py-2" placeholder="Email" />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" />
        <button type="button" className="px-4 py-2 rounded bg-sky-500 text-white">Create account</button>
      </form>
    </div>
  );
}