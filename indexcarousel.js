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
        // Read the actual rendered width of one slide as a % of the track.
        // On desktop each slide is 50% wide (2 visible), on mobile 100% (1 visible).
        // Using the live pixel widths keeps the math correct at every breakpoint.
        const slideWidthPercent = (slides[0].offsetWidth / track.offsetWidth) * 100;
        track.style.transform = `translateX(-${currentIndex * slideWidthPercent}%)`;
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