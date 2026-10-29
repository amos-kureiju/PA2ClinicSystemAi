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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  // ==================== 1. PUBLIC & PATIENT ====================
  console.log('--- SESSION 1: PUBLIC & PATIENT PORTAL ---');
  const patientContext = await browser.createBrowserContext();
  const page1 = await patientContext.newPage();
  await page1.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('1. Capturing Landing Page...');
  await page1.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page1.screenshot({ path: path.join(OUT_DIR, '01_Landing_Page.png') });

  console.log('2. Opening Chatbot and testing RAG response...');
  await page1.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'patient');
    localStorage.setItem('user_name', 'Amos Baringbing');
  }, PATIENT_TOKEN);

  // Click Ask AI
  await page1.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const askBtn = btns.find(b => b.innerText && b.innerText.includes('ASK AI'));
    if (askBtn) askBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click suggestion query
  await page1.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scBtn = btns.find(b => b.innerText && b.innerText.includes('Biaya Scaling'));
    if (scBtn) scBtn.click();
  });
  console.log('Waiting for AI response streaming (18s)...');
  await new Promise(r => setTimeout(r, 18000));
  await page1.screenshot({ path: path.join(OUT_DIR, '02_DentAI_Chatbot_Conversation.png') });

  console.log('3. Capturing Patient Portal Dashboard...');
  await page1.goto('http://localhost:3000/patient/dashboard', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page1.screenshot({ path: path.join(OUT_DIR, '03_Patient_Portal_Dashboard.png') });

  console.log('4. Capturing Dental Services Catalog...');
  await page1.goto('http://localhost:3000/patient/services', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page1.screenshot({ path: path.join(OUT_DIR, '04_Dental_Services_Catalog.png') });

  console.log('5. Capturing Doctors Directory...');
  await page1.goto('http://localhost:3000/patient/doctors', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await page1.screenshot({ path: path.join(OUT_DIR, '05_Specialist_Doctors.png') });

  // ==================== 2. ADMIN PORTAL ====================
  console.log('--- SESSION 2: ADMIN PORTAL ---');
  const adminContext = await browser.createBrowserContext();
  const pageAdmin = await adminContext.newPage();
  await pageAdmin.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await pageAdmin.setCookie(
    { name: 'token', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'admin', domain: 'localhost', path: '/' }
  );

  console.log('6. Capturing Admin Analytics Dashboard...');
  await pageAdmin.goto('http://localhost:3000/admin', { waitUntil: 'load', timeout: 30000 });
  await pageAdmin.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('user_name', 'Administrator Utama');
  }, ADMIN_TOKEN);
  await pageAdmin.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 3500));
  await pageAdmin.screenshot({ path: path.join(OUT_DIR, '06_Admin_Analytics_Dashboard.png') });

  console.log('7. Capturing Admin Appointments Pipeline...');
  await pageAdmin.goto('http://localhost:3000/admin/appointments', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await pageAdmin.screenshot({ path: path.join(OUT_DIR, '07_Admin_Appointments_Manager.png') });

  // ==================== 3. DOCTOR PORTAL ====================
  console.log('--- SESSION 3: DOCTOR PORTAL ---');
  const docContext = await browser.createBrowserContext();
  const pageDoc = await docContext.newPage();
  await pageDoc.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await pageDoc.setCookie(
    { name: 'token', value: DOCTOR_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'doctor', domain: 'localhost', path: '/' }
  );

  console.log('8. Capturing Doctor Clinical Workstation...');
  await pageDoc.goto('http://localhost:3000/doctor', { waitUntil: 'load', timeout: 30000 });
  await pageDoc.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'doctor');
    localStorage.setItem('user_name', 'dr. Pratama Wijaya');
  }, DOCTOR_TOKEN);
  await pageDoc.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 3500));
  await pageDoc.screenshot({ path: path.join(OUT_DIR, '08_Doctor_Clinical_Workstation.png') });

  console.log('9. Capturing Doctor Live Patient Queue...');
  await pageDoc.goto('http://localhost:3000/doctor/queue', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  await pageDoc.screenshot({ path: path.join(OUT_DIR, '09_Doctor_Patient_Queue.png') });

  // ==================== 4. LOGIN PORTAL ====================
  console.log('--- SESSION 4: LOGIN PORTAL ---');
  const loginContext = await browser.createBrowserContext();
  const pageLogin = await loginContext.newPage();
  await pageLogin.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await pageLogin.goto('http://localhost:3000/login', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await pageLogin.screenshot({ path: path.join(OUT_DIR, '10_Unified_Login_Portal.png') });

  console.log('ALL PERFECT SCREENSHOTS COMPLETED!');
  await browser.close();
}

run().catch(err => {
  console.error('ERROR in run:', err);
  process.exit(1);
});

