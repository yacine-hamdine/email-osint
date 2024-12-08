import fs from "fs";
import readline from "readline";

// Function to prompt user input
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

// Function to generate email variations
function generateEmails(name, surname, dob, keywords, domains) {
  const emailList = [];
  
  // Variations of name and surname
  const variations = [
    `${name}${surname}`,
    `${name}.${surname}`,
    `${surname}${name}`,
    `${name}_${surname}`,
    `${name[0]}${surname}`,
    `${surname}.${name[0]}`,
  ];

  // Adding date of birth to variations
  if (dob) {
    const year = dob.split("-")[0];
    variations.push(`${name}${year}`);
    variations.push(`${name}.${surname}${year}`);
  }

  // Adding keywords
  const keywordList = keywords ? keywords.split(",") : [];
  for (const keyword of keywordList) {
    variations.push(`${name}${keyword}`);
    variations.push(`${surname}${keyword}`);
  }

  // Append domains to create full email addresses
  for (const variation of variations) {
    for (const domain of domains) {
      emailList.push(`${variation}@${domain}`);
    }
  }

  return emailList;
}

// Main function
async function main() {
  console.log("Welcome to Email Generator!");

  // Collect user input
  const name = await askQuestion("Enter the first name: ").then((ans) => ans.trim().toLowerCase());
  const surname = await askQuestion("Enter the last name: ").then((ans) => ans.trim().toLowerCase());
  const dob = await askQuestion("Enter the date of birth (YYYY-MM-DD, optional): ");
  const keywords = await askQuestion("Enter any keywords (comma-separated, optional): ");
  const domainInput = await askQuestion("Enter domains (comma-separated, e.g., gmail.com,outlook.com): ");
  
  // Parse domains
  const domains = domainInput.split(",").map((domain) => domain.trim());

  // Generate emails
  const emailList = generateEmails(name, surname, dob, keywords, domains);

  // Output the result
  console.log(`\nGenerated ${emailList.length} emails:`);
  console.log(emailList.join("\n"));

  // Save to file
  const fileName = "emails.txt";
  fs.writeFileSync(fileName, emailList.join("\n"), "utf-8");
  console.log(`\nEmails saved to ${fileName}`);
}

// Run the tool
main();
