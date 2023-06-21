import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Retrieve routes for crawler
const mojangRoute = process.env.CRAWL_MOJANG_ROUTE;
const serverListRoute = process.env.CRAWL_SERVERLIST_ROUTE;
if (!mojangRoute || !serverListRoute) {
  throw new Error('Routes are not defined in .ENV');
}

// Secret password to use crawler rotues
const secretPassword = process.env.SECRET;
if (!secretPassword) {
  throw new Error('Secret is not defined in .ENV');
}

/**
 * === Node scheduler ===
 */

/** Mojang API */
cron.schedule('*/5 * * * *', async () => {
  console.log('Running Mojang crawler schedule (every 5 mins)');
  try {
    await axios.post(`${mojangRoute}?password=${secretPassword}`);
  } catch (error) {
    console.error('Mojang crawl failed:', error);
  }
});

/** ServerList API */
/** Disabling for the meantime due massive amount of Row Reads */
// cron.schedule('0 2 * * *', async () => {
//   console.log('Running ServerList crawler schedule (at 2am each day)');
//   try {
//     await axios.post(`${serverListRoute}?password=${secretPassword}`);
//   } catch (error) {
//     console.error('ServerList crawl failed:', error);
//   }
// });
