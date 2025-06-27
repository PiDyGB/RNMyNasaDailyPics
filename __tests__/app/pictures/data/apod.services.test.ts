import { getApod } from '../../../../app/pictures/data/apod.services';
import apiNasaGovClient from '../../../../app/network/axios';
import { ApodEntry } from '../../../../app/data/apod.types';

// Mock the axios client
jest.mock('../../../../app/network/axios');

const mockedApiNasaGovClient = apiNasaGovClient as jest.Mocked<typeof apiNasaGovClient>;

describe('getApod', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedApiNasaGovClient.get.mockClear();
  });

  it('should correctly format dates and call the API for pageParam 0', async () => {
    const mockResponse: ApodEntry[] = [{ date: '2024-01-31', title: 'Test Title', url: 'test.url', hdurl: 'test.hdurl', explanation: 'Test explanation', media_type: 'image' }];
    mockedApiNasaGovClient.get.mockResolvedValueOnce({ data: mockResponse });

    const today = new Date('2024-01-31T12:00:00.000Z'); // Fixed date for consistent testing
    jest.useFakeTimers().setSystemTime(today);

    await getApod({ pageParam: 0 });

    const expectedEndDate = new Date(today.getTime()); // pageParam 0 means current month up to today
    const expectedStartDate = new Date(expectedEndDate.getTime() - (30 * 86400000));

    expect(mockedApiNasaGovClient.get).toHaveBeenCalledWith('/planetary/apod', {
      params: {
        start_date: expectedStartDate.toISOString().split('T')[0],
        end_date: expectedEndDate.toISOString().split('T')[0],
      },
    });
    jest.useRealTimers();
  });

  it('should correctly format dates and call the API for pageParam 1', async () => {
    const mockResponse: ApodEntry[] = [];
    mockedApiNasaGovClient.get.mockResolvedValueOnce({ data: mockResponse });

    const today = new Date('2024-01-31T12:00:00.000Z');
    jest.useFakeTimers().setSystemTime(today);

    await getApod({ pageParam: 1 });

    // For pageParam 1, endDate is 31 days before today.
    // startDate is 30 days before that endDate.
    const expectedEndDate = new Date(today.getTime() - (1 * 31 * 86400000));
    const expectedStartDate = new Date(expectedEndDate.getTime() - (30 * 86400000));

    expect(mockedApiNasaGovClient.get).toHaveBeenCalledWith('/planetary/apod', {
        params: {
            start_date: expectedStartDate.toISOString().split('T')[0],
            end_date: expectedEndDate.toISOString().split('T')[0],
        },
    });
    jest.useRealTimers();
  });

  it('should return data on successful API call', async () => {
    const mockApodEntries: ApodEntry[] = [
      { date: '2023-07-20', title: 'Pic 1', url: 'url1', hdurl: 'hdurl1', explanation: 'exp1', media_type: 'image' },
      { date: '2023-07-19', title: 'Pic 2', url: 'url2', hdurl: 'hdurl2', explanation: 'exp2', media_type: 'image' },
    ];
    mockedApiNasaGovClient.get.mockResolvedValueOnce({ data: mockApodEntries });

    const result = await getApod({ pageParam: 0 });
    expect(result).toEqual(mockApodEntries);
  });

  it('should throw an error when API call fails', async () => {
    mockedApiNasaGovClient.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(getApod({ pageParam: 0 })).rejects.toThrow('Apod not found');
  });

  it('should correctly format dates when today is the first day of the month', async () => {
    const mockResponse: ApodEntry[] = [];
    mockedApiNasaGovClient.get.mockResolvedValueOnce({ data: mockResponse });

    const today = new Date('2024-03-01T12:00:00.000Z'); // A date that is the first of the month
    jest.useFakeTimers().setSystemTime(today);

    await getApod({ pageParam: 0 });

    const expectedEndDate = new Date(today.getTime());
    const expectedStartDate = new Date(expectedEndDate.getTime() - (30 * 86400000)); // 30 days prior to Mar 1st

    expect(mockedApiNasaGovClient.get).toHaveBeenCalledWith('/planetary/apod', {
      params: {
        start_date: expectedStartDate.toISOString().split('T')[0], // Should be '2024-01-31'
        end_date: expectedEndDate.toISOString().split('T')[0],   // Should be '2024-03-01'
      },
    });
    jest.useRealTimers();
  });

  it('should correctly format dates for a different pageParam, e.g., pageParam 2', async () => {
    const mockResponse: ApodEntry[] = [];
    mockedApiNasaGovClient.get.mockResolvedValueOnce({ data: mockResponse });

    const today = new Date('2024-03-15T12:00:00.000Z'); // A fixed date
    jest.useFakeTimers().setSystemTime(today);

    await getApod({ pageParam: 2 });

    // For pageParam 2, endDate is 2 * 31 days before today.
    // startDate is 30 days before that endDate.
    const expectedEndDate = new Date(today.getTime() - (2 * 31 * 86400000));
    const expectedStartDate = new Date(expectedEndDate.getTime() - (30 * 86400000));

    expect(mockedApiNasaGovClient.get).toHaveBeenCalledWith('/planetary/apod', {
        params: {
            start_date: expectedStartDate.toISOString().split('T')[0],
            end_date: expectedEndDate.toISOString().split('T')[0],
        },
    });
    jest.useRealTimers();
  });
});
