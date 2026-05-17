async function loadSlider() {
    try {
        const res = await fetch('/savedJobs');
        const jobs = await res.json();

        const slider = document.getElementById('logoSlider');

        // avoid duplicate logos
        const used = new Set();

        jobs.forEach((job) => {
            if (!job.logoURL || used.has(job.logoURL)) {
                return;
            }

            used.add(job.logoURL);

            const slide = document.createElement('div');
            slide.className = 'swiper-slide';

            slide.innerHTML = `
                <div class="logoCard">
                    <img src="${job.logoURL}" alt="${job.companyName}" class="galleryLogo">
                    <p>${job.companyName}</p>
                    <p>${job.jobTitle}</p>
                </div>
            `;

            slider.appendChild(slide);
        });

            const swiper = new Swiper('.swiper', {
            
            direction: 'horizontal',
            loop: true,
            
            pagination: {
                el: '.swiper-pagination',
            },
            
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    } catch (e) {
        console.log(e);
    }
}

loadSlider();