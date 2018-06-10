require('babel-register');
const path = require('path');
const fs = require('fs');

export const initReferral = model => {
  const filePath = path.join(__dirname, 'referral.json');
  const json = fs.readFileSync(filePath, 'utf8');

  model.create({
    name: 'REFERRAL-METADATA',
    setting: JSON.parse(json),
    description: 'Referal metadata'
  });
};

export const initTask = model => {
  const filePath = path.join(__dirname, 'studyTask.json');
  const json = fs.readFileSync(filePath, 'utf8');

  model.create({
    name: 'STUDY-TASK',
    setting: JSON.parse(json),
    description: 'Study Task'
  });
};
