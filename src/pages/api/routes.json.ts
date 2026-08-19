export const GET = async () => {
  const pages = import.meta.glob('/src/pages/**/*.astro', { eager: true });
  const pagePaths = Object.keys(pages)
    .filter(path => !path.includes('/404.astro'))
    .map(path => {
      let route = path.replace('/src/pages', '').replace('.astro', '');
      if (route.endsWith('/index')) {
        route = route.replace('/index', '');
      }
      return route === '' ? '/' : route;
    });

  return new Response(JSON.stringify(pagePaths), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
