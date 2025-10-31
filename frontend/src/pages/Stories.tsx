import { Link } from 'react-router-dom';

const stories = [
  { slug: 'hanh-trinh-bien-xanh', title: 'Hành trình biển xanh', excerpt: 'Một mùa hè rực rỡ ở Phú Quốc và Nha Trang.' },
  { slug: 'len-rung-xuong-bien', title: 'Lên rừng xuống biển', excerpt: 'Sa Pa hùng vĩ và vịnh Hạ Long nên thơ.' },
  { slug: 'am-thuc-viet-nam', title: 'Ẩm thực Việt Nam', excerpt: 'Khám phá hương vị địa phương qua từng miền.' },
];

export default function Stories() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Câu chuyện</h1>
      <ul className="space-y-3">
        {stories.map((s) => (
          <li key={s.slug} className="border rounded p-4 hover:shadow-sm">
            <Link to={`/stories/${s.slug}`} className="font-medium">{s.title}</Link>
            <div className="text-xs text-gray-500 mt-1">{s.excerpt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}