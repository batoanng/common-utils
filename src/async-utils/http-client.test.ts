import { Agent } from 'https';
import { DeepMockProxy, mock, mockDeep, mockFn } from 'jest-mock-extended';
import { FetchFn, FetchResponse } from './types';
import { HttpClient } from './http-client';
import { backoffFixed } from './with-retry';

describe('client', () => {
    const response = mock<FetchResponse>();
    const fetch = mockFn<FetchFn>().mockResolvedValue(response);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('simple http client', () => {
        const client = new HttpClient({
            baseUrl: 'http://example.com',
            fetch,
            retry: false,
            rateLimit: false
        });

        it('should return the fetch response faithfully', async () => {
            const result = await client.fetch('/testpath');
            expect(result).toBe(response);
        });

        it('should correctly handle a baseUrl', async () => {
            await client.fetch('/testpath');
            expect(fetch).toHaveBeenCalledWith('http://example.com/testpath', {});
        });

        it('should correctly handle a baseUrl', async () => {
            const client = new HttpClient({
                fetch
            });

            await client.fetch('http://example.com/testpath');

            expect(fetch).toHaveBeenCalledWith('http://example.com/testpath', {});
        });

        it('should correctly pass through the fetch request init object', async () => {
            await client.fetch('/testpath', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hello world' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(fetch).toHaveBeenCalledWith('http://example.com/testpath', {
                method: 'POST',
                body: '{"message":"Hello world"}',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });
    });

    describe('with http client defaults', () => {
        it('should correctly set default headers', async () => {
            const client = new HttpClient({
                baseUrl: 'http://example.com',
                fetch,
                headers: () => {
                    return Promise.resolve({
                        Authorization: 'Bearer example',
                        'X-Correlation-Id': 'example X header',
                        'X-Header-To-Override': 'should be overridden'
                    });
                },
                retry: false,
                rateLimit: false
            });

            await client.fetch('/', {
                method: 'POST',
                body: JSON.stringify({ message: 'Hello world' }),
                headers: {
                    'X-Header-To-Override': 'change by the request',
                    'Content-Type': 'application/json'
                }
            });

            expect(fetch).toHaveBeenCalledWith('http://example.com/', {
                method: 'POST',
                body: '{"message":"Hello world"}',
                headers: {
                    Authorization: 'Bearer example',
                    'X-Correlation-Id': 'example X header',
                    'X-Header-To-Override': 'change by the request',
                    'Content-Type': 'application/json'
                }
            });
        });

        it('should correctly set default fetch', async () => {
            const agent = mock<Agent>();

            const client = new HttpClient({
                baseUrl: 'http://example.com',
                fetch,
                fetchOptions: {
                    // a nodejs server mey want to set a default http(s) agent
                    // to customize node-fetch's TLS certificate chain
                    agent
                },
                retry: false,
                rateLimit: false
            });

            await client.fetch('/');

            expect(fetch).toHaveBeenCalledWith('http://example.com/', {
                agent
            });
        });
    });

    describe('http client default retry logic', () => {
        [{ disableErrorTransform: false }, { disableErrorTransform: true }].forEach((testcase) => {
            it(`should retry http errors (${JSON.stringify(testcase)})`, async () => {
                const fetch = mockFn<FetchFn>()
                    .mockResolvedValueOnce(mockResponse(429))
                    .mockResolvedValueOnce(mockResponse(503))
                    .mockResolvedValueOnce(mockResponse(504))
                    .mockResolvedValueOnce(mockResponse(200));

                const client = new HttpClient({
                    fetch,
                    disableErrorTransform: testcase.disableErrorTransform,
                    retry: {
                        attempts: 4,
                        backoff: backoffFixed(0)
                    },
                    rateLimit: false
                });

                const response = await client.fetch('/example');

                expect(fetch).toHaveBeenCalledTimes(4);
                expect(response.status).toEqual(200);
            });
        });

        ['POST', 'PUT', 'PATCH', 'DELETE'].forEach((testcase) => {
            it(`should not retry http ${testcase} request`, async () => {
                const fetch = mockFn<FetchFn>().mockResolvedValue(mockResponse(503));

                const client = new HttpClient({
                    fetch,
                    rateLimit: false,
                    retry: {
                        backoff: backoffFixed(0)
                    },
                    disableErrorTransform: true
                });

                const response = await client.fetch('/example', {
                    method: testcase
                });

                expect(fetch).toHaveBeenCalledTimes(1);
                expect(response.status).toEqual(503);
            });
        });

        it('should call the headers callback on each retry', async () => {
            const fetch = mockFn<FetchFn>().mockResolvedValue(mockResponse(200));
            const headers = mockFn().mockReturnValue({ Authorization: 'value' });

            const client = new HttpClient({
                fetch,
                headers,
                retry: {
                    attempts: 2,
                    backoff: backoffFixed(0),
                    when: () => true
                },
                rateLimit: false
            });

            await client.fetch('/example');

            expect(fetch).toHaveBeenCalledTimes(2);
            expect(headers).toHaveBeenCalledTimes(2);
        });
    });
});

function mockResponse(status: number, body?: string | object): DeepMockProxy<FetchResponse> {
    const mock = mockDeep<FetchResponse>({
        status
    });

    mock.clone.mockReturnValue(mock);

    if (typeof body === 'string') {
        mock.text.mockResolvedValue(body);
    } else {
        mock.json.mockResolvedValue(body ?? {});
        mock.headers.get = mockFn().calledWith('content-type').mockReturnValue('application/json; charset=utf-8');
    }

    return mock;
}
