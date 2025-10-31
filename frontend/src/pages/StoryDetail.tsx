import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const all = {
  'hanh-trinh-bien-xanh': {
    title: 'Hành trình biển xanh',
    body: 'Một mùa hè rực rỡ ở Phú Quốc và Nha Trang với nắng vàng, biển xanh và cát trắng...',
  },
  'len-rung-xuong-bien': {
    title: 'Lên rừng xuống biển',
    body: 'Sa Pa hùng vĩ với ruộng bậc thang và vịnh Hạ Long nên thơ với hàng nghìn đảo đá...',
  },
  'am-thuc-viet-nam': {
    title: 'Ẩm thực Việt Nam',
    body: 'Hương vị địa phương qua từng miền: phở, bún bò, bún chả, bánh mì, cơm tấm...',
  },
} as Record<string, { title: string; body: string }>;

export default function StoryDetail() {
  const { slug = '' } = useParams();
  const article = useMemo(() => all[slug], [slug]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Không tìm thấy câu chuyện</h1>
        <p>Vui lòng quay lại trang Câu chuyện để chọn bài viết khác.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">{article.title}</h1>
      <p className="text-sm leading-6 text-gray-700">{article.body}</p>
    </div>
  );
}