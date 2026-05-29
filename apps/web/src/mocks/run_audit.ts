import { runDataConsistencyAudit } from './validate_consistency';

try {
  const result = runDataConsistencyAudit();
  console.log('----------------------------------------------------');
  console.log(`TOTAL AUDIT ISSUES DISCOVERED: ${result.length}`);
  console.log('----------------------------------------------------');
  if (result.length === 0) {
    console.log('SUCCESS: All 6 mock databases are 100% consistent. Broken references or loose keys: ZERO.');
  } else {
    result.forEach((iss, idx) => {
      console.log(`[${idx + 1}] Severity: ${iss.severity} | Entity: ${iss.entity} | Field: ${iss.field} | Message: ${iss.message}`);
    });
  }
} catch (err) {
  console.error('Audit script execution failed:', err);
}
