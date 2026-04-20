import fs from 'fs';
import Papa from 'papaparse';

async function testParsing() {
  const fetch = globalThis.fetch;
  const res = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTFybZkkYn2RsnmFSaNME3WbyJkXoWU54o4hiGKUbMQ6Ijd8m_wO2nK5sRQQnd93XtQS0poQBGBXgGX/pub?output=csv');
  const text = await res.text();
  const results = Papa.parse(text, { header: true });
  
  const data = results.data;
  if (!data || data.length === 0) return;

  const firstRowKeys = Object.keys(data[0] || {});
  const nameKey = firstRowKeys.find(k => k.toLowerCase().includes('adı')) || 'Adı';
  const typeKey = firstRowKeys.find(k => k.toLowerCase().includes('tür')) || 'Mekan Türü';
  
  let targetData = data.filter((row: any) => row[nameKey] && row[nameKey].trim() !== '');

  console.log('typeKey:', typeKey);
  console.log('nameKey:', nameKey);
  let libraryRows = 0;
  for (const row of targetData as any[]) {
      const type = row[typeKey] || ''; 
      const isLibrary = type.toLowerCase().includes('kütüphane');
      if (isLibrary) {
          libraryRows++;
      }
  }
  console.log('Total targets:', targetData.length);
  console.log('Total libraries:', libraryRows);
}
testParsing();
