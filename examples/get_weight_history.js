// requires Node.js 18+ (uses native fetch, no dependencies)
const BASE_URL = "https://yzapi.yazio.com/v15";
const BEARER_TOKEN = "YOUR_ACCESS_TOKEN_HERE";
const START = "2010-01-01";
const END = new Date().toISOString().slice(0, 10);

fetch(`${BASE_URL}/user/bodyvalues/weight?start=${START}&end=${END}`, {
  headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
})
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    return r.json();
  })
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
