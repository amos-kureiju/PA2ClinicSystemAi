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
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1500,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Landing Page
  console.log('1. Capturing Landing Page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(OUT_DIR, '01_Landing_Page.png') });

  // 2. Chatbot with Live Conversation
  console.log('2. Opening Chatbot and simulating conversation...');
  await page.setCookie(
    { name: 'token', value: PATIENT_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'patient', domain: 'localhost', path: '/' }
  );
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'patient');
    localStorage.setItem('user_name', 'Amos Baringbing');
  }, PATIENT_TOKEN);

  // Click Ask AI
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const askBtn = btns.find(b => b.innerText && b.innerText.includes('ASK AI'));
    if (askBtn) askBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Click "Biaya Scaling di Nauli Dental Care?"
  console.log('Clicking suggestion query...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scBtn = btns.find(b => b.innerText && b.innerText.includes('Biaya Scaling'));
    if (scBtn) scBtn.click();
  });

  // Wait for AI response to stream and complete
  console.log('Waiting for AI response streaming...');
  await new Promise(r => setTimeout(r, 12000));
  await page.screenshot({ path: path.join(OUT_DIR, '02_DentAI_Chatbot_Conversation.png') });

  // 3. Patient Portal Dashboard
  console.log('3. Capturing Patient Portal Dashboard...');
  await page.goto('http://localhost:3000/patient/dashboard', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '03_Patient_Portal_Dashboard.png') });

  // 4. Dental Services Catalog
  console.log('4. Capturing Dental Services Catalog...');
  await page.goto('http://localhost:3000/patient/services', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '04_Dental_Services_Catalog.png') });

  // 5. Specialist Doctors
  console.log('5. Capturing Doctors Directory...');
  await page.goto('http://localhost:3000/patient/doctors', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '05_Specialist_Doctors.png') });

  // 6. Admin Analytics Dashboard
  console.log('6. Capturing Admin Dashboard with Real Analytics...');
  await page.deleteCookie({ name: 'token', domain: 'localhost' }, { name: 'role', domain: 'localhost' });
  await page.setCookie(
    { name: 'token', value: ADMIN_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'admin', domain: 'localhost', path: '/' }
  );
  await page.goto('http://localhost:3000/admin', { waitUntil: 'load', timeout: 30000 });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'admin');
    localStorage.setItem('user_name', 'Administrator Utama');
  }, ADMIN_TOKEN);
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(OUT_DIR, '06_Admin_Analytics_Dashboard.png') });

  // 7. Admin Appointments Manager
  console.log('7. Capturing Admin Appointments Manager...');
  await page.goto('http://localhost:3000/admin/appointments', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '07_Admin_Appointments_Manager.png') });

  // 8. Doctor Clinical Workstation
  console.log('8. Capturing Doctor Workstation...');
  await page.deleteCookie({ name: 'token', domain: 'localhost' }, { name: 'role', domain: 'localhost' });
  await page.setCookie(
    { name: 'token', value: DOCTOR_TOKEN, domain: 'localhost', path: '/' },
    { name: 'role', value: 'doctor', domain: 'localhost', path: '/' }
  );
  await page.goto('http://localhost:3000/doctor', { waitUntil: 'load', timeout: 30000 });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user_role', 'doctor');
    localStorage.setItem('user_name', 'dr. Pratama Wijaya');
  }, DOCTOR_TOKEN);
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(OUT_DIR, '08_Doctor_Clinical_Workstation.png') });

  // 9. Doctor Live Patient Queue
  console.log('9. Capturing Doctor Patient Queue...');
  await page.goto('http://localhost:3000/doctor/queue', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUT_DIR, '09_Doctor_Patient_Queue.png') });

  // 10. Unified Login Portal
  console.log('10. Capturing Login Portal...');
  await page.deleteCookie({ name: 'token', domain: 'localhost' }, { name: 'role', domain: 'localhost' });
  await page.goto('http://localhost:3000/login', { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, '10_Unified_Login_Portal.png') });

  console.log('ALL PERFECT SCREENSHOTS GENERATED SUCCESSFULLY!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
