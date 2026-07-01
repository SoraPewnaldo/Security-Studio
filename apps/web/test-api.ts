import { apiClient } from './src/app/api-client.ts';

async function test() {
  try {
    console.log('Fetching favorites...');
    const favorites = await apiClient.get('/favorites');
    console.log('Favorites:', favorites);

    console.log('Adding hash-generator...');
    await apiClient.post('/favorites', { toolId: 'hash-generator' });
    console.log('Added.');

    console.log('Fetching favorites...');
    console.log(await apiClient.get('/favorites'));

    console.log('Deleting hash-generator...');
    await apiClient.delete('/favorites/hash-generator');
    console.log('Deleted.');

    console.log('Fetching favorites...');
    console.log(await apiClient.get('/favorites'));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
