const { initializePool } = require('../src/database/connection');

(async () => {
  try {
    const pool = await initializePool();
    const conn = await pool.getConnection();

    console.log('Connected, fetching tables...');

    const [tables] = await conn.query("SHOW TABLES");
    console.log('Tables:');
    tables.forEach((t) => console.log(Object.values(t)[0]));

    const describeTables = ['contributions', 'ai_content', 'marketing_campaigns', 'marketing_performance', 'content_production', 'marketing_performance_metrics'];
    for (const tbl of describeTables) {
      try {
        const [rows] = await conn.query('DESCRIBE `' + tbl + '`');
        console.log('\nDESCRIBE ' + tbl + ':');
        rows.forEach(r => console.log(`${r.Field} | ${r.Type} | ${r.Null} | ${r.Key} | ${r.Default} | ${r.Extra}`));
      } catch (err) {
        console.log('\nCould not describe ' + tbl + ': ' + err.message);
      }
    }

    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to DB:', err.message);
    process.exit(1);
  }
})();
