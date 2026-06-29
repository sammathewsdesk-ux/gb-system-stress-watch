import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GB System Stress Watch homepage', () => {
  render(<App />);
  expect(screen.getByText(/GB System Stress Watch/i)).toBeInTheDocument();
  expect(screen.getByText(/Refresh NESO \+ weather/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Board brief/i })).toBeInTheDocument();
  expect(screen.getByText(/Copy leadership brief/i)).toBeInTheDocument();
});
