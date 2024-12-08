import chalk from "chalk";
import axios from "axios";
import fs from "fs";

// Hunter API key (replace with your actual key)
const API_KEY = "0c6e1d8e3d2a181b9dbaae53f86fd344e86f8ec3";

// Function to validate an email using Hunter API
async function validateEmail(email) {
  try {
    const response = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
      params: {
        email: email,
        api_key: API_KEY,
      },
    });

    if (response.data && response.data.data) {
      const status = response.data.data.status;
      return { email, status };
    }
    return { email, status: "Unknown (no data)" };
  } catch (error) {
    return { email, status: `Error: ${error.message}` };
  }
}

// Function to process a list of emails from a text file
async function processEmails(filePath) {
  try {
    // Read emails from the file
    const fileData = fs.readFileSync(filePath, "utf-8");
    const emails = fileData.split("\n").filter((email) => email.trim() !== "");

    console.log("Validating emails...\n");

    // Validate emails one by one
    for (const email of emails) {
      const result = await validateEmail(email.trim());
      
      // Apply colors based on the status
      let coloredStatus;
      if (result.status === "valid") {
        coloredStatus = chalk.green(result.status);
      } else if (result.status === "invalid") {
        coloredStatus = chalk.red(result.status);
      } else {
        coloredStatus = chalk.yellow(result.status);
      }

      console.log(`Email: ${result.email}, Status: ${coloredStatus}`);
    }

    console.log("\nEmail validation complete.");
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
}

// Run the script with the emails.txt file
processEmails("emails.txt");
