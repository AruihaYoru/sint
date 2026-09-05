import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 鍵ファイルのパス候補
const KEY_PATHS = [
  path.join(__dirname, 'private', 'service-account-key.json'),
  path.join(__dirname, '..', 'service-account-key.json'),
];

// URLリストファイルのパス
const URLS_FILE = path.join(__dirname, 'urls.txt');

function findKeyFile() {
  for (const p of KEY_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

function loadUrls() {
  if (!fs.existsSync(URLS_FILE)) {
    console.error(`[ERROR] URLリストファイルが見つかりません: ${URLS_FILE}`);
    process.exit(1);
  }
  const content = fs.readFileSync(URLS_FILE, 'utf-8');
  return content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

async function run() {
  console.log('反体制主義拗らせてるのでGoogleをシバく（暗喩）\n');

  const keyPath = findKeyFile();
  if (!keyPath) {
    console.error('[ERROR] サービスアカウントの JSON キーファイルが見つかりません！');
    console.error('ダウンロードした JSON キーを以下の場所に配置してください:');
    console.error(`   ${path.join(__dirname, 'private', 'service-account-key.json')}\n`);
    process.exit(1);
  }

  console.log(`鍵ファイルを使用中: ${keyPath}`);
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
  console.log(`サービスアカウント: ${keyData.client_email}\n`);

  const urls = loadUrls();
  if (urls.length === 0) {
    console.warn('送信対象の URL がありません。');
    process.exit(0);
  }

  console.log(`送信対象 URL (${urls.length} 件):`);
  urls.forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
  console.log('\n----------------------------------------\n');

  const jwtClient = new google.auth.JWT(
    keyData.client_email,
    null,
    keyData.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  await jwtClient.authorize();
  const indexing = google.indexing({ version: 'v3', auth: jwtClient });

  let successCount = 0;
  let failCount = 0;

  for (const url of urls) {
    process.stdout.write(`⏳ 送信中: ${url} ... `);
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });

      console.log(`成功 (Status: ${res.status})`);
      if (res.data?.urlNotificationMetadata?.latestUpdate) {
        console.log(`   └ Notification Time: ${res.data.urlNotificationMetadata.latestUpdate.notifyTime}`);
      }
      successCount++;
    } catch (err) {
      console.log(`失敗`);
      const errorDetail = err.response?.data?.error || err.message;
      console.error(`   └ Error: ${JSON.stringify(errorDetail)}`);
      failCount++;
    }
  }

  console.log('\n----------------------------------------');
  console.log(`完了: 成功 ${successCount} 件 / 失敗 ${failCount} 件`);
}

run().catch(err => {
  console.error('\nSomething went wrong...', err);
  process.exit(1);
});
