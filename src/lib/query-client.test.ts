import { queryClient } from './query-client';

describe('query client', () => {
  it('ffound03_configures_stale_time_and_retries', () => {
    const defaults = queryClient.getDefaultOptions().queries;

    expect(defaults).toMatchObject({
      staleTime: 300_000,
      retry: 2,
    });
  });
});
