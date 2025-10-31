import { useParams } from 'react-router-dom';

export default function StoryDetail() {
  const { slug } = useParams();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">Câu chuyện: {slug}</h1>
      <p>Nội dung câu chuyện sẽ hiển thị tại đây.</p>
    </div>
  );
}