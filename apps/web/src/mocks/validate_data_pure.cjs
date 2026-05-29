const fs = require('fs');
const path = require('path');

console.log('--- Nature Tek Solar PMS: Pure JavaScript CommonJS Auditing Tool ---');

const mocksDir = __dirname;
const userFilePath = path.join(mocksDir, 'userMockData.ts');
const projectFilePath = path.join(mocksDir, 'projectMockData.ts');
const taskFilePath = path.join(mocksDir, 'taskMockData.ts');
const milestoneFilePath = path.join(mocksDir, 'milestoneMockData.ts');
const documentFilePath = path.join(mocksDir, 'documentMockData.ts');
const alertFilePath = path.join(mocksDir, 'alertMockData.ts');

function extractIDs(filePath, pattern) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ids = new Set();
  let match;
  const regex = new RegExp(pattern, 'g');
  while ((match = regex.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

const userIDs = extractIDs(userFilePath, /id:\s*['"](u-\d+)['"]/);
const projectIDs = extractIDs(projectFilePath, /id:\s*['"](p-\d+)['"]/);
const taskIDs = extractIDs(taskFilePath, /id:\s*['"](t-\d+)['"]/);
const milestoneIDs = extractIDs(milestoneFilePath, /id:\s*['"](m-\d+)['"]/);
const documentIDs = extractIDs(documentFilePath, /id:\s*['"](d-\d+)['"]/);
const alertIDs = extractIDs(alertFilePath, /id:\s*['"](a-\d+)['"]/);

console.log(`Extracted IDs:
  - Users: ${userIDs.size} records
  - Projects: ${projectIDs.size} records
  - Tasks: ${taskIDs.size} records
  - Milestones: ${milestoneIDs.size} records
  - Documents: ${documentIDs.size} records
  - Alerts: ${alertIDs.size} records
`);

const issues = [];

const taskContent = fs.readFileSync(taskFilePath, 'utf8');
const taskBlockRegex = /\{\s*id:\s*['"](t-\d+)['"][\s\S]*?\}/g;
let match;
while ((match = taskBlockRegex.exec(taskContent)) !== null) {
  const block = match[0];
  const tId = match[1];

  const pIdMatch = /projectId:\s*['"](p-\d+)['"]/.exec(block);
  const uIdMatch = /assignedTo:\s*['"](u-\d+)['"]/.exec(block);
  const mIdMatch = /milestoneId:\s*['"](m-\d+)['"]/.exec(block);

  if (pIdMatch) {
    const pId = pIdMatch[1];
    if (!projectIDs.has(pId)) {
      issues.push(`TASK [${tId}] has broken reference to non-existent Project ID [${pId}]`);
    }
  } else {
    issues.push(`TASK [${tId}] is missing projectId relationship!`);
  }

  if (uIdMatch) {
    const uId = uIdMatch[1];
    if (!userIDs.has(uId)) {
      issues.push(`TASK [${tId}] has broken reference to non-existent User ID [${uId}]`);
    }
  }

  if (mIdMatch) {
    const mId = mIdMatch[1];
    if (!milestoneIDs.has(mId)) {
      issues.push(`TASK [${tId}] has broken reference to non-existent Milestone ID [${mId}]`);
    }
  }
}

const milestoneContent = fs.readFileSync(milestoneFilePath, 'utf8');
const milestoneBlockRegex = /\{\s*id:\s*['"](m-\d+)['"][\s\S]*?\}/g;
while ((match = milestoneBlockRegex.exec(milestoneContent)) !== null) {
  const block = match[0];
  const mId = match[1];

  const pIdMatch = /projectId:\s*['"](p-\d+)['"]/.exec(block);
  if (pIdMatch) {
    const pId = pIdMatch[1];
    if (!projectIDs.has(pId)) {
      issues.push(`MILESTONE [${mId}] has broken reference to non-existent Project ID [${pId}]`);
    }
  } else {
    issues.push(`MILESTONE [${mId}] is missing projectId relationship!`);
  }

  const predMatch = /predecessorId:\s*['"](m-\d+)['"]/.exec(block);
  const succMatch = /successorId:\s*['"](m-\d+)['"]/.exec(block);
  if (predMatch && !milestoneIDs.has(predMatch[1])) {
    issues.push(`MILESTONE [${mId}] predecessor ID [${predMatch[1]}] does not exist`);
  }
  if (succMatch && !milestoneIDs.has(succMatch[1])) {
    issues.push(`MILESTONE [${mId}] successor ID [${succMatch[1]}] does not exist`);
  }
}

const docContent = fs.readFileSync(documentFilePath, 'utf8');
const docBlockRegex = /\{\s*id:\s*['"](d-\d+)['"][\s\S]*?\}/g;
while ((match = docBlockRegex.exec(docContent)) !== null) {
  const block = match[0];
  const dId = match[1];

  const pIdMatch = /projectId:\s*['"](p-\d+)['"]/.exec(block);
  if (pIdMatch) {
    const pId = pIdMatch[1];
    if (!projectIDs.has(pId)) {
      issues.push(`DOCUMENT [${dId}] has broken reference to non-existent Project ID [${pId}]`);
    }
  } else {
    issues.push(`DOCUMENT [${dId}] is missing projectId relationship!`);
  }
}

const alertContent = fs.readFileSync(alertFilePath, 'utf8');
const alertBlockRegex = /\{\s*id:\s*['"](a-\d+)['"][\s\S]*?\}/g;
while ((match = alertBlockRegex.exec(alertContent)) !== null) {
  const block = match[0];
  const aId = match[1];

  const pIdMatch = /projectId:\s*['"](p-\d+)['"]/.exec(block);
  const relIdMatch = /relatedId:\s*['"]([a-z]-\d+)['"]/.exec(block);

  if (pIdMatch) {
    const pId = pIdMatch[1];
    if (!projectIDs.has(pId)) {
      issues.push(`ALERT [${aId}] has broken reference to non-existent Project ID [${pId}]`);
    }
  }

  if (relIdMatch) {
    const relId = relIdMatch[1];
    const prefix = relId.split('-')[0];
    let exists = false;
    if (prefix === 'p') exists = projectIDs.has(relId);
    else if (prefix === 't') exists = taskIDs.has(relId);
    else if (prefix === 'm') exists = milestoneIDs.has(relId);
    else if (prefix === 'd') exists = documentIDs.has(relId);
    else if (prefix === 'u') exists = userIDs.has(relId);

    if (!exists) {
      issues.push(`ALERT [${aId}] related resource ID [${relId}] does not exist in any registry`);
    }
  }
}

console.log('----------------------------------------------------');
console.log(`TOTAL AUDIT ISSUES DISCOVERED: ${issues.length}`);
console.log('----------------------------------------------------');
if (issues.length === 0) {
  console.log('SUCCESS: All 6 mock databases are 100% consistent. Broken references or loose keys: ZERO.');
} else {
  issues.forEach((iss, idx) => {
    console.log(`[${idx + 1}] ${iss}`);
  });
}
