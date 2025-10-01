import { Logger } from '../logger';

describe('Logger coverage', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  test('Logger methods call console', () => {
    Logger.info('info message');
    Logger.warn('warn message');
    Logger.debug('debug message');
    Logger.error('error message');
    expect(console.log).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});
