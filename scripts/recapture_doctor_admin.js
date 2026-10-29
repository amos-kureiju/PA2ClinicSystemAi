const puppeteer = require('puppeteer-core');
const path = require('path');

const DOCTOR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2t0ZXJAa2xpbmlrLmFpIiwicm9sZSI6ImRvY3RvciIsImV4cCI6MTc5MzI5MjUyNX0.I9xOZrL__VQ5TUvZbAfdLpKhhvchkr_NEaZelPNOEbE';
const OUT_DIR = path.join(__dirname, '..', 'screenshots');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const docContext = await browser.createBrowserContext();
  const pageDoc = await docContext.newPage();
  await pageDoc.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await pageDoc.setCookie(
    { name: 'token', value: DOCTOR_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'doctor', domain: 'localhost', path: '/' }
  );

  console.log('Navigating to /doctor...');
  await pageDoc.goto('http://localhost:3000/doctor', { waitUntil: 'load', timeout: 30000 });
  await pageDoc.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'doctor');
    localStorage.setItem('user_name', 'dr. Pratama Wijaya');
  }, DOCTOR_TOKEN);
  await pageDoc.reload({ waitUntil: 'load' });
  
  console.log('Waiting for doctor data to render...');
  await pageDoc.waitForFunction(() => {
    const el = document.body;
    return el && !el.innerText.includes('MEMUAT ANTRIAN');
  }, { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  await pageDoc.screenshot({ path: path.join(OUT_DIR, '08_Doctor_Clinical_Workstation.png') });
  console.log('Doctor workstation captured!');

  console.log('Navigating to /doctor/queue...');
  await pageDoc.goto('http://localhost:3000/doctor/queue', { waitUntil: 'load', timeout: 30000 });
  await pageDoc.waitForFunction(() => {
    const el = document.body;
    return el && !el.innerText.includes('Memuat');
  }, { timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));
  await pageDoc.screenshot({ path: path.join(OUT_DIR, '09_Doctor_Patient_Queue.png') });
  console.log('Doctor queue captured!');

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
