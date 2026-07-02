export const httpClientManifest = {
  id: 'http-client',
  name: 'HTTP Client',
  description: 'Make HTTP requests and pipe responses directly to Security Studio tools. Auto-detects JWTs, cookies, JSON, and certificates.',
  category: 'networking',
  tags: ['http', 'api', 'request', 'rest', 'curl', 'client', 'proxy', 'headers', 'cookies'],
  examples: [
    {
      label: 'GET JSON API',
      input: { url: 'https://jsonplaceholder.typicode.com/todos/1', method: 'GET', body: '', headers: [] },
    },
    {
      label: 'POST JSON body',
      input: {
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        body: JSON.stringify({ title: 'test', body: 'content', userId: 1 }, null, 2),
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    },
    {
      label: 'Request with Auth header',
      input: {
        url: 'https://httpbin.org/bearer',
        method: 'GET',
        body: '',
        headers: [{ key: 'Authorization', value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U' }],
      },
    },
  ],
};
