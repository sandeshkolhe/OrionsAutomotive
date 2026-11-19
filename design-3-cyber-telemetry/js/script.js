document.addEventListener('DOMContentLoaded', () => {
  console.log('Design 3: Cyber Velocity Telemetry Lab active');
  
  // Real-time ping simulation
  const pingElement = document.getElementById('ping-indicator');
  if (pingElement) {
    setInterval(() => {
      const ping = Math.floor(Math.random() * 8) + 12;
      pingElement.textContent = `${ping}ms`;
    }, 3000);
  }
});
