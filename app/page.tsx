'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import CourseCard from './components/CourseCard';
import Modal from './components/Modal';
import { useState } from 'react';
import {
  fetchStudents,
  fetchCourses,
  fetchStudentsInCourse,
  type Course,
  type Enrollment,
} from './api/teachable';

export default function Home() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['enrollments', selectedCourse?.id],
    queryFn: () =>
      selectedCourse ? fetchStudentsInCourse(selectedCourse.id) : null,
    enabled: !!selectedCourse,
  });

  const { courses } = coursesData || {};
  const { enrollments } = enrollmentsData || {};

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Teachable Courses</h1>

        {isLoading && <p className="text-center">Loading courses...</p>}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {(error as Error).message}</span>
          </div>
        )}

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {courses.map((course: Course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewStudents={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        ) : courses && courses.length === 0 ? (
          <p className="text-center">No courses found</p>
        ) : null}

        <Modal
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          title={selectedCourse ? `Students in ${selectedCourse.name}` : ''}
        >
          {isLoadingEnrollments ? (
            <div className="flex items-center justify-center h-[200px] opacity-75 transition-opac">
              <p className="text-center py-4">Loading students...</p>
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="opacity-100 transition-opacity duration-1000">
              <div className="mb-4 pt-2 flex justify-end">
                <label className="inline-flex items-center cursor-pointer flex-row-reverse pr-3">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Completed
                  </span>
                </label>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {enrollments
                    .filter(
                      (enrollment) =>
                        !showCompleted || enrollment.percent_complete === 100
                    )
                    .map((enrollment: Enrollment) => {
                      const student = studentsData?.users.find(
                        (user) => user.id === enrollment.user_id
                      );
                      return student ? (
                        <tr key={enrollment.user_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.percent_complete}%
                          </td>
                        </tr>
                      ) : null;
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] opacity-100 transition-opacity duration-1000">
              <p className="text-center py-4">
                No students enrolled in this course.
              </p>
            </div>
          )}
        </Modal>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
