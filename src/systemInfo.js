import os from 'os';

export function getSystemInfo() {
  console.log('--- System Info ---');
  console.log('Platform:', os.platform());
  console.log('CPU Cores:', os.cpus().length);
  console.log('Total Memory (GB):', (os.totalmem() / (1024 ** 3)).toFixed(2));
  console.log('Free Memory (GB):', (os.freemem() / (1024 ** 3)).toFixed(2));
  console.log('Home Directory:', os.homedir());
  console.log('-------------------');
}