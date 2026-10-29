const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBrbGluaWsuYWkiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3OTMyOTI1MjV9.9IQpkBfgMwpexBgtN9iJ7yOF6PVZAEAkE71jKqBm6Q0';
const DOCTOR_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2t0ZXJAa2xpbmlrLmFpIiwicm9sZSI6ImRvY3RvciIsImV4cCI6MTc5MzI5MjUyNX0.I9xOZrL__VQ5TUvZbAfdLpKhhvchkr_NEaZelPNOEbE';
const PATIENT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbW9zLmJhcmluZ2JpbmcyMzA1QGdtYWlsLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiZXhwIjoxNzkzMjkyNTI1fQ.y3usxbPLR86yyQfBH-t9uHiLlYYe8EZgmrIeNjeq1R4';

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  console.log('1. Capturing Landing Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_Landing_Hero.png') });

  console.log('2. Opening AI Chatbot...');
  try {
    const askAiBtn = await page.$('button');
    // Find button containing Ask AI text
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.innerText, b);
      if (text && text.includes('ASK AI')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(OUT_DIR, '02_AI_Chatbot_DentAI.png') });
  } catch (e) {
    console.warn('Failed to capture chatbot:', e.message);
  }

  console.log('3. Capturing Login Page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, '03_Login_Portal.png') });

  console.log('4. Capturing Patient Portal Dashboard...');
  await page.goto('http://localhost:3000/patient/dashboard', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '04_Patient_Portal_Hero.png') });

  console.log('5. Capturing Dental Services...');
  await page.goto('http://localhost:3000/patient/services', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '05_Dental_Services.png') });

  console.log('6. Capturing Doctors Directory...');
  await page.goto('http://localhost:3000/patient/doctors', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '06_Doctors_Directory.png') });

  console.log('7. Capturing Admin Dashboard...');
  await page.setCookie(
    { name: 'token', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'admin', domain: 'localhost', path: '/' }
  );
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0', timeout: 20000 });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('user_name', 'Administrator Utama');
  }, ADMIN_TOKEN);
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '07_Admin_Dashboard.png') });

  console.log('8. Capturing Admin Appointments...');
  await page.goto('http://localhost:3000/admin/appointments', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '08_Admin_Appointments.png') });

  console.log('9. Capturing Doctor Dashboard...');
  await page.deleteCookie({ name: 'token', domain: 'localhost' }, { name: 'role', domain: 'localhost' });
  await page.setCookie(
    { name: 'token', value: DOCTOR_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'doctor', domain: 'localhost', path: '/' }
  );
  await page.goto('http://localhost:3000/doctor', { waitUntil: 'networkidle0', timeout: 20000 });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'doctor');
    localStorage.setItem('user_name', 'dr. Pratama Wijaya');
  }, DOCTOR_TOKEN);
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '09_Doctor_Dashboard.png') });

  console.log('10. Capturing Doctor Queue / Pasien Hari Ini...');
  await page.goto('http://localhost:3000/doctor/queue', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '10_Doctor_Queue.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

