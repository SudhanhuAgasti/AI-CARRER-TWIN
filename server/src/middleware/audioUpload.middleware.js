const multer = require('multer');

const storage = multer.memoryStorage();

const ALLOWED_AUDIO_MIME = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mp3',
  'audio/mpeg',
  'audio/ogg',
  'audio/webm',
]);

const audioUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB cap for audio files
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_AUDIO_MIME.has(file.mimetype)) {
      return cb(new Error('Unsupported audio format. Supported: WAV, MP3, OGG, WEBM'));
    }
    cb(null, true);
  },
});

module.exports = audioUpload;
