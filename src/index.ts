import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Retrieve routes for crawler
const quickUpdateRoute = process.env.MOJANG_QUICKUPDATE_ROUTE;
const sweeperRoute = process.env.MOJANG_SWEEPER_ROUTE;
const serverListRoute = process.env.CRAWL_SERVERLIST_ROUTE;

if (!quickUpdateRoute || !serverListRoute || !sweeperRoute) {
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
console.info('⌛ Now running scheduler');

/** Mojang API */
cron.schedule('*/5 * * * *', async () => {
  console.log('Running Mojang quickUpdate schedule (every 5 minutes)');
  try {
    await axios.post(`${quickUpdateRoute}?password=${secretPassword}`);
  } catch (error) {
    console.error('Mojang crawl failed:', error);
  }
});

cron.schedule('*/15 * * * *', async () => {
  console.log('Running Mojang sweeper schedule (every 15 minutes)');
  try {
    await axios.post(`${sweeperRoute}?password=${secretPassword}`);
  } catch (error) {
    console.error('Mojang crawl failed:', error);
  }
});

cron.schedule('0 2 * * *', async () => {
  console.log('Running ServerList schedule (daily at 2am)');
  try {
    await axios.post(`${serverListRoute}?password=${secretPassword}`);
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
