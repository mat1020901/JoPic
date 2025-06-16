function getSeriesFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('series'); // e.g., "cheryl", "all", etc.
}

let selectedSeries = getSeriesFromURL();
let imagesAndVideos = [];

// If no series or 'all', combine everything
if (!selectedSeries || selectedSeries === 'all') {
  for (let key in mediaSeries) {
    imagesAndVideos = imagesAndVideos.concat(mediaSeries[key]);
  }
} else if (mediaSeries[selectedSeries]) {
  // Valid series found
  imagesAndVideos = mediaSeries[selectedSeries];
} else {
  // Invalid series, fallback to combining all
  for (let key in mediaSeries) {
    imagesAndVideos = imagesAndVideos.concat(mediaSeries[key]);
  }
}
    
        // Shuffle function to randomize the array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Swap elements
            }
        }
    
        // Shuffle the array on page load
        shuffleArray(imagesAndVideos);
    
        let currentIndex = 0;
        let progressBar = document.getElementById("progress-bar");
        const imageElement = document.getElementById("image");
        const videoElement = document.getElementById("video");
        const pauseSymbol = document.getElementById("pause-symbol");
        const bodyElement = document.body;
    
        const firstImage = imagesAndVideos[currentIndex]; // Randomized first image
        imageElement.src = firstImage;

        let progressInterval;
        let currentProgress = 0;
        let paused = false;
    
        function updateProgressBar() {
            if (paused) return;
    
            currentProgress = 0;
            progressBar.style.width = "0%";
    
            if (progressInterval) {
                clearInterval(progressInterval);
            }
    
            if (isVideo(imagesAndVideos[currentIndex])) {
                imageElement.style.display = 'none';
                videoElement.style.display = 'block';
                videoElement.play();
                videoElement.onended = () => {
                    if (!paused) {
                        changeImage();
                    }
                };
                return;
            }
    
            progressInterval = setInterval(() => {
                currentProgress += 1;
                progressBar.style.width = currentProgress + "%";
                if (currentProgress >= 100) {
                    clearInterval(progressInterval);
                    if (!paused) changeImage();
                }
            }, 30);
        }
    
        function preloadImage(src, callback) {
            const img = new Image();
            img.src = src;
            img.onload = callback;
        }
    
        function changeImage() {
            if (paused) return;
    
            if (videoElement.style.display === 'block') {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
    
            currentIndex = (currentIndex + 1) % imagesAndVideos.length;
            const nextSrc = imagesAndVideos[currentIndex];
    
            preloadImage(nextSrc, () => {
                if (isVideo(nextSrc)) {
                    imageElement.style.display = 'none';
                    videoElement.style.display = 'block';
                    videoElement.src = nextSrc;
                    videoElement.play();
                } else {
                    imageElement.style.display = 'block';
                    videoElement.style.display = 'none';
                    imageElement.src = nextSrc;
                }
            });
    
            resetProgressBar();
        }
    
        function previousImage() {
            if (paused) return;
    
            if (videoElement.style.display === 'block') {
                videoElement.pause();
                videoElement.currentTime = 0;
            }
    
            currentIndex = (currentIndex - 1 + imagesAndVideos.length) % imagesAndVideos.length;
            const prevSrc = imagesAndVideos[currentIndex];
    
            preloadImage(prevSrc, () => {
                if (isVideo(prevSrc)) {
                    imageElement.style.display = 'none';
                    videoElement.style.display = 'block';
                    videoElement.src = prevSrc;
                    videoElement.play();
                } else {
                    imageElement.style.display = 'block';
                    videoElement.style.display = 'none';
                    imageElement.src = prevSrc;
                }
            });
    
            resetProgressBar();
        }
    
        function resetProgressBar() {
            setTimeout(() => {
                updateProgressBar();
            }, 100);
        }
    
        function handleTouch(event) {
            const screenWidth = window.innerWidth;
            const touchX = event.touches[0].clientX;
    
            if (touchX < screenWidth / 3) {
                previousImage();
            } else if (touchX > screenWidth * 0.6) {
                changeImage();
            } else {
                paused = !paused;
                if (!paused) {
                    updateProgressBar();
                }
                togglePauseSymbol();
            }
        }
    
        function togglePauseSymbol() {
            const progressBarContainer = document.getElementById("progress-bar-container");
    
            if (paused) {
                pauseSymbol.style.display = "block";
                bodyElement.classList.add("paused");
                progressBarContainer.style.display = "none";
    
                if (videoElement.style.display === 'block') {
                    videoElement.loop = true;
                }
            } else {
                pauseSymbol.style.display = "none";
                bodyElement.classList.remove("paused");
                progressBarContainer.style.display = "block";
    
                videoElement.loop = false;
            }
        }
    
        function isVideo(src) {
            return src.endsWith('.mp4') || src.endsWith('.MP4') || src.endsWith('.mov') || src.endsWith('.avi');
        }
    
        // Event listeners
        document.addEventListener("touchstart", handleTouch);
    
        // Initialize the slideshow
        resetProgressBar();