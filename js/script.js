window.addEventListener('load', function() {
// document.addEventListener("DOMContentLoaded", () => {
function _removeClasses(elem, elemClass) {
    if (elem) {
        for (let i = 0; i < elem.length; i++) {
            elem[i].classList.remove(elemClass);
        }
    }
}
const htmlBody = document.querySelector('html');
// код определяющий на каком устройстве открыта страница
let isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};


if (isMobile.any()) {
    htmlBody.classList.add('_touch');

} else {
    htmlBody.classList.add('_pc');
}


// Проверка поддержки webp
function testWebP(elem) {
    const webP = new Image();
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    webP.onload = webP.onerror = function () {
        webP.height === 2 ? elem.classList.add('_webp') : elem.classList.add('_no-webp');
    };
}

testWebP(htmlBody);


// IE
function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}
// console.log(isInternetExplorer());
if (isInternetExplorer() === false) {
    // alert('Браузер не IE');
} else {
    alert('Ваш браузер не поддерживается, страница может отображаться некорректно!');
    htmlBody.classList.add('_ie');
}
// lock body
const documentBody = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');
let unlock = true;

let timeout = 500;


function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('._body-wrapper').offsetWidth + 'px';
  
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
      }
    }
    documentBody.style.paddingRight = lockPaddingValue;
    documentBody.classList.add('_lock');
  
    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }
  
  function bodyUnLock() {
    setTimeout(function () {
      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = '0px';
        }
      }
      documentBody.style.paddingRight = '0px';
      documentBody.classList.remove('_lock');
    }, 0);
  
    unlock = false;
    setTimeout(function () {
      unlock = true;
    }, timeout);
  }
/*-------------------------- */
// меню бургер
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
if(iconMenu){
    iconMenu.addEventListener("click", function(e){
        if(iconMenu.classList.contains('_active')){
            iconMenu.classList.remove("_active");
            menuBody.classList.remove("_active");
            bodyUnLock();
        }
        else{
            iconMenu.classList.add("_active");
            menuBody.classList.add("_active");
            bodyLock();
        }
    });

}
/*-------------------------- */


// плавная прокрутка при клике для фиксированного хедера
const menuLinks = document.querySelectorAll('a[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick);
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
           
            // если шапка фиксированная
            /* 
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;*/

            // если шапка не фиксированная
            /**/
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

            if (iconMenu.classList.contains('_active')) {
                document.body.classList.remove('_lock');
                iconMenu.classList.remove('_active');
                menuBody.classList.remove('_active');
            }

            if(document.querySelectorAll('._hover')){
                _removeClasses(document.querySelectorAll('._hover'),"_hover");
            }

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();
        }
    }
}

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
const popupLinks = document.querySelectorAll('.popup-link');

// находим все ссылки на попапы и убираем у них # и по клику на ссылку открываем попап с таким именем
if (popupLinks.length > 0) {
  for (let index = 0; index < popupLinks.length; index++) {
    const popupLink = popupLinks[index];
    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupName);
      popupOpen(currentPopup);
      e.preventDefault();
    });
  }
}

// находим все объекты с классом .close-popup и вешаем на клик по нему функцию закрытия 
const popupCloseIcon = document.querySelectorAll('.popup__close');
if (popupCloseIcon.length > 0) {
  for (let index = 0; index < popupCloseIcon.length; index++) {
    const el = popupCloseIcon[index];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    });
  }
}

// функция открытия попапа
function popupOpen(currentPopup) {
  if (currentPopup && unlock) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    currentPopup.classList.add('open');
    currentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

// функция закрытия попапа
function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove("open");
    if (doUnlock) {
      bodyUnLock();
    }
  }
}



function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('._body-wrapper').offsetWidth + 'px';

  if (lockPadding.length > 0) {
    for (let index = 0; index < lockPadding.length; index++) {
      const el = lockPadding[index];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  documentBody.style.paddingRight = lockPaddingValue;
  documentBody.classList.add('_lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight = '0px';
      }
    }
    documentBody.style.paddingRight = '0px';
    documentBody.classList.remove('_lock');
  }, 0);

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  
  if (e.key === 'Escape') {
    let popupActive = document.querySelector('.popup.open');
    popupClose(popupActive);
  }
 
});

(function(){
  // проверяем поддержку
  if(!Element.prototype.closest){
    // реализуем
    Element.prototype.closest = function(css){
      var node = this;
      while(node){
        if(node.matches(css)) return node;
        else node = node.parentElement;
      }
      return null;
    };
  }
})();
(function(){
  // проверяем поддержку
  if(!Element.prototype.matches){
    // поределяем свойство
    Element.prototype.matches = Element.prototype.matchesSelector||
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector||
      Element.prototype.msMatchesSelector;
  }
})();
// смотри в HTML шаблонах полную настройку

let tabsTitles = document.querySelectorAll('._tabs-link');
let tabsContents = document.querySelectorAll('._tabs-block');
tabsTitles.forEach(function (title) {
    title.addEventListener('click', function (e) {
        e.preventDefault();
        var id = this.getAttribute('data-tab');
        let content = document.querySelector('._tabs-block[data-tab="' + id + '"]');
        let activeTitle = document.querySelector('._tabs-link._active');
        let activeContent = document.querySelector('._tabs-block._active');

        activeTitle.classList.remove('_active'); 
        title.classList.add('_active'); 

        activeContent.classList.remove('_active'); 
        content.classList.add('_active'); 
    });
});
const form = document.getElementById('form');
const popupOk = document.querySelector('.popup-ok');
const popupError = document.querySelector('.popup-error');

if(form){
   form.addEventListener('submit', formSend); 
}

function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);
    let formData = new FormData(form);

    if (error === 0) {
        popupOpen(popupOk);
        form.reset();
    } else {
        // alert('Проверьте красные поля');
        popupOpen(popupError);
    }
}


function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);

        // if (input.classList.contains('_email')) {
        if (input.getAttribute('type') === "email") {
            if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
            formAddError(input);
            error++;
        } else {
            if (input.value === '') {
                formAddError(input);
                error++;
            }
        }
    }
    return error;
}


function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

// Функция теста email
function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

// превью загружаемой фотографии
const formImage = document.getElementById('formImage');
const formPreview = document.getElementById('formPreview');
if (formImage && formPreview) {
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    });
}


function uploadFile(file) {
    //проверяем тип файла
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        alert('Разрешены только изображения!');
        formImage.value = '';
        return;
    }
    //проверяем размер файла
    if (file.size > 2 * 1024 * 1024) {
        alert('Файл должен быть менее 2мб.');
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
    };
    reader.onerror = function (e) {
        alert('Ошибка');
    };
    reader.readAsDataURL(file);
}
 let slidersRange = document.querySelectorAll('input[type=range]');
 //  console.log(ranges);
 if (slidersRange) {
   for (let i = 0; i < slidersRange.length; i++) {
     let sliderRange = slidersRange[i];
     sliderRange.addEventListener('change', function () {
       document.querySelector('.upload__reset').disabled = false;
     });
   }
 }

 //  --------------------------------
 document.addEventListener('click', documentActions);

 // делегирование события клик
 function documentActions(e) {
   const targetElement = e.target;

   //обработка клика на стрелку меню
   if (targetElement.classList.contains('menu__arrow')) {
     targetElement.closest('.menu__item').classList.toggle('_hover');
   }

   if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
     _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");

   }
   // можно добавлять события клика
   // клик на картинке для загрузки фото
   if (targetElement.closest('.upload__image img')) {
     document.querySelector('#formImage').click();
   }

   //  отключаем кнопку ресет
   if (targetElement.classList.contains('upload__reset')) {
     setTimeout(()=>targetElement.disabled=true, 10);
   }
 }

//Инициализируем Swiper

let sliderT = new Swiper('.slider-t', {

    /* */
    // стрелки
    // в html могут быть добавлены где угодно
    navigation: {
        // можно указать свои классы, для которых уже есть css
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },


    /* */
    // Навигация
    // Буллеты, текущее положение, прогрессбар
    pagination: {
        el: '.slider-t__pagination',

        // тип пагинации "bullets", "fraction", "progressbar" or "custom"
        /** */
        // Буллеты
        type: 'bullets',
        // если не включено, не кликабельно
        clickable: true,

    },

    // количество слайдов для показа (можно указывать нецелые числа)
    // или 'auto' (включить стили в css)
    slidesPerView: 1,

    // отключение функционала
    // если слайдов меньше чем нужно
    watchOverflow: true,

    // количество пролистываемых слайдов
    slidesPerGroup: 1,

    // активный слайд по центру
    centeredSlides: true,

    // стартовый слайд
    initialSlide: 0,

    // мультирядность
    slidesPerColumn: 1,

    // Бесконечный слайдер
    // не работает со скролом, его надо отключать
    // не работает с мультирядностью (значение должно стоять не больше 1)
    loop: true,

    // колучество дублирующих сладов(такое же как значение slidesPerView)
    loopedSlides: 0,

    // свободный режим
    // перемещаем слайды без фиксированной позиции,  скролится колесом мыши
    freeMode: false,
    /* 
    // Автопрокрутка
    autoplay:{
        // пауза между прокруткой
        delay: 1000,
        // закончить на последнем слайде
        // stopOnLastSlide: true,
        // отключить после ручного переключения
        disableOnInteraction: false
    },*/

    // автовысота (почти бесполезна)
    autoHeight: true,

    // скорость прокрутки(по умолчанию 300)
    speed: 800,

    // вертикальный слайдер (заменить на 'vertical')
    // direction: 'horizontal',

    /**/
    // Обновить свайпер (например когда он изначально скрыт)
    // при изменении элементов слайдера
    observer: true,

    // при изменении родитеьских элементов слайдера
    observeParents: true,

    // при изменении дочерних элементов слайда
    observeSlideChildren: true,

    /* 
    // доступность
    a11y: {
        // включить/выключить
        enabled: true,
        // сообщения
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
        // notificationClass: 'swiper-notification',
        // containerMessage: '',
        // containerRoleDescriptionMessage: '',
        // itemRoleDescriptionMessage: '',
    }*/
});

//Инициализируем Swiper

let sliderTariffs= new Swiper('.slider-tarifs', {

    /* */
    // Навигация
    // Буллеты, текущее положение, прогрессбар
    pagination: {
        el: '.slider-tarifs__pagination',

        // тип пагинации "bullets", "fraction", "progressbar" or "custom"
        /** */
        // Буллеты
        type: 'bullets',
        // если не включено, не кликабельно
        clickable: true,

    },

    // количество слайдов для показа (можно указывать нецелые числа)
    // или 'auto' (включить стили в css)
    slidesPerView: 1,

    // отключение функционала
    // если слайдов меньше чем нужно
    watchOverflow: true,

    // количество пролистываемых слайдов
    slidesPerGroup: 1,

    // активный слайд по центру
    centeredSlides: true,

    // стартовый слайд
    initialSlide: 0,

    // мультирядность
    slidesPerColumn: 1,

    // Бесконечный слайдер
    // не работает со скролом, его надо отключать
    // не работает с мультирядностью (значение должно стоять не больше 1)
    loop: true,

    // колучество дублирующих сладов(такое же как значение slidesPerView)
    loopedSlides: 0,

    // свободный режим
    // перемещаем слайды без фиксированной позиции,  скролится колесом мыши
    freeMode: false,

    /* 
    // Автопрокрутка
    autoplay:{
        // пауза между прокруткой
        delay: 1000,
        // закончить на последнем слайде
        stopOnLastSlide: true,
        // отключить после ручного переключения
        disableOnInteraction: false
    },*/

    // скорость прокрутки(по умолчанию 300)
    speed: 800,

    // вертикальный слайдер (заменить на 'vertical')
    // direction: 'horizontal',

    /**/
    // Обновить свайпер (например когда он изначально скрыт)
    // при изменении элементов слайдера
    observer: true,

    // при изменении родитеьских элементов слайдера
    observeParents: true,

    // при изменении дочерних элементов слайда
    observeSlideChildren: true,

    /*
    // доступность
    a11y: {
        // включить/выключить
        enabled: true,
        // сообщения
        prevSlideMessage: 'Previous slide',
        nextSlideMessage: 'Next slide',
        firstSlideMessage: 'This is the first slide',
        lastSlideMessage: 'This is the last slide',
        paginationBulletMessage: 'Go to slide {{index}}',
        // notificationClass: 'swiper-notification',
        // containerMessage: '',
        // containerRoleDescriptionMessage: '',
        // itemRoleDescriptionMessage: '',
    }, */
      /* 
    // брейкпоинты (адаптив)
    // ширина экрана*/
 
});


// можно использовать функции
// например для включение/отключения автопрокрутки при наведении

/* */
function sliderAutoplayStop(sliderName,sliderBlock){
    let sb = document.querySelector(sliderBlock);
    sb.addEventListener("mouseenter", function(e){
        sliderName.autoplay.stop();
    });
    sb.addEventListener("mouseleave",function(e){
        sliderName.autoplay.start();
    });
}


function sliderAutoplayStart(sliderName,sliderBlock){
    let sb = document.querySelector(sliderBlock);
    sb.addEventListener("mouseenter", function(e){
        sliderName.params.autoplay.disableOnInteraction = false;
        sliderName.params.autoplay.delay = 500;
        sliderName.autoplay.start();
    });
    sb.addEventListener("mouseleave",function(e){
        sliderName.autoplay.stop();
    });
}

// sliderAutoplayStop(sliderTariffs, '.slider-t');
// sliderAutoplayStart(mySlider, '.sliderClass');
});
