import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import {
  fetchStudents,
  fetchCourses,
  fetchStudentsInCourse,
} from './teachable';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
  beforeEach,
  jest,
} from '@jest/globals';

// Mock environment variable
process.env.NEXT_PUBLIC_TEACHABLE_API_KEY = 'test-api-key';

// Mock data
const mockStudents = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
};

const mockCourses = {
  courses: [
    {
      id: '1',
      name: 'React Basics',
      image_url: 'https://example.com/react.jpg',
      heading: 'Learn React',
      is_published: true,
    },
    {
      id: '2',
      name: 'Advanced TypeScript',
      image_url: 'https://example.com/typescript.jpg',
      heading: 'Master TypeScript',
      is_published: true,
    },
  ],
};

const mockEnrollments = {
  enrollments: [
    { user_id: 1, percent_complete: 75 },
    { user_id: 2, percent_complete: 100 },
  ],
};

// Set up mock server
const server = setupServer(
  http.get('https://developers.teachable.com/v1/users', () => {
    return HttpResponse.json(mockStudents);
  }),

  http.get('https://developers.teachable.com/v1/courses', () => {
    return HttpResponse.json(mockCourses);
  }),

  http.get(
    'https://developers.teachable.com/v1/courses/:courseId/enrollments',
    () => {
      return HttpResponse.json(mockEnrollments);
    }
  )
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('Teachable API', () => {
  describe('fetchStudents', () => {
    it('successfully fetches students', async () => {
      const data = await fetchStudents();
      expect(data).toEqual(mockStudents);
      expect(data.users).toHaveLength(2);
      expect(data.users[0]).toHaveProperty('name', 'John Doe');
    });

    it('handles fetch error', async () => {
      server.use(
        http.get('https://developers.teachable.com/v1/users', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(fetchStudents()).rejects.toThrow('Failed to fetch students');
    });
  });

  describe('fetchCourses', () => {
    it('successfully fetches courses', async () => {
      const data = await fetchCourses();
      expect(data).toEqual(mockCourses);
      expect(data.courses).toHaveLength(2);
      expect(data.courses[0]).toHaveProperty('name', 'React Basics');
    });

    it('handles fetch error', async () => {
      server.use(
        http.get('https://developers.teachable.com/v1/courses', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(fetchCourses()).rejects.toThrow('Failed to fetch courses');
    });
  });

  describe('fetchStudentsInCourse', () => {
    it('successfully fetches course enrollments', async () => {
      const data = await fetchStudentsInCourse('1');
      expect(data).toEqual(mockEnrollments);
      expect(data.enrollments).toHaveLength(2);
      expect(data.enrollments[0]).toHaveProperty('percent_complete', 75);
    });

    it('handles fetch error', async () => {
      server.use(
        http.get(
          'https://developers.teachable.com/v1/courses/:courseId/enrollments',
          () => {
            return new HttpResponse(null, { status: 500 });
          }
        )
      );

      await expect(fetchStudentsInCourse('1')).rejects.toThrow(
        'Failed to fetch course enrollments'
      );
    });

    it('includes correct API key in headers', async () => {
      let requestHeaders: Headers | null = null;

      server.use(
        http.get(
          'https://developers.teachable.com/v1/courses/:courseId/enrollments',
          ({ request }) => {
            requestHeaders = request.headers;
            return HttpResponse.json(mockEnrollments);
          }
        )
      );
      await fetchStudentsInCourse('1');
      expect(requestHeaders!.get('apikey')).toBe('test-api-key');
    });
  });

  describe('API configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('throws error when API key is not configured', async () => {
      delete process.env.NEXT_PUBLIC_TEACHABLE_API_KEY;

      await expect(import('./teachable')).rejects.toThrow(
        'Teachable API key is not configured'
      );
    });
  });
});
