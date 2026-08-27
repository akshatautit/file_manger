export function parseURL(urlString) {
  try {
    const parsed = new URL(urlString);

    const queryParams = {};
    parsed.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    console.log('--- Parsed URL ---');
    console.log('Protocol:', parsed.protocol);
    console.log('Host:', parsed.host);
    console.log('Pathname:', parsed.pathname);
    console.log('Query Params:', queryParams);
    console.log('------------------');

    return { protocol: parsed.protocol, host: parsed.host, pathname: parsed.pathname, queryParams };
  } catch (err) {
    console.log('Invalid URL:', urlString, '-', err.message);
    return null;
  }
}