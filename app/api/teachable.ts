interface Course {
  id: string;
  name: string;
  image_url: string;
  heading: string;
  is_published: boolean;
  description?: string;
}

interface Enrollment {
  user_id: number;
  percent_complete: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
}

interface StudentsResponse {
  users: Student[];
}

interface CoursesResponse {
  courses: Course[];
}

interface EnrollmentsResponse {
  enrollments: Enrollment[];
}

const apiKey = process.env.NEXT_PUBLIC_TEACHABLE_API_KEY;
if (!apiKey) {
  throw new Error('Teachable API key is not configured');
}

const API_BASE_URL = 'https://developers.teachable.com/v1';

const headers = {
  accept: 'application/json',
  apiKey,
};

export async function fetchStudents(): Promise<StudentsResponse> {
  const response = await fetch(`${API_BASE_URL}/users`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

export async function fetchCourses(): Promise<CoursesResponse> {
  const response = await fetch(`${API_BASE_URL}/courses`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function fetchStudentsInCourse(
  courseId: string
): Promise<EnrollmentsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/enrollments`,
    { headers }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch course enrollments');
  }
  return response.json();
}

// Export types for use in other files
export type {
  Course,
  Enrollment,
  Student,
  StudentsResponse,
  CoursesResponse,
  EnrollmentsResponse,
};
