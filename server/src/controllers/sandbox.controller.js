/**
 * @file sandbox.controller.js
 * @description Controller handling sandbox isolated execution testing and cryptographic verification */

const { generateVerifiedProofOfWork, verifyProofOfWorkToken } = require('../services/sandbox.service');

/**
 * Controller handling POST /api/sandbox/generate.
 * Generates verified sandbox telemetry and signs the payload cryptographically.
 */
async function generateSandboxProofController(req, res, next) {
  try {
    const { githubRepoUrl, astReport } = req.body;

    const proof = generateVerifiedProofOfWork(githubRepoUrl, astReport);

    res.status(201).json({
      success: true,
      proof,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller handling GET /api/sandbox/verify/:token.
 * Checks cryptographic signature validity on sandbox report tokens.
 */
async function verifySandboxTokenController(req, res, next) {
  try {
    const { token } = req.params;

    const verificationResult = verifyProofOfWorkToken(token);

    if (!verificationResult.isValid) {
      return res.status(401).json({
        success: false,
        message: verificationResult.message,
      });
    }

    res.json({
      success: true,
      verifiedReport: verificationResult.payload,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generateSandboxProofController,
  verifySandboxTokenController,
};
