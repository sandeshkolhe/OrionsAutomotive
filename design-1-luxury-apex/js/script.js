document.addEventListener('DOMContentLoaded', () => {
  console.log('Design 1: Luxury Apex initialized');
  
  // Simple toast feedback for buttons
  const ctaButtons = document.querySelectorAll('.btn-primary');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') {
        e.preventDefault();
        alert('Thank you for choosing Orionis Automotive. Please call us at +91 86550 22122 or email accounts@orionis.co.in to book your consultation.');
      }
    });
  });
});
