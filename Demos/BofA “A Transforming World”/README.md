# UI prototype template

A starting point for UI prototypes built with our design system. Plain HTML, CSS and JS: no installs, no build step.

## Start a new prototype

1. On GitHub, open this template repo and click **Use this template**.
2. Name your new repo and create it.
3. Clone it to your computer.
4. Open Claude Code in the cloned folder.

## The first thing to say to Claude

> Read CLAUDE.md and ds/DS-GUIDE.md. Then build a prototype of a "video upload" screen: a page title, a drag-and-drop area, a table of recent uploads, and a "Publish" button that opens a confirmation modal.

Describe the screens you want in your own words. Claude follows the rules in `CLAUDE.md` for you.

## Preview

Double-click `index.html`. It opens in your browser. No server needed.

## Deploy

1. In Netlify, add a new site from this GitHub repo.
2. Leave the build command empty.
3. Set the publish directory to the repo root (`.`).

After that, every push to GitHub updates the live URL.

## Update the design system

Tell Claude: **"update the DS to the latest version"**.

Claude updates the `ds/` folder, shows you what changed, and checks every page. To go back, ask Claude to undo the update.

The version you are on is in `ds/VERSION`.
