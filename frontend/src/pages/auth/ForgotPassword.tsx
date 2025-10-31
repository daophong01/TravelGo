export default function ForgotPassword() {
  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
      <form className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" />
        <button type="button" className="px-4 py-2 rounded bg-sky-500 text-white">Send reset link</button>
      </form>
    </div>
  );
}