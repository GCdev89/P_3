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
  *@param {boolean} [option.infinite=false]
  */

  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({}, {
      slidesToScroll : 1,
      slidesVisible : 1,
      loop: false,
      pagination: false,
      navigation: true,
      infinite: false,
    }, options);
    let children = [].slice.call(element.children);
    this.isMobile = true;
    this.currentItem = 0;
    this.moveCallbacks = [];
    this.offset = 0;
    this.intervalId = null;
    this.intervalOn = true;

    // Modification du DOM
    this.root = this.createDivWithClass("carousel");
    this.root.setAttribute("tabindex", "0");
    this.container = this.createDivWithClass("carousel_container");
    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.items = children.map((child) => {
      let item = this.createDivWithClass("carousel_item");
      item.appendChild(child);
      return item;
    })
    if (this.options.infinite) {
      this.offset = this.options.slidesVisible + this.options.slidesToScroll;
      if (this.offset > children.length) {
        console.error("Vous n\'avez pas assez d'élément dans le carousel", element);
      }
      this.items = [
        ...this.items.slice(this.items.length - this.offset ).map(item => item.cloneNode(true)),
        ...this.items,
        ...this.items.slice(0, this.offset).map(item => item.cloneNode(true)),
      ]
      this.gotoItem(this.offset, false);
    }
    this.items.forEach(item => this.container.appendChild(item));
    this.setStyle();
    if (this.options.navigation === true) {
      this.createNavigation();
    }
    if (this.options.pagination === true) {
      this.createPagination();
    }


    // Evènement
    this.moveCallbacks.forEach(cb => cb(this.currentItem));
    this.onWindowresize();
    this.defilAuto();
    window.addEventListener('resize', this.onWindowresize.bind(this));
    this.root.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" || e.key === "Right") {
        this.next();
      } else if (e.key === "ArrowLeft" || e.key === "Left") {
        this.prev();
      }
    });
    if (this.options.infinite) {
      this.container.addEventListener("transitionend", this.resetInfinite.bind(this));
    }
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
    for (let i = 0; i < (this.items.length - 2 * this.offset); i = i + this.options.slidesToScroll) {
      let button = this.createDivWithClass("caroussel_pagination_button");
      button.addEventListener("click", () => this.gotoItem(i + this.offset));
      pagination.appendChild(button);
      buttons.push(button);
    }
    this.onMove(index => {
      let count = this.items.length - 2 * this.offset;
      let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.slidesToScroll)];
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
  *@param {boolean} [animation=true]
  *
  */
  gotoItem (index, animation = true) {
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
    if (animation === false) {
      this.container.style.transition = "none";
    }
    this.container.style.transform = "translate3d("+ translateX +"%, 0, 0)";
    this.container.offsetHeight // Force repaint
    if (animation === false) {
      this.container.style.transition = "";
    }
    this.currentItem = index;
    this.moveCallbacks.forEach(cb => cb(index));
  }

  /**
  *Déplace le container pour donner l'impression d'un slide infini
  */
  resetInfinite () {
    if (this.currentItem  <= this.slidesToScroll) {
      this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false);
    } else if (this.currentItem >= this.items.length - this.offset) {
      this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false);
    }
  }

  /*
  *Gestion défilement automatique
  */
  defilAuto () {
      this.intervalId = setInterval (this.next.bind(this), 5000);
      this.container.addEventListener("click", () => {
        if (this.intervalOn) {
          clearInterval(this.intervalId);
        } else {
          this.intervalId = setInterval (this.next.bind(this), 5000);
        }
        this.intervalOn = !this.intervalOn
      });
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
    slidesVisible: 2,
    pagination: true,
    infinite: true
  });

}

if (document.readyState !== "loading") {
  onReady();
}
document.addEventListener("DOMContentLoaded", onReady);
