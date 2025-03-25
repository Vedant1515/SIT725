document.addEventListener('DOMContentLoaded', function() {
    // Initialize 
    M.AutoInit();
    
    // CLICK ME!
    document.getElementById('clickMeBtn').addEventListener('click', function() {
      M.toast({
        html: 'Thanks for clicking!',
        classes: 'rounded green',
        displayLength: 2000
      });
    });
    
    // CARD CLICK
    document.querySelectorAll('.card').forEach(function(card) {
      card.addEventListener('click', function() {
        const title = this.querySelector('.card-title').textContent;
        M.toast({
          html: `This is Ramdom Image ${title}`,
          classes: 'blue lighten-1',
          displayLength: 2000
        });
      });
    });
  });