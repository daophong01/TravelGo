export default function Support() {
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-2">Hỗ trợ</h2>
      <p className="text-sm text-gray-600 mb-3">Gửi yêu cầu hỗ trợ, chúng tôi sẽ phản hồi sớm nhất.</p>
      <form className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Tiêu đề" />
        <textarea className="border rounded px-3 py-2" placeholder="Nội dung" rows={5} />
        <button type="button" className="px-4 py-2 rounded bg-sky-500 text-white">Gửi</button>
      </form>
    </div>
  );
}