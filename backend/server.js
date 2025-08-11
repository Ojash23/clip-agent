// CommonJS for Node stable images
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const STORAGE = process.env.STORAGE_PATH || path.join(__dirname,'uploads');
if(!fs.existsSync(STORAGE)) fs.mkdirSync(STORAGE, { recursive:true });

const upload = multer({ dest: STORAGE });
const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/', (req,res)=> res.json({ok:true}));

// Cut endpoint
app.post('/api/cut', upload.single('video'), async (req,res) => {
  try {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const clipLen = Math.max(1, parseInt(req.body.clipLength || 15));
    const inputPath = req.file.path;
    const clipId = uuidv4();
    const outDir = path.join(STORAGE, clipId);
    fs.mkdirSync(outDir);
    const outFile = path.join(outDir, `${clipId}.mp4`);

    // create a fixed cut: start at 0 (you can replace with smarter logic)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(0)
        .setDuration(clipLen)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(['-preset veryfast','-crf 23'])
        .save(outFile)
        .on('end', resolve)
        .on('error', reject);
    });

    // mock virality score
    const viralityScore = Math.floor(Math.random()*40) + 60;
    // produce a public path served by express static middleware
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${clipId}/${clipId}.mp4`;

    // delete the input file to save space
    try { fs.unlinkSync(inputPath); } catch(e){/*ignore*/}

    return res.json({ clipId, clipUrl: publicUrl, viralityScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'processing_failed', details: err.message });
  }
});

// serve uploads
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.listen(PORT, ()=> console.log('ClipAgent backend running on', PORT));
