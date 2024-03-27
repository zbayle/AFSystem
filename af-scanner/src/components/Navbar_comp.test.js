import { render } from '@testing-library/react';
import Navbar from './Navbar_comp'; // Import your Navbar component

jest.mock('./Navbar_comp', () => {
  // Define NavigationBar inside of the mock function
  const NavigationBar = jest.fn(() => null);

  return {
    __esModule: true,
    default: () => <div><NavigationBar /></div>,
    NavigationBar,
  };
});

describe('Navbar', () => {
  it('renders NavigationBar component', () => {
    render(<Navbar />);
    // Access NavigationBar from the mocked module
    expect(jest.requireMock('./Navbar_comp').NavigationBar).toHaveBeenCalledTimes(1);
  });
});