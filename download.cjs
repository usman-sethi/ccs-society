const { execSync } = require('child_process');
try {
  console.log("Downloading video...");
  execSync('ffmpeg -y -i "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8" -c copy public/bg-video.mp4', { stdio: 'inherit' });
  console.log("Download complete!");
} catch (e) {
  console.error("FFmpeg error", e);
}
