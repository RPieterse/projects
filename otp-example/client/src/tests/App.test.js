import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Error404 from '../pages/Error404';

// an example test for the 404 page
test('404 page includes "Page not found" text', () => {
  render(<Error404 />);
  const linkElement = screen.getByText(/Page Not Found/i);
  expect(linkElement).toBeInTheDocument();
});
