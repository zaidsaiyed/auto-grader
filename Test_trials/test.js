const { exec } = require('child_process');

// Define the path to the Python script
const pythonScriptPath = 'Test_trials/pri_test.py';

// Execute the Python script as a child process
exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Python script: ${error}`);
    //console.error(`Error executing Python script: Failed`);
    return;
  }

  // Process the output from the Python script
  console.log(`Python script output: ${stdout}`);
});