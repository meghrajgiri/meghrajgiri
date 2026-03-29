#!/usr/bin/env node

import { createInterface } from "readline";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const PROJECTS_FILE = join(ROOT, "src", "config", "projects.ts");
const PUBLIC_PROJECTS = join(ROOT, "public", "projects");

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question) =>
  new Promise((res) => rl.question(`\n\x1b[36m${question}\x1b[0m\n> `, res));

const askRequired = async (question) => {
  let answer = "";
  while (!answer.trim()) {
    answer = await ask(question);
    if (!answer.trim()) console.log("\x1b[31m  This field is required.\x1b[0m");
  }
  return answer.trim();
};

const askOptional = async (question) => {
  const answer = await ask(`${question} (press Enter to skip)`);
  return answer.trim() || null;
};

const askList = async (question) => {
  const answer = await ask(`${question} (comma-separated)`);
  return answer
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const askChoice = async (question, choices) => {
  const choiceStr = choices.map((c, i) => `  ${i + 1}. ${c}`).join("\n");
  let answer = "";
  while (!answer) {
    answer = await ask(`${question}\n${choiceStr}\nEnter number or value`);
    const num = parseInt(answer);
    if (num >= 1 && num <= choices.length) {
      answer = choices[num - 1];
    } else if (!choices.includes(answer)) {
      // Allow custom values
      if (!answer.trim()) {
        console.log("\x1b[31m  Please select an option.\x1b[0m");
        answer = "";
      }
    }
  }
  return answer;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getProjectFolders() {
  try {
    return readdirSync(PUBLIC_PROJECTS).filter((f) => {
      const full = join(PUBLIC_PROJECTS, f);
      return statSync(full).isDirectory();
    });
  } catch {
    return [];
  }
}

function getImagesInFolder(folder) {
  const dir = join(PUBLIC_PROJECTS, folder);
  try {
    return readdirSync(dir).filter((f) =>
      /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(f),
    );
  } catch {
    return [];
  }
}

function getRootImages() {
  try {
    return readdirSync(PUBLIC_PROJECTS).filter((f) => {
      const full = join(PUBLIC_PROJECTS, f);
      return (
        statSync(full).isFile() && /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(f)
      );
    });
  } catch {
    return [];
  }
}

function getNextId() {
  const content = readFileSync(PROJECTS_FILE, "utf-8");
  const ids = [...content.matchAll(/id:\s*(\d+)/g)].map((m) =>
    parseInt(m[1]),
  );
  return ids.length ? Math.max(...ids) + 1 : 1;
}

function insertProject(project) {
  let content = readFileSync(PROJECTS_FILE, "utf-8");

  // Build the project object string
  const indent = "    ";
  const lines = [
    `${indent}{`,
    `${indent}  id: ${project.id},`,
    `${indent}  title: ${JSON.stringify(project.title)},`,
    `${indent}  description: ${JSON.stringify(project.description)},`,
    `${indent}  longDescription: ${JSON.stringify(project.longDescription)},`,
    `${indent}  image: ${JSON.stringify(project.image)},`,
  ];

  if (project.screenshots.length) {
    lines.push(
      `${indent}  screenshots: ${JSON.stringify(project.screenshots)},`,
    );
  }

  lines.push(
    `${indent}  technologies: ${JSON.stringify(project.technologies)},`,
  );
  lines.push(`${indent}  category: ${JSON.stringify(project.category)},`);
  lines.push(`${indent}  status: ${JSON.stringify(project.status)},`);
  lines.push(`${indent}  year: ${JSON.stringify(project.year)},`);

  // Links
  const linkEntries = [];
  if (project.links.demo) linkEntries.push(`demo: ${JSON.stringify(project.links.demo)}`);
  if (project.links.github) linkEntries.push(`github: ${JSON.stringify(project.links.github)}`);
  if (project.links.case_study) linkEntries.push(`case_study: ${JSON.stringify(project.links.case_study)}`);
  if (linkEntries.length) {
    lines.push(`${indent}  links: {`);
    linkEntries.forEach((entry, i) => {
      const comma = i < linkEntries.length - 1 ? "," : "";
      lines.push(`${indent}    ${entry}${comma}`);
    });
    lines.push(`${indent}  },`);
  } else {
    lines.push(`${indent}  links: {},`);
  }

  // Highlights
  lines.push(`${indent}  highlights: [`);
  project.highlights.forEach((h, i) => {
    const comma = i < project.highlights.length - 1 ? "," : "";
    lines.push(`${indent}    ${JSON.stringify(h)}${comma}`);
  });
  lines.push(`${indent}  ]`);

  lines.push(`${indent}}`);

  const projectStr = lines.join("\n");

  // Find the closing ] of the projects array and insert before it
  const arrayEndRegex = /(\n\s*)\],\s*\n\s*\n?\s*callToAction/;
  const match = content.match(arrayEndRegex);

  if (match) {
    content = content.replace(
      arrayEndRegex,
      `,\n${projectStr}${match[1]}],\n\n  callToAction`,
    );
  } else {
    // Fallback: find last } before ]
    const lastBracket = content.lastIndexOf("}");
    const closingBracket = content.indexOf("]", lastBracket);
    content =
      content.slice(0, lastBracket + 1) +
      `,\n${projectStr}` +
      content.slice(closingBracket);
  }

  writeFileSync(PROJECTS_FILE, content, "utf-8");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("\n\x1b[1m\x1b[35m=== Add New Project ===\x1b[0m\n");

  const project = { links: {} };

  // 1. ID
  project.id = getNextId();
  console.log(`\x1b[33mProject ID: ${project.id} (auto-assigned)\x1b[0m`);

  // 2. Name
  project.title = await askRequired("Project name:");

  // 3. Short description
  project.description = await askRequired(
    "Short description (1-2 sentences for the card):",
  );

  // 4. Long description
  project.longDescription = await askRequired(
    "Long description (detailed overview):",
  );

  // 5. Thumbnail image
  const folders = getProjectFolders();
  const rootImages = getRootImages();

  console.log("\n\x1b[33mAvailable project folders:\x1b[0m");
  folders.forEach((f) => console.log(`  - ${f}/ (${getImagesInFolder(f).length} images)`));
  if (rootImages.length) {
    console.log("\n\x1b[33mRoot-level images:\x1b[0m");
    rootImages.forEach((f) => console.log(`  - ${f}`));
  }

  const imageFolder = await askRequired(
    "Select a folder for this project (or type a folder name):",
  );
  const folderImages = getImagesInFolder(imageFolder);

  if (folderImages.length) {
    console.log(`\n\x1b[33mImages in ${imageFolder}/:\x1b[0m`);
    folderImages.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  // Check for thumbnail or root webp
  const hasThumbnail = folderImages.some((f) => f.startsWith("thumbnail"));
  const hasRootWebp = rootImages.some(
    (f) => f.toLowerCase().startsWith(imageFolder.toLowerCase()) && f.endsWith(".webp"),
  );

  let defaultThumb = null;
  if (hasThumbnail) {
    defaultThumb = `/projects/${imageFolder}/${folderImages.find((f) => f.startsWith("thumbnail"))}`;
  } else if (hasRootWebp) {
    defaultThumb = `/projects/${rootImages.find((f) => f.toLowerCase().startsWith(imageFolder.toLowerCase()))}`;
  }

  if (defaultThumb) {
    console.log(`\n\x1b[33mSuggested thumbnail: ${defaultThumb}\x1b[0m`);
  }

  const thumbInput = await askRequired(
    `Thumbnail image path${defaultThumb ? ` (press Enter for ${defaultThumb})` : ""}.\nEnter image number, filename, or full path:`,
  );

  // Resolve thumbnail
  const thumbNum = parseInt(thumbInput);
  if (defaultThumb && !thumbInput.trim()) {
    project.image = defaultThumb;
  } else if (thumbNum >= 1 && thumbNum <= folderImages.length) {
    project.image = `/projects/${imageFolder}/${folderImages[thumbNum - 1]}`;
  } else if (!thumbInput.includes("/")) {
    project.image = `/projects/${imageFolder}/${thumbInput}`;
  } else {
    project.image = thumbInput;
  }

  // 6. Screenshots (remaining images)
  project.screenshots = folderImages
    .filter((f) => `/projects/${imageFolder}/${f}` !== project.image)
    .map((f) => `/projects/${imageFolder}/${f}`);

  if (project.screenshots.length) {
    console.log(
      `\n\x1b[33m${project.screenshots.length} screenshots auto-added from folder.\x1b[0m`,
    );
  }

  // 7. Technologies
  project.technologies = await askList(
    "Technologies used (e.g. React, Node.js, TypeScript):",
  );
  while (!project.technologies.length) {
    console.log("\x1b[31m  Add at least one technology.\x1b[0m");
    project.technologies = await askList(
      "Technologies used (e.g. React, Node.js, TypeScript):",
    );
  }

  // 8. Category
  project.category = await askChoice("Project category:", [
    "Fin-Tech",
    "Ed-Tech",
    "E-Commerce",
    "Web3",
    "SaaS",
    "Social",
    "Healthcare",
    "Other",
  ]);

  // 9. Status
  project.status = await askChoice("Project status:", [
    "Completed",
    "In Progress",
    "Maintained",
  ]);

  // 10. Year
  project.year = await askRequired("Year completed (e.g. 2024):");

  // 11. Links
  project.links.demo = await askOptional("Live demo URL:");
  project.links.github = await askOptional("GitHub repo URL:");
  project.links.case_study = await askOptional("Case study URL:");

  // 12. Highlights
  console.log("");
  project.highlights = await askList(
    "Key highlights/features (e.g. Real-time chat, OAuth2 login):",
  );

  // ---------------------------------------------------------------------------
  // Confirm & save
  // ---------------------------------------------------------------------------
  console.log("\n\x1b[1m\x1b[35m=== Project Preview ===\x1b[0m\n");
  console.log(`  Title:        ${project.title}`);
  console.log(`  Description:  ${project.description}`);
  console.log(`  Image:        ${project.image}`);
  console.log(`  Screenshots:  ${project.screenshots.length} images`);
  console.log(`  Tech:         ${project.technologies.join(", ")}`);
  console.log(`  Category:     ${project.category}`);
  console.log(`  Status:       ${project.status}`);
  console.log(`  Year:         ${project.year}`);
  console.log(`  Links:        ${Object.values(project.links).filter(Boolean).length} links`);
  console.log(`  Highlights:   ${project.highlights.length} items`);

  const confirm = await ask("Save this project? (y/n)");

  if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
    insertProject(project);
    console.log(
      `\n\x1b[32m  Project "${project.title}" added to projects.ts!\x1b[0m\n`,
    );
  } else {
    console.log("\n\x1b[31m  Cancelled.\x1b[0m\n");
  }

  rl.close();
}

main().catch((err) => {
  console.error("\x1b[31mError:\x1b[0m", err.message);
  rl.close();
  process.exit(1);
});
