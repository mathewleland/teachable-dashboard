import Image from 'next/image';
import { decodeHtml } from '@/lib/utils';

interface Course {
  id: string;
  name: string;
  image_url: string;
  description?: string;
  heading: string;
  is_published: boolean;
}

interface CourseCardProps {
  course: Course;
  onViewStudents: () => void;
}

export default function CourseCard({
  course,
  onViewStudents,
}: CourseCardProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold">{decodeHtml(course.name)}</h2>

      {course.image_url && (
        <div className="relative w-full h-48 my-4 rounded-md overflow-hidden">
          <Image
            src={course.image_url}
            alt={`${course.name} course thumbnail`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {course.heading && (
        <p className="text-gray-600 mt-1">{decodeHtml(course.heading)}</p>
      )}

      <button
        onClick={onViewStudents}
        className="mt-3 inline-block text-blue-600 hover:underline cursor-pointer"
      >
        View Students
      </button>
    </div>
  );
}
