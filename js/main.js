var glidejs = require('../node_modules/@glidejs/glide/dist/glide.min.js');

var MicroModal = require('../node_modules/micromodal/dist/micromodal.min.js');

var scrolloverflow = require('../node_modules/fullpage.js/vendors/scrolloverflow.min.js');
var fullPage = require('../node_modules/fullpage.js/dist/fullpage.js');

(function() {

    var inputs = document.querySelectorAll('.form-field input, .form-field textarea');
    var teams = document.querySelectorAll('.team-member');

    var sectionTitled = document.querySelectorAll('.section-titled');
    var sectionHero = document.querySelectorAll('.section-hero');
    var sectionProjects = document.querySelectorAll('.section-projects');

    var projectTitle = document.querySelectorAll('.project-title');
    var projectCategory = document.querySelectorAll('.project-category');
    var projectImage = document.querySelectorAll('.project-image');
    var projectLinks = document.querySelectorAll('.project-links');

    var transformElements = [
        {elements: projectTitle, steps:60, negative:false},
        {elements: projectCategory, steps:40, negative:false},
        {elements: projectImage, steps:20, negative:false},
        {elements: projectLinks, steps:40, negative:true}
    ]

    var sectionTitleObserver = new IntersectionObserver(sectionTitle, { root: null, rootMargin: '0px', threshold: buildThresholdList() });
    var heroObserver = new IntersectionObserver(heroBox, { root: null, rootMargin: '0px', threshold:[0, 1] });
    var projectSliderObserver = new IntersectionObserver(projectSlider, { root: null, rootMargin: '0px', threshold: [0, 1] });

    inputs.forEach(elem => {
        elem.addEventListener("blur", () => {
            setActive(elem, false);
        });
        elem.addEventListener("focus", () => {
            setActive(elem, true);
        });
    });

    teams.forEach(elem => {
        elem.addEventListener("click", () => {
            elem.classList.toggle('team-member--active');
        });
    });

    sectionHero.forEach(elem => {
        heroObserver.observe(elem);
    });

    sectionTitled.forEach(elem => {
        sectionTitleObserver.observe(elem);
    });

    sectionProjects.forEach(elem => {
        projectSliderObserver.observe(elem);
    });

    var projects = new glidejs('#glideProjects').mount();
    var testimonials = new glidejs('#glideTestimonials').mount();

    var scrolling = new fullPage('#main', {
        scrollOverflow: true
    });

    var moveDown = document.getElementById('moveDown');
    moveDown.addEventListener('click', function(){
        fullpage_api.moveSectionDown();
    });

    MicroModal.init();

    function projectSlider(entries) {
        entries.forEach(function (entry) {
            if (entry.intersectionRatio > 0 ) {
                transformElements.forEach( e => {
                    e.elements.forEach( d => d.setAttribute('style', 'will-change:transform;'))
                });
                window.addEventListener('mousemove', handleCursor);
            }else{
                transformElements.forEach( e => {
                    e.elements.forEach( d => d.setAttribute('style', ''))
                });
                window.removeEventListener('mousemove', handleCursor);
            }
        });
    }

    function setActive(el, active) {
        var formField = el.parentNode;

        if (active) {
            formField.classList.add('form-field--active');
        } else {
            formField.classList.remove('form-field--active');

            if (el.value === '') {
                formField.classList.remove('form-field--filled');
            } else {
                formField.classList.add('form-field--filled');
            }
        }
    }

    function handleCursor(e) {
        var { clientX: x, clientY: y } = e;
        transformElements.forEach( e => movement(x,y, e.steps, e.elements, e.negative));
    }

    function movement(x, y, steps,elements, negative){
        var ratioX= window.innerWidth/steps;
        var ratioY= window.innerHeight/steps;
        var moveX = negative? -x/ratioX: x/ratioX;
        var moveY = negative? -y/ratioY: y/ratioY;

        elements.forEach(elem => {
            elem.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }


    function heroBox(entries) {
        entries.forEach(function (entry) {
            var heroBoxEl = document.querySelector('#heroBox');
            if (heroBoxEl !== null && entry.intersectionRatio > 0 && !heroBoxEl.classList.contains('hero-box--loaded')) {
                heroBoxEl.classList.add('hero-box--loading');
                setTimeout(() => {
                    heroBoxEl.classList.add('hero-box--loaded');
                }, 1500);
                heroObserver.unobserve(entry.target);
            }
        });
    }


    function sectionTitle(entries) {
        entries.forEach(function(entry) {
            var titles = entry.target.querySelectorAll('.section-title');
            if (entry.intersectionRatio > 0.1) {
                titles.forEach(elem => {
                    elem.classList.add('section-title--visible');
                });
            }else{
                titles.forEach(elem => {
                    elem.classList.remove('section-title--visible');
                });
            }
        });
    }

    function buildThresholdList() {
        var thresholds = [];
        var numSteps = 20;

        for (var i=1.0; i<=numSteps; i++) {
            var ratio = i/numSteps;
            thresholds.push(ratio);
        }

        thresholds.push(0);
        return thresholds;
    }


})()



