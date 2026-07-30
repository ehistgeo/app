// Add interactivity to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.class-button, .ent-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Links will open automatically due to target="_blank"
            // This is just for additional interactivity if needed
        });
    });
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});