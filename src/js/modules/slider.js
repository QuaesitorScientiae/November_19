const slider = (slides, dir, prev, next) => {
    let slideIndex = 1;
    const   items = document.querySelectorAll(slides);

    function showSlides (n) {
        if (n > items.length) {
            slideIndex = 1;
        }

        if (n < 1) {
            slideIndex = items.length;
        }
        
        items.forEach(item => {
            item.style.display = "none";
        });

        items[slideIndex - 1].style.display = "block";
    }

    showSlides (slideIndex);

    function plusSlider(n) {
        showSlides(slideIndex += n);
    }

    try {
        const   prevBtn = document.querySelector(prev),
                nextBtn = document.querySelector(next);

        prevBtn.addEventListener( 'click', () => {
            plusSlider(-1);
        });
        
        nextBtn.addEventListener( 'click', () => {
            plusSlider(1);
        });        
    } catch(e){}


};

export default slider;