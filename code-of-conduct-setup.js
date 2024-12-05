const fs = require('fs');
const path = require('path');

/**
 * Generates and writes the Code of Conduct file
 */
function setupCodeOfConduct() {
    const codeOfConductPath = path.join('CODE_OF_CONDUCT.md');

    const content = `# SpiceTime Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members
* Being supportive of peers during the learning process

Examples of unacceptable behavior:

* The use of sexualized language or imagery, and sexual attention or advances
* Trolling, insulting or derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information without explicit permission
* Misuse of AI agents or computational resources
* Other conduct which could reasonably be considered inappropriate in a professional setting

## Responsibilities

Project maintainers are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, and will communicate reasons for moderation decisions when appropriate.

## Scope

This Code of Conduct applies within all project spaces, including:

* Code repositories
* Documentation sites
* Communication channels
* Project forums and chat rooms
* Project events and meetings
* Interactions with project AI agents

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project team responsible for enforcement. All complaints will be reviewed and investigated promptly and fairly.

Project maintainers are obligated to respect the privacy and security of the reporter of any incident.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.1.`;

    try {
        fs.writeFileSync(codeOfConductPath, content);
        console.log('✨ Created CODE_OF_CONDUCT.md in root directory');
    } catch (error) {
        console.error('Error creating Code of Conduct:', error);
        process.exit(1);
    }
}

// Execute if run directly
if (require.main === module) {
    setupCodeOfConduct();
}

module.exports = setupCodeOfConduct;
