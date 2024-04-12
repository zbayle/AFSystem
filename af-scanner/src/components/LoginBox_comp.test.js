import axios from 'axios';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginBox from './LoginBox_comp';

// Mock axios
jest.mock('axios');

test('FOB input is focused when user is not authenticated', () => {
  // Control axios behavior here
  axios.post.mockResolvedValue({});

  const { getByTestId } = render(<LoginBox isAuthenticated={false} />);

  const fobInput = getByTestId('fob-input');
  expect(document.activeElement).toBe(fobInput);
});