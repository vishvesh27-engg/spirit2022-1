const interval2 = 10000;
const imgsrc = document.querySelector('.landing-image-img');

let imgC;
const imgChange = () => {
  imgC = setInterval(() => {
    nextImg();
  }, interval2);
};

const images = ["img1","img2","img3","img4","img5","img6","img7","img8" ,"img9","img10"  ];

// let i;
const imgS1 = () => {
  i=0;
  imgsrc.setAttribute('class',`landing-image-${images[0]}`)
  imgsrc.setAttribute('src',`images/${images[0]}.png`); 
};

const nextImg = () => {
  if(i>0){imgsrc.removeAttribute('class',`landing-image-${images[i-1]}`)};
    if (i < images.length) {
      imgsrc.setAttribute('class',`landing-image-${images[i]}`)
      imgsrc.setAttribute('src',`images/${images[i]}.png`); 
      i++;
    }else{
      imgS1();
    } 
}
imgS1();
imgChange();




/////Events-slider/////
const cardContainer = document.querySelector('.events-container');
const cardSlider = document.querySelector('.events-slider');
const interval = 2500;

const navB1 =document.querySelector('.events-navigationB--1');
const navB2 =document.querySelector('.events-navigationB--2');
const navB3 =document.querySelector('.events-navigationB--3');
const navB4 =document.querySelector('.events-navigationB--4');

let cards = document.querySelectorAll('.card');
let index = 0;
let cardId;

// const startClone1 = cards[0].cloneNode(true);
// const startClone2 = cards[1].cloneNode(true);
// const startClone3 = cards[2].cloneNode(true);

// startClone1.id = 'start-clone-1';
// startClone2.id = 'start-clone-2';
// startClone3.id = 'start-clone-3';


// cardSlider.append(startClone1);
// cardSlider.append(startClone2);
// cardSlider.append(startClone3);


//Slider
let cardWidth = cards[index].clientWidth + 10;

window.addEventListener('resize',  () => { 
  "use strict";
  cardWidth = cards[index].clientWidth + 10; 
});

cardSlider.style.transform = `translateX(${-(cardWidth) * (index)}px)`;

console.log(cards);

const startSlide = () => {
  cardId = setInterval(() => {
    moveToNextSlide();
  }, interval);
};

const getCards = () => document.querySelectorAll('.card');

cardSlider.addEventListener('transitionend', () => {
  cards = getCards();
  if (cards[index].id === 'start-clone-1') {
    cardSlider.style.transition = 'none';
    index = 0;
    navB1.style.width = '20px';
    cardSlider.style.transform = `translateX(${-cardWidth * (index)}px)`;
  }
});

navB1.style.width = '20px';

const moveToNextSlide = () => {
    cards = getCards();
    if (index >= cards.length - 1) return;

        //button widener
        if(index<2){
          navB1.style.width = '20px';
        }else{
          navB1.style.width = '7px';
        }
        if(index>=2 && index<5){
          navB2.style.width = '20px';
        }else{
          navB2.style.width = '7px';
        }
        if(index>=5 && index<8){
          navB3.style.width = '20px';
        }else{
          navB3.style.width = '7px';
        }
        if(index>=8 && index<9){
          navB4.style.width = '20px';
        }else{
          navB4.style.width = '7px';
        }

    index++;
    cardSlider.style.transition = '.7s ease-out';
    cardSlider.style.transform = `translateX(${-cardWidth * index}px)`;
  };

cardContainer.addEventListener('mouseenter', () => {
    clearInterval(cardId);
  });

cardContainer.addEventListener('mouseleave', startSlide);

startSlide();

//Slider-button

navB1.addEventListener('focusin', () => {
clearInterval(cardId);
navB1.style.width = '20px';
navB2.style.width = '7px';
navB3.style.width = '7px';
navB4.style.width = '7px';
cardSlider.style.transition = '.7s ease-out';
cardSlider.style.transform = `translateX(${-cardWidth * (0)}px)`;
index = 0;
startSlide();
 })
navB2.addEventListener('focusin', () => {
  clearInterval(cardId);
  navB1.style.width = '7px';
  navB2.style.width = '20px';
  navB3.style.width = '7px';
  navB4.style.width = '7px';
  cardSlider.style.transition = '.7s ease-out';
  cardSlider.style.transform = `translateX(${-cardWidth * (3)}px)`;
  index = 3;
  startSlide();
})
navB3.addEventListener('focusin', () => {
  clearInterval(cardId);
  navB1.style.width = '7px';
  navB2.style.width = '7px';
  navB3.style.width = '20px';
  navB4.style.width = '7px';
  cardSlider.style.transition = '.7s ease-out';
  cardSlider.style.transform = `translateX(${-cardWidth * (6)}px)`;
  index = 6;
  startSlide();
})
navB4.addEventListener('focusin', () => {
  clearInterval(cardId);
  navB1.style.width = '7px';
  navB2.style.width = '7px';
  navB3.style.width = '7px';
  navB4.style.width = '20px';
  cardSlider.style.transition = '.7s ease-out';
  cardSlider.style.transform = `translateX(${-cardWidth * (9)}px)`;
  index = 9;
  startSlide();
})

// // Mobile card flip

  let touch_div1 = document.querySelector(`#event-1-m`);
  let touch_divb1 = document.querySelector(`#event-1-mb`);
  let touch_div2 = document.querySelector(`#event-2-m`);
  let touch_divb2 = document.querySelector(`#event-2-mb`);
  let touch_div3 = document.querySelector(`#event-3-m`);
  let touch_divb3 = document.querySelector(`#event-3-mb`);
  let touch_div4 = document.querySelector(`#event-4-m`);
  let touch_divb4 = document.querySelector(`#event-4-mb`);
  let touch_div5 = document.querySelector(`#event-5-m`);
  let touch_divb5 = document.querySelector(`#event-5-mb`);
  let touch_div6 = document.querySelector(`#event-6-m`);
  let touch_divb6 = document.querySelector(`#event-6-mb`);
  let touch_div7 = document.querySelector(`#event-7-m`);
  let touch_divb7 = document.querySelector(`#event-7-mb`);
  let touch_div8 = document.querySelector(`#event-8-m`);
  let touch_divb8 = document.querySelector(`#event-8-mb`);
  let touch_div9 = document.querySelector(`#event-9-m`);
  let touch_divb9 = document.querySelector(`#event-9-mb`);
  let touch_div10 = document.querySelector(`#event-10-m`);
  let touch_divb10 = document.querySelector(`#event-10-mb`);

  let is_touch_device = false;
  let touchstart_event_listener;
  let touchend_event_listener;
  
  if ("ontouchstart" in document.documentElement) {
    is_touch_device = true;
  }
  if (is_touch_device) {

  touch_div1.classList.add('flip-card-back');
  touch_div1.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div1.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb1.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div1.addEventListener('touchend', touchstart_event_listener = () => {
   setTimeout(function() {
  touch_div1.classList.replace('flip-card-front', 'flip-card-back');
  touch_divb1.classList.replace('flip-card-back', 'flip-card-front');
  },1000);  
  });

  touch_div2.classList.add('flip-card-back');
  touch_div2.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div2.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb2.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div2.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div2.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb2.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div3.classList.add('flip-card-back');
  touch_div3.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div3.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb3.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div3.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div3.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb3.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div4.classList.add('flip-card-back');
  touch_div4.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div4.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb4.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div4.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div4.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb4.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div5.classList.add('flip-card-back');
  touch_div5.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div5.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb5.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div5.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div5.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb5.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div6.classList.add('flip-card-back');
  touch_div6.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div6.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb6.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div6.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div6.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb6.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div7.classList.add('flip-card-back');
  touch_div7.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div7.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb7.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div7.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div7.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb7.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div8.classList.add('flip-card-back');
  touch_div8.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div8.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb8.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div8.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div8.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb8.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div9.classList.add('flip-card-back');
  touch_div9.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div9.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb9.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div9.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div9.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb9.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });

  touch_div10.classList.add('flip-card-back');
  touch_div10.addEventListener('touchstart', touchstart_event_listener = () => {
    touch_div10.classList.replace('flip-card-back', 'flip-card-front');
    touch_divb10.classList.replace('flip-card-front', 'flip-card-back');
  });
  touch_div10.addEventListener('touchend', touchstart_event_listener = () => {
    setTimeout(function() {
   touch_div10.classList.replace('flip-card-front', 'flip-card-back');
   touch_divb10.classList.replace('flip-card-back', 'flip-card-front');
   },1000);  
   });
}

