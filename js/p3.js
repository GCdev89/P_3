class Carousel {

  /**
  *
  *@param {HTMLElement} element
  *@param {Object} options
  *@param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
  *@param {Object} [options.slidesVisible=1] Nombre d'éléments visible dans une slide
  *@param {boolean} [options.loop=false] Doit-t-on boucler en fin de slides
  *@param {boolean} [options.pagination=false]
  *@param {boolean} [option.navigation=true]
  */

  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({}, {
      slidesToScroll : 1,
      slidesVisible : 1,
      loop: false,
      pagination: false,
      navigation: true
    }, options);
    let children = [].slice.call(element.children);
    this.isMobile = true;
    this.currentItem = 0;
    this.moveCallbacks = [];

    // Modification du DOM
    this.root = this.createDivWithClass("carousel");
    this.root.setAttribute("tabindex", "0");
    this.container = this.createDivWithClass("carousel_container");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel_item");
      item.appendChild(child);
      this.container.appendChild(item);
      return item;
    })
    this.setStyle();
    if (this.options.navigation === true) {
      this.createNavigation();
    }
    if (this.options.navigation === true) {
      this.createPagination();
    }

    // Evènement
    this.moveCallbacks.forEach(cb => cb(0));
    this.onWindowresize();
    window.addEventListener('resize', this.onWindowresize.bind(this));
    this.root.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        this.next();
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        this.prev();
      }
    });
    setInterval (this.next.bind(this), 5000);
  }
  /*
  *
  *Applique les bonnes dimensions aux éléments  *
  *
  */
  setStyle () {
    let ratio = this.items.length / this.slidesVisible;
    this.container.style.width = (ratio * 100) + "%";
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%");
  }

  createNavigation () {
    let nextButton = this.createDivWithClass("carousel_next");
    let prevButton = this.createDivWithClass("carousel_prev");
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);
    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.prev.bind(this));
    if (this.options.loop === true) {
      return;
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add("carousel_prev-hidden");
      } else {
        prevButton.classList.remove("carousel_prev-hidden");
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add("carousel_next-hidden");
      } else {
        nextButton.classList.remove("carousel_next-hidden");
      }
    });
  }

  /**
  * Crée la pagination dans le DOM
  */

  createPagination () {
    let pagination = this.createDivWithClass("carousel_pagination");
    let buttons = [];
    this.root.appendChild(pagination);
    for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
      let button = this.createDivWithClass("caroussel_pagination_button");
      button.addEventListener("click", () => this.gotoItem(i));
      pagination.appendChild(button);
      buttons.push(button);
    }
    this.onMove(index => {
      let activeButton = buttons[Math.floor(index / this.slidesToScroll)];
      if (activeButton) {
        buttons.forEach(button => button.classList.remove("caroussel_pagination_button-active"));
        activeButton.classList.add("caroussel_pagination_button-active");
      }
    })
  }

  next () {
    this.gotoItem(this.currentItem + this.slidesToScroll);
  }

  prev () {
    this.gotoItem(this.currentItem - this.slidesToScroll);
  }
  /**
  * Déplace le carousel vers l'élément ciblé
  * @param {number} index
  *
  *
  */
  gotoItem (index) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible;
      } else {
        return;
      }
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0;
      } else {
        return;
      }
    }
    let translateX = index * -100 / this.items.length;
    this.container.style.transform = "translate3d("+ translateX +"%, 0, 0)";
    this.currentItem = index;
    this.moveCallbacks.forEach(cb => cb(index));
  }

  /**
  *
  *@param {carousel ~ moveCallbacks} cb
  *
  *
  */

  onWindowresize () {
    let mobile = window.innerWidth < 800;
    if (mobile !== this.isMobile) {
      this.isMobile = mobile;
      this.setStyle();
      this.moveCallbacks.forEach(cb => cb(this.currentItem));
    }
  }

  onMove (cb) {
    this.moveCallbacks.push(cb);
  }


  /**
  *
  *@param {string} className
  *@returns {HTMLElement}
  */
  createDivWithClass (className) {
    let div = document.createElement("div");
    div.setAttribute("class", className);
    return div;
  }

  /**
  *
  *@returns {number}
  */

  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll;
  }

  /**
  *
  *@returns {number}
  */

  get slidesVisible () {
    return this.isMobile ? 1 : this.options.slidesVisible;
  }
}

let onReady = function () {

  new Carousel(document.getElementById("carousel_pano"), {
    slidesToScroll: 2,
    slidesVisible: 3,
    loop: true,
    pagination: true
  });

}

if (document.readyState !== "loading") {
  onReady();
}
document.addEventListener("DOMContentLoaded", onReady);
