/*───────────────────────────────────────────────╮
   🎥 𝚴𝚯𝚻 𝐔𝚪 𝚴𝚰𝐋 👑 » Media Tools » media.js
   🔧 Advanced FFmpeg + Sharp-based Tools for Stickers, Audio, Video
╰───────────────────────────────────────────────*/

const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * ✂️ Trim audio file between start & end seconds
 * @param {string} inputPath - Path to audio file
 * @param {number|string} start - Start time (seconds or timestamp)
 * @param {number|string} end - Duration or end time
 * @param {string} filename - Optional output filename
 * @returns {Promise<Buffer>} - MP3 buffer
 */
const audioCut = (inputPath, start, end, filename = "cutted") => new Promise((resolve, reject) => {
  ffmpeg(inputPath)
    .setStartTime(start)
    .setDuration(end)
    .save(`${filename}.mp3`)
    .on("error", e => reject(new Error(e.message)))
    .on("end", () => {
      const file = fs.readFileSync(`${filename}.mp3`);
      resolve(file);
    });
});

/**
 * 🎬 Trim video from buffer between two points
 * @param {Buffer} buffer - Video file buffer
 * @param {number|string} startTrim - Start time
 * @param {number|string} endTrim - End time
 * @returns {Promise<Buffer|false>}
 */
async function trim(buffer, startTrim, endTrim) {
  try {
    const tempFile = path.resolve(__dirname, "../temp.mp4");
    const outputFile = path.resolve(__dirname, "trimmed_video.mp4");
    await fs.promises.writeFile(tempFile, buffer);
    await new Promise((resolve, reject) => {
      ffmpeg(tempFile)
        .setStartTime(startTrim)
        .setDuration(parseFloat(endTrim) - parseFloat(startTrim))
        .output(outputFile)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });
    const file = await fs.promises.readFile(outputFile);
    await fs.promises.unlink(tempFile);
    await fs.promises.unlink(outputFile);
    return file;
  } catch (error) {
    console.error("❌ Video trimming failed:", error.message);
    return false;
  }
}

/**
 * 💫 Create a beautiful rounded sticker from image buffer
 * @param {Buffer} mediaBuffer - Original image buffer
 * @returns {Promise<Buffer>} - Rounded WebP sticker
 */
async function createRoundSticker(mediaBuffer) {
  try {
    const circleSVG = Buffer.from(
      `<svg><circle cx="256" cy="256" r="256" fill="white"/></svg>`
    );

    const roundedSticker = await sharp(mediaBuffer)
      .resize(512, 512)
      .composite([{ input: circleSVG, blend: 'dest-in' }])
      .webp({ quality: 75 })
      .toBuffer();

    return roundedSticker;
  } catch (error) {
    console.error("⚠️ Sticker creation failed:", error.message);
    return false;
  }
}

module.exports = {
  trim,
  audioCut,
  createRoundSticker,
};
