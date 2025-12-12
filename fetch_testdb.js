(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/api/testdb');
    const data = await res.json();
    console.log(JSON.stringify(data));
  } catch (e) {
    console.error('ERR', e.message || e);
  }
})();