import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://localhost:3000/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test', content: 'Test content', type: 'info' })
  });
  const text = await res.text();
  console.log(res.status, text);
}
test();
