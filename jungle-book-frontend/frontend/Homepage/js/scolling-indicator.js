document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.startWrapper');
    let currentSection = 0;
  
    function scrollToNextSection() {
      if (currentSection < sections.length - 1) {
        currentSection++;
      } else {
        currentSection = 0;
      }
      sections[currentSection].scrollIntoView({ behavior: 'smooth' });
      updateArrowDirection();
    }
  
    function updateArrowDirection() {
      const scrollIndicator = document.getElementById('scroll-indicator');
      if (currentSection === sections.length - 1) {
        scrollIndicator.innerHTML = '&#x25B2;';
      } else {
        scrollIndicator.innerHTML = '&#x25BC;';
      }
    }
  
    document.getElementById('scroll-indicator').addEventListener('click', scrollToNextSection);
  
    window.addEventListener('scroll', function() {
      const scrollIndicator = document.getElementById('scroll-indicator');
      if (window.scrollY > 50) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    });
  
    updateArrowDirection();
  });
  