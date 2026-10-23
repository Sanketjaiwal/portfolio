import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';

test('renders a link to the admin login page', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
});
