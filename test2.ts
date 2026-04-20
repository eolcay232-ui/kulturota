import fs from 'fs';
import Papa from 'papaparse';

async function testParsing() {
  const fetch = globalThis.fetch;
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTFybZkkYn2RsnmFSaNME3WbyJkXoWU54o4hiGKUbMQ6Ijd8m_wO2nK5sRQQnd93XtQS0poQBGBXgGX/pub?output=csv');
  const text = await res.text();
  const results = Papa.parse(text, { header: true });
  
  const data = results.data;
  console.log("Original keys:", Object.keys(data[0]));
  
  const firstRowKeys = Object.keys(data[0] || {});
  const nameKey = firstRowKeys.find(k => k.toLowerCase().includes('adı')) || 'Adı';
  const typeKey = firstRowKeys.find(k => k.toLowerCase().includes('türü')) || 'Mekan Türü';

  console.log('typeKey:', typeKey);
  console.log('nameKey:', nameKey);
  
}
testParsing();
