const video = document.getElementById('video');
const canvas = document.getElementById('stripCanvas');
const ctx = canvas.getContext('2d');
const countdownEl = document.getElementById('countdown');
const filterSelect = document.getElementById('filterSelect');
const frameColorInput = document.getElementById('frameColor');
const downloadLink = document.getElementById('downloadLink');
const startButton = document.getElementById('startButton');
const customTextInput = document.getElementById('customText');

const photoWidth = 320;
const photoHeight = 240;
const padding = 20;
const framePadding = 10;

// Set canvas size to fit 3 photos + frame
canvas.width = photoWidth + framePadding * 2;
canvas.height = (photoHeight + padding) * 3 + framePadding * 2 + 100;

// Access webcam
navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } } })
  .then(stream => video.srcObject = stream)
  .catch(err => console.error('Error accessing webcam:', err));

// Apply real-time filter effect
filterSelect.addEventListener('change', () => {
  video.style.filter = filterSelect.value;
});

startButton.onclick = async () => {
  const frameColor = frameColorInput.value;
  const filter = filterSelect.value;
  const customText = customTextInput.value;

  // Clear the canvas with frame color
  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add beautiful frame border
  ctx.strokeStyle = '#E4A6B0';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Capture 3 photos with countdown
  for (let i = 0; i < 3; i++) {
    await countdown(3);

    const yOffset = framePadding + i * (photoHeight + padding);

    // Add white background for each photo
    ctx.fillStyle = '#FFF';
    ctx.fillRect(framePadding, yOffset, photoWidth, photoHeight);

    ctx.save();

    // Apply filter and capture image
    ctx.filter = filter;

    // Calculate perfect aspect ratio
    const aspectRatio = video.videoWidth / video.videoHeight;
    const targetAspectRatio = photoWidth / photoHeight;

    let sx, sy, sWidth, sHeight;
    if (aspectRatio > targetAspectRatio) {
      sHeight = video.videoHeight;
      sWidth = sHeight * targetAspectRatio;
      sx = (video.videoWidth - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = video.videoWidth;
      sHeight = sWidth / targetAspectRatio;
      sx = 0;
      sy = (video.videoHeight - sHeight) / 2;
    }

    // Draw the image on canvas
    ctx.drawImage(video, sx, sy, sWidth, sHeight, framePadding, yOffset, photoWidth, photoHeight);
    ctx.restore();
  }

  // Add custom text at the bottom
  ctx.fillStyle = '#4A4A4A';
  ctx.font = '24px "Dancing Script", cursive';
  ctx.fillText(customText, canvas.width / 2 - ctx.measureText(customText).width / 2, canvas.height - 30);

  // Prepare downloadable strip
  prepareDownload();
};

function countdown(seconds) {
  return new Promise(resolve => {
    let timeLeft = seconds;
    countdownEl.textContent = timeLeft;
    countdownEl.style.display = 'block';
    countdownEl.style.backgroundColor = '#E4A6B0';
    countdownEl.style.color = '#FFF';
    countdownEl.style.padding = '20px 40px';
    countdownEl.style.borderRadius = '50px';
    countdownEl.style.position = 'absolute';
    countdownEl.style.top = '50%';
    countdownEl.style.left = '50%';
    countdownEl.style.transform = 'translate(-50%, -50%)';
    countdownEl.style.fontSize = '60px';
    countdownEl.style.fontFamily = '"Dancing Script", cursive';
    countdownEl.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';

    const interval = setInterval(() => {
      timeLeft--;
      countdownEl.textContent = timeLeft > 0 ? timeLeft : '📸';
      if (timeLeft <= 0) {
        clearInterval(interval);
        countdownEl.style.display = 'none';
        resolve();
      }
    }, 1000);
  });
}

function prepareDownload() {
  const image = canvas.toDataURL('image/png');
  downloadLink.href = image;
  downloadLink.download = 'vintage_photo_strip.png';
  downloadLink.textContent = '✨ Download Your Photo Strip';
  downloadLink.style.display = 'block';
  downloadLink.style.textAlign = 'center';
  downloadLink.style.marginTop = '20px';
}
