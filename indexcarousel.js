document.addEventListener("DOMContentLoaded", () => {
    // Select the track and the buttons
    const track = document.getElementById("carousel-track");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    
    // Get all the individual slides
    const slides = Array.from(track.children);
    
    // Keep track of the current slide index (starts at 0)
    let currentIndex = 0;

    // Function to move the track to the correct slide
    const updateCarousel = () => {
        // The magic number: width of one slide is 100% of the container
        // Shifting -100% moves to slide 2, -200% moves to slide 3, etc.
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Next Button Click Event
    nextBtn.addEventListener("click", () => {
        // If we are at the last slide, loop back to the first one (0)
        if (currentIndex === slides.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateCarousel();
    });

    // Previous Button Click Event
    prevBtn.addEventListener("click", () => {
        // If we are at the first slide, loop to the very last one
        if (currentIndex === 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex--;
        }
        updateCarousel();
    });
});