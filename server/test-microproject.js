require('dotenv').config();
const { generateMicroProject } = require('./src/services/microProject.service');

async function testMicroProject() {
  console.log('🧪 Starting Micro-Project Generator Test...\n');

  try {
    const project = await generateMicroProject('Kafka & Event-Driven Architecture', 'Senior Backend Engineer');
    console.log('✅ Micro-Project Generated Successfully!\n');
    console.log('--------------------------------------------------');
    console.log('Project Name:\n', project.projectName);
    console.log('\nTarget Skill:\n', project.targetSkill);
    console.log('\nProject Brief:\n', project.projectBrief);
    console.log('\nArchitecture Specs:\n', project.architectureSpecs);
    console.log('\nFolder Structure:\n', project.folderStructure);
    console.log('\nPrewritten Test Cases:\n', JSON.stringify(project.prewrittenTestCases, null, 2));
    console.log('\nGitHub Instructions:\n', project.githubBoilerplateInstructions);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('❌ Micro-Project Test Failed:', err);
  }
}

testMicroProject();
