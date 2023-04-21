/*
# Gatsby Blog Post
- Check that the blog directory exists 
- Asks for a title
- Creates a folder and new markdown file (hyphenated title) in blog/content directory
- Opens the file in VScode
- Adds a timestamp to frontmatter
*/

// Name: New Post

import { createPathResolver } from "@johnlindquist/kit";

const journalDir = await env("BLOG_CONTENT_DIR", async () => {
  setDescription(`Select a Blog Content Directory`);
  return await path();
});

const blogDirectory = createPathResolver(journalDir);
await ensureDir(blogDirectory());
cd(blogDirectory());

// get the title
let title = await arg("Title:");

// build up the frontmatter
// get the date for year month and day
const data = new Date();
const year = data.getFullYear();
const month = String(data.getMonth() + 1).padStart(2, "0");
const day = String(data.getDate()).padStart(2, "0");
let dashedDate = `${year}-${month}-${day}`;
let blogDate = dashedDate + "T22Z";

let frontmatter = `---
title: ${title}
date: ${blogDate}
tags: 
---`;

// create the folder by title with lowercase and hyphenated
let folder = title.toLowerCase().replace(/ /g, "-");
// check if that folder exists
let folderExists = await isDir(blogDirectory(folder));
// if it doesn't exist, create it
if (!folderExists) {
  await ensureDir(blogDirectory(folder));
}

// add index into new folder and add frontmatter
let filePath = blogDirectory(folder, "index.md");
await writeFile(filePath, frontmatter);

// ask what folder to open in vscode
const repoDir = await env("BLOG_DIR", async () => {
  setDescription(`Select a Blog Directory`);
  return await path();
});

// open the repoDir in vscode and the file as a new window
await applescript(String.raw`
  tell application "Visual Studio Code"
    activate
    open "${repoDir}"
    open "${filePath}"
  end tell
`);

// close kit window
exit();
