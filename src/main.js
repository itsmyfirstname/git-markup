import * as core from '@actions/core'
import { Octokit } from "octokit";
import * as fs from 'fs'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
function readMarkdownNode(filePath) {
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    return file;
  } catch (error) {
    console.error("Could not read or parse the Markdown file:", error);
    return null;
  }
}

async function postMarkdownToPR(owner, repo, prNumber, markdownContent, githubToken) {
  const octokit = new Octokit({ auth: githubToken });

  try {
    await octokit.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: prNumber,
      body: markdownContent,
    });
    console.log("Markdown content posted to PR successfully.");
  } catch (error) {
    console.error("Error posting Markdown content to PR:", error);
  }
}

export async function run() {
  try {
    const path = core.getInput('message-file')
    const githubToken = core.getInput('token')
    const prNumber = process.env.GITHUB_REF_NAME
    const owner = process.env.GITHUB_REPOSITORY_OWNER
    const repo = process.env.GITHUB_REPOSITORY

    const markdownContent = readMarkdownNode(path)
    postMarkdownToPR(owner, repo, prNumber, markdownContent,githubToken)

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }

}
