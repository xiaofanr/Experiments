const toggleNav = document.querySelector('.toggle-nav');

toggleNav.addEventListener('click', function() {
  this.nextElementSibling.classList.toggle('visible');
});

const arrow = document.querySelectorAll('.arrow');
const slide = document.querySelectorAll('.slide');

// left slide
arrow[0].addEventListener('click', function() {
  let active = document.querySelector('.active');
  let now = parseInt(active.dataset.slideOrder);
  let pre;

  // loop
  if (now === 0) {
    pre = slide.length - 1;
  } else {
    pre = now - 1;
  }
  // move the next pic to the right side
  slide[pre].style.transition = 'none';
  slide[pre].classList.add('align-right');

  setTimeout(function() {
    slide[pre].style.transition = 'left 0.7s cubic-bezier(.65, .045, .36, 1)';
    slide[now].classList.add('pushed-left');
    slide[now].querySelectorAll('.fade-slide')[0].classList.add('fade');
    slide[pre].classList.toggle('active'); // .active z-index: 15
    slide[pre].classList.toggle('super-active'); // .super-active z-index: 20
    slide[pre].classList.remove('align-right');

    setTimeout(function() {
      slide[now].classList.remove('active');
      slide[now].classList.remove('pushed-left');
      slide[now].querySelectorAll('.fade-slide')[0].classList.remove('fade');
    }, 750);
  }, 50);

  slide[now].classList.remove('super-active');
});

// right slide
// show the next pic, and move the current one a little
arrow[1].addEventListener('click', function() {
  let active = document.querySelector('.active');
  let now = parseInt(active.dataset.slideOrder);
  let next;

  // loop
  if (now === slide.length - 1) {
    next = 0;
  } else {
    next = now + 1;
  }
  // move the next pic to the left
  slide[next].style.transition = 'none';
  slide[next].classList.add('align-left');

  setTimeout(function() {
    slide[next].style.transition = 'left 0.7s cubic-bezier(.65, .045, .36, 1)';
    slide[now].classList.add('pushed-right');
    slide[now].querySelectorAll('.fade-slide')[0].classList.add('fade');
    slide[next].classList.add('active'); // .active z-index: 15
    slide[next].classList.add('super-active'); // .super-active z-index: 20
    slide[next].classList.remove('align-left');

    setTimeout(function() {
      slide[now].classList.remove('active');
      slide[now].classList.remove('pushed-right');
      slide[now].querySelectorAll('.fade-slide')[0].classList.remove('fade');
    }, 750);
  }, 50);

  slide[now].classList.remove('super-active');
})
