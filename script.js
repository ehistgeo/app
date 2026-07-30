// Add interactivity to tiles
document.addEventListener('DOMContentLoaded', function() {
    const tiles = document.querySelectorAll('.tile');
    
    tiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const link = this.querySelector('.tile-link');
            if (link && link.href !== '#') {
                window.open(link.href, '_blank');
            }
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