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
const photoHeight = 240; // Maintain aspect ratio
const padding = 20;
const framePadding = 10;

canvas.width = photoWidth + framePadding * 2;
canvas.height = (photoHeight + padding) * 3 + framePadding * 2 + 80;

navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } } })
  .then(stream => video.srcObject = stream)
  .catch(err => console.error('Error accessing webcam:', err));

filterSelect.addEventListener('change', () => {
  video.style.filter = filterSelect.value;
});

startButton.onclick = async () => {
  const frameColor = frameColorInput.value;
  const filter = filterSelect.value;
  const customText = customTextInput.value;

  ctx.fillStyle = frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '20px "Dancing Script", cursive';
  ctx.fillStyle = '#000000';

  for (let i = 0; i < 3; i++) {
    await countdown(3);

    const yOffset = framePadding + i * (photoHeight + padding);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(framePadding, yOffset, photoWidth, photoHeight);

    // Draw filtered video frame to canvas
    ctx.drawImage(video, framePadding, yOffset, photoWidth, photoHeight);
  }

  ctx.fillStyle = '#4A4A4A';
  ctx.font = '24px "Dancing Script", cursive';
  ctx.fillText(customText, canvas.width / 2 - ctx.measureText(customText).width / 2, canvas.height - 20);

  prepareDownload();
};

function countdown(seconds) {
  return new Promise(resolve => {
    let timeLeft = seconds;
    countdownEl.textContent = timeLeft;
    countdownEl.style.display = 'block';
    countdownEl.style.backgroundColor = '#E4A6B0';
    countdownEl.style.color = '#FFF';
    countdownEl.style.padding = '10px 20px';
    countdownEl.style.borderRadius = '50px';
    countdownEl.style.position = 'absolute';
    countdownEl.style.top = '50%';
    countdownEl.style.left = '50%';
    countdownEl.style.transform = 'translate(-50%, -50%)';
    countdownEl.style.fontSize = '50px';
    countdownEl.style.fontFamily = '"Dancing Script", cursive';

    const interval = setInterval(() => {
      timeLeft--;
      countdownEl.textContent = timeLeft > 0 ? timeLeft : '';
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
  downloadLink.textContent = 'Download Your Strip';
}
