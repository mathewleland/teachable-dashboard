import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from './CourseCard';
import { expect, jest } from '@jest/globals';

// Mock next/image since it's not available in the test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('CourseCard', () => {
  const mockCourse = {
    id: '123',
    name: 'Test Course',
    image_url: 'https://example.com/image.jpg',
    heading: 'Test Heading',
    is_published: true,
    description: 'Test Description',
  };

  const mockOnViewStudents = jest.fn();

  beforeEach(() => {
    mockOnViewStudents.mockClear();
  });

  it('renders course name correctly', () => {
    render(
      <CourseCard course={mockCourse} onViewStudents={mockOnViewStudents} />
    );
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  it('renders course heading when provided', () => {
    render(
      <CourseCard course={mockCourse} onViewStudents={mockOnViewStudents} />
    );
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it('does not render heading when not provided', () => {
    const courseWithoutHeading = { ...mockCourse, heading: '' };
    render(
      <CourseCard
        course={courseWithoutHeading}
        onViewStudents={mockOnViewStudents}
      />
    );
    expect(screen.queryByText('Test Heading')).not.toBeInTheDocument();
  });

  it('renders image with correct attributes when image_url is provided', () => {
    render(
      <CourseCard course={mockCourse} onViewStudents={mockOnViewStudents} />
    );
    const image = screen.getByAltText('Test Course course thumbnail');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('does not render image when image_url is not provided', () => {
    const courseWithoutImage = { ...mockCourse, image_url: '' };
    render(
      <CourseCard
        course={courseWithoutImage}
        onViewStudents={mockOnViewStudents}
      />
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('calls onViewStudents when "View Students" button is clicked', () => {
    render(
      <CourseCard course={mockCourse} onViewStudents={mockOnViewStudents} />
    );
    const button = screen.getByText('View Students');
    fireEvent.click(button);
    expect(mockOnViewStudents).toHaveBeenCalledTimes(1);
  });

  it('applies hover styles to container', () => {
    render(
      <CourseCard course={mockCourse} onViewStudents={mockOnViewStudents} />
    );
    const container = screen.getByRole('heading', {
      name: 'Test Course',
    }).parentElement;
    expect(container).toHaveClass('hover:shadow-md');
  });
});
