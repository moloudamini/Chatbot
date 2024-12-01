import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (
      !msg.includes('React Router Future Flag Warning') &&
      !msg.includes('Relative route resolution within Splat routes')
    ) {
      console.warn(msg);
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
