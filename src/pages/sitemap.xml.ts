import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // src/pages ディレクトリ内のすべての .astro ファイルを取得
  const pages = import.meta.glob('./**/*.astro');
  
  const urls = Object.keys(pages)
    .map((path) => {
      // パスをURLパスに変換
      // 例: ./index.astro -> /
      //     ./docs/index.astro -> /docs
      //     ./docs/rsa-encryption.astro -> /docs/rsa-encryption
      let cleanPath = path
        .replace(/^\.\//, '/')
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '/');
      
      // 除外条件（404ページ、APIルート、動的ルーティングなど）
      if (
        cleanPath === '/404' || 
        cleanPath.startsWith('/api') || 
        cleanPath.includes('[')
      ) {
        return null;
      }
      return cleanPath;
    })
    .filter((path): path is string => path !== null);

  const siteUrl = 'https://sint-org.com';
  const today = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map((url) => {
      const fullUrl = `${siteUrl}${url === '/' ? '' : url}`;
      return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
