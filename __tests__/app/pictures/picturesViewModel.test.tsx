import { renderHook, waitFor } from '@testing-library/react-native';
import { picturesViewModel } from '../../../app/pictures/picturesViewModel';
import { getApod } from '../../../app/pictures/data/apod.services';
import { ApodEntry } from '../../../app/data/apod.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the getApod service
jest.mock('../../../app/pictures/data/apod.services');
const mockedGetApod = getApod as jest.MockedFunction<typeof getApod>;

// A utility to wrap the hook with QueryClientProvider
// It will use the queryClient defined in the test scope
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// A new QueryClient for each test run
let queryClient: QueryClient;

describe('picturesViewModel', () => {
  beforeEach(() => {
    mockedGetApod.mockClear();
    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity, // Turn off garbage collection for tests to avoid race conditions with cleanup
        },
      },
    });
  });

  afterEach(() => {
    // Clean up the cache after each test
    queryClient.clear();
  });


  const mockApodPage1: ApodEntry[] = [
    { date: '2023-07-20', title: 'Pic 1', url: 'url1', hdurl: 'hdurl1', explanation: 'exp1', media_type: 'image' },
    { date: '2023-07-18', title: 'Pic 3', url: 'url3', hdurl: 'hdurl3', explanation: 'exp3', media_type: 'image' },
  ];
  const mockApodPage2: ApodEntry[] = [
    { date: '2023-07-19', title: 'Pic 2', url: 'url2', hdurl: 'hdurl2', explanation: 'exp2', media_type: 'image' },
  ];

  it('should be in fetching state initially and fetch initial data', async () => {
    mockedGetApod.mockResolvedValueOnce([...mockApodPage1]);

    const { result } = renderHook(() => picturesViewModel(), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(true);
    expect(result.current.apods).toBeUndefined();

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(mockedGetApod).toHaveBeenCalledWith(expect.objectContaining({ pageParam: 0 }));
    expect(result.current.apods).toEqual([...mockApodPage1].sort((a, b) => b.date.localeCompare(a.date)));
  });

  it('should fetch next page and append and sort data', async () => {
    // Set up mocks for both calls before rendering the hook
    mockedGetApod
      .mockResolvedValueOnce([...mockApodPage1]) // For initial load (pageParam 0)
      .mockResolvedValueOnce([...mockApodPage2]); // For fetchNextPage (pageParam 1)

    const { result } = renderHook(() => picturesViewModel(), { wrapper: createWrapper() });

    // Wait for initial data
    await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 2000 });
    expect(result.current.apods?.length).toBe(mockApodPage1.length);

    // Trigger fetchNextPage
    result.current.fetchNextPage();

    // Wait for the next page to load and data to be appended
    // isFetchingNextPage becomes true then false. We also need to wait for apods to update.
    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
      expect(result.current.apods?.length).toBe(mockApodPage1.length + mockApodPage2.length);
    }, { timeout: 2000 });

    const expectedSortedApods = [...mockApodPage1, ...mockApodPage2].sort((a,b) => b.date.localeCompare(a.date));
    expect(result.current.apods).toEqual(expectedSortedApods);
    expect(mockedGetApod).toHaveBeenCalledTimes(2);
    expect(mockedGetApod).toHaveBeenNthCalledWith(1, expect.objectContaining({ pageParam: 0 }));
    expect(mockedGetApod).toHaveBeenNthCalledWith(2, expect.objectContaining({ pageParam: 1 }));
  });

  it('should handle error when fetching initial data', async () => {
    const errorMessage = 'Failed to fetch';
    mockedGetApod.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => picturesViewModel(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current.error).toEqual(new Error(errorMessage));
    expect(result.current.apods).toBeUndefined();
  });

  it('should correctly determine getNextPageParam', async () => {
    // For this test, we need to access the internal options of useInfiniteQuery,
    // which is not directly exposed by the hook.
    // We'll test it by observing if fetchNextPage is possible

    // Scenario 1: Last page has data
    mockedGetApod.mockResolvedValueOnce([...mockApodPage1]); // Page 0
    const { result, rerender } = renderHook(() => picturesViewModel(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 2000 });

    // Check if next page can be fetched (implies getNextPageParam returned a value)
    // Mock for page 1 is already chained if we set it up at the start of the test or use specific mock per call
    // For this test, let's make it explicit for clarity
    mockedGetApod.mockResolvedValueOnce([...mockApodPage2]); // Page 1 for the *next* fetch
    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false), { timeout: 2000 });
    expect(mockedGetApod).toHaveBeenLastCalledWith(expect.objectContaining({ pageParam: 1 }));

    // Scenario 2: Last page is empty
    mockedGetApod.mockResolvedValueOnce([]); // Page 2 (empty) for the *next* fetch
    result.current.fetchNextPage();
    // Need to give react-query time to process, even if no visual update
    await new Promise(resolve => setTimeout(resolve, 50));

    // Try to fetch again, it shouldn't call getApod because getNextPageParam should be undefined
    mockedGetApod.mockClear(); // Clear previous calls
    result.current.fetchNextPage();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(mockedGetApod).not.toHaveBeenCalled();
  });


  it('should sort apods by date descending', async () => {
    const unsortedData = [
      { date: '2023-07-18', title: 'Pic 3', url: 'url3', hdurl: 'hdurl3', explanation: 'exp3', media_type: 'image' },
      { date: '2023-07-20', title: 'Pic 1', url: 'url1', hdurl: 'hdurl1', explanation: 'exp1', media_type: 'image' },
    ];
    mockedGetApod.mockResolvedValueOnce(unsortedData);

    const { result } = renderHook(() => picturesViewModel(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    const expectedSortedData = [
      { date: '2023-07-20', title: 'Pic 1', url: 'url1', hdurl: 'hdurl1', explanation: 'exp1', media_type: 'image' },
      { date: '2023-07-18', title: 'Pic 3', url: 'url3', hdurl: 'hdurl3', explanation: 'exp3', media_type: 'image' },
    ];
    expect(result.current.apods).toEqual(expectedSortedData);
  });

});
