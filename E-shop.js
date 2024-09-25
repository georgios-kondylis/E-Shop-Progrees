const hamburger = document.getElementById("bar");
const navbar = document.querySelector(".navbar");
const closeButton = document.querySelector(".close");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navbar.classList.add("active");
        mobileCartIcon.style.display = "none"; // Hide mobile cart icon when cart is open
        mobileCartQuantity.style.display = "none"; // Hide mobile quantity number when cart is open
        hamburger.style.display = "none";
    });
}
if (closeButton) {
    closeButton.addEventListener("click", () => {
        navbar.classList.remove("active");
        mobileCartIcon.style.display = "block"; // Show mobile cart icon when cart is closed
        mobileCartQuantity.style.display = "inline"; // Show mobile quantity number when cart is closed
        hamburger.style.display = "";
    });
}

/* Replacing Main image in view */

  const Main_Img = document.querySelector(".main-img");
  const Small_Img = document.querySelectorAll(".small-img");
  
  Small_Img.forEach((img) => {
    img.onclick = () => {
      Main_Img.src = img.src; // Assign the small image's src to the main image
    };
  });


/* Creating functional Cart */

/* ------------------- OPEN CLOSE CART ----------------- */
const cartIcon = document.querySelector(".bag_icon a"); // Desktop cart icon
const mobileCartIcon = document.querySelector(".mobile a"); // Mobile cart icon
const cart = document.querySelector(".cart-side");
const closeArrow = document.querySelector(".close-cart");
const cartItemsContainer = document.querySelector(".productList");
const cartItemCount = document.querySelector(".quantity"); // Desktop quantity
const mobileCartItemCount = document.querySelector(".mobile .quantity"); // Mobile cart quantity
const cartTotal = document.querySelector(".total");

const mobileCartQuantity = document.querySelector(".mobile .quantity"); // Mobile quantity element

// Function to open the cart
const openCart = (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  cart.classList.add("active");
  mobileCartIcon.style.display = "none"; // Hide mobile cart icon when cart is open
  mobileCartQuantity.style.display = "none"; // Hide mobile quantity number when cart is open
  hamburger.style.display = "none";
};
const closeCart = (e) => {
  e.preventDefault(); // Prevent default anchor behavior
  cart.classList.remove("active");
  mobileCartIcon.style.display = "block"; // Show mobile cart icon when cart is closed
  mobileCartQuantity.style.display = "inline"; // Show mobile quantity number when cart is closed
  hamburger.style.display = "";
};

// Add event listeners to both the desktop and mobile cart icons
cartIcon.addEventListener('click', openCart);
mobileCartIcon.addEventListener('click', openCart);
closeArrow.addEventListener('click', closeCart);

/* ------------------- OPEN CLOSE CART ----------------- */

// Array to store the products added to the cart
let cartItems = [];

// Load cart items from localStorage when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  const storedCart = localStorage.getItem("cartItems");
  if (storedCart) {
    cartItems = JSON.parse(storedCart);
    updateCart(); // Update cart UI with stored items
  }
});

// Add event listeners to all "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll(".pro a");

addToCartButtons.forEach(button => {
  button.addEventListener("click", () => {
    const productElement = button.closest('.pro');
    const productId = productElement.dataset.id;
    const productName = productElement.querySelector("h5").textContent;

    // Extract price, ensure it's correctly formatted before parsing
    let productPrice = productElement.querySelector("h4").textContent;

    // Remove any non-numeric characters except for periods (in case of decimal values)
    productPrice = productPrice.replace(/[^\d.]/g, '').trim();

    // Convert price string to a float
    productPrice = parseFloat(productPrice);

    // If the price can't be parsed properly, log an error to track down the issue
    if (isNaN(productPrice)) {
      console.error('Price is not a valid number:', productPrice);
      return;
    }

    const productImage = productElement.querySelector("img").src;

    // Create a product object
    const product = {
      id: productId,
      name: productName,
      price: productPrice, // Parsed price as a float
      image: productImage,
      quantity: 1,
    };

    // Check if the product is already in the cart
    const existingProductIndex = cartItems.findIndex(item => item && item.id === productId);
    if (existingProductIndex === -1) {
      cartItems.push(product); // Add product to cart
    } else {
      cartItems[existingProductIndex].quantity += 1; // Increment quantity if product is already in the cart
    }

    saveCart(); // Save cart to localStorage after adding a product
    updateCart();
  });
});

// Function to refresh the cart contents
function updateCart() {
  cartItemsContainer.innerHTML = ""; // Clear existing cart items
  let totalItems = 0;
  let totalCost = 0;

  // Loop through the cart items and display them in the cart
  cartItems.forEach(item => {
    if (item) {
      totalCost += item.price * item.quantity; // Calculate total cost correctly
      totalItems += item.quantity;

      // Create a list item for each product in the cart
      let cartItemElement = document.createElement("li");
      cartItemElement.innerHTML = `
        <img src="${item.image}"/> 
        <div class="itemName">${item.name}</div>
        <div class="itemPrice">${item.price.toFixed(2)} €</div> <!-- Display price with two decimals -->
        <div>
          <button onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <div class="count">${item.quantity}</div>
          <button onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>`;
      cartItemsContainer.appendChild(cartItemElement);
    }
  });

  // Update total items and total cost
  cartTotal.innerHTML = `(${totalItems} items) ${totalCost.toFixed(2)} €`; // Ensure total cost is displayed with 2 decimals
  cartItemCount.innerHTML = totalItems; // Update the number in the cart icon
  mobileCartItemCount.innerHTML = totalItems; // Update mobile cart quantity
}

// Function to change the quantity of items in the cart
function updateItemQuantity(productId, newQuantity) {
  const productIndex = cartItems.findIndex(item => item && item.id === productId);
  if (newQuantity <= 0) {
    cartItems.splice(productIndex, 1); // Remove the product if the quantity is 0
  } else {
    cartItems[productIndex].quantity = newQuantity; // Update the quantity
  }
  saveCart(); // Save cart to localStorage after updating a product quantity
  updateCart(); // Refresh the cart
}

// Function to save the cart to localStorage
function saveCart() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Save cartItems array as a JSON string
}





  /* 3D CARD EFFECT */

  var VanillaTilt = (function () {
    'use strict';
    
    /**
     * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
     * Original idea: https://github.com/gijsroge/tilt.js
     * MIT License.
     * Version 1.8.1
     */
    
    class VanillaTilt {
      constructor(element, settings = {}) {
        if (!(element instanceof Node)) {
          throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
        }
    
        this.width = null;
        this.height = null;
        this.clientWidth = null;
        this.clientHeight = null;
        this.left = null;
        this.top = null;
    
        // for Gyroscope sampling
        this.gammazero = null;
        this.betazero = null;
        this.lastgammazero = null;
        this.lastbetazero = null;
    
        this.transitionTimeout = null;
        this.updateCall = null;
        this.event = null;
    
        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);
    
        this.element = element;
        this.settings = this.extendSettings(settings);
    
        this.reverse = this.settings.reverse ? -1 : 1;
        this.resetToStart = VanillaTilt.isSettingTrue(this.settings["reset-to-start"]);
        this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
        this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
        this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
        this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
        this.gyroscopeSamples = this.settings.gyroscopeSamples;
    
        this.elementListener = this.getElementListener();
    
        if (this.glare) {
          this.prepareGlare();
        }
    
        if (this.fullPageListening) {
          this.updateClientSize();
        }
    
        this.addEventListeners();
        this.reset();
    
        if (this.resetToStart === false) {
          this.settings.startX = 0;
          this.settings.startY = 0;
        }
      }
    
      static isSettingTrue(setting) {
        return setting === "" || setting === true || setting === 1;
      }
    
      /**
       * Method returns element what will be listen mouse events
       * @return {Node}
       */
      getElementListener() {
        if (this.fullPageListening) {
          return window.document;
        }
    
        if (typeof this.settings["mouse-event-element"] === "string") {
          const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
    
          if (mouseEventElement) {
            return mouseEventElement;
          }
        }
    
        if (this.settings["mouse-event-element"] instanceof Node) {
          return this.settings["mouse-event-element"];
        }
    
        return this.element;
      }
    
      /**
       * Method set listen methods for this.elementListener
       * @return {Node}
       */
      addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
    
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.glare || this.fullPageListening) {
          window.addEventListener("resize", this.onWindowResizeBind);
        }
    
        if (this.gyroscope) {
          window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
      }
    
      /**
       * Method remove event listeners from current this.elementListener
       */
      removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
    
        if (this.gyroscope) {
          window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
        }
    
        if (this.glare || this.fullPageListening) {
          window.removeEventListener("resize", this.onWindowResizeBind);
        }
      }
    
      destroy() {
        clearTimeout(this.transitionTimeout);
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.element.style.willChange = "";
        this.element.style.transition = "";
        this.element.style.transform = "";
        this.resetGlare();
    
        this.removeEventListeners();
        this.element.vanillaTilt = null;
        delete this.element.vanillaTilt;
    
        this.element = null;
      }
    
      onDeviceOrientation(event) {
        if (event.gamma === null || event.beta === null) {
          return;
        }
    
        this.updateElementPosition();
    
        if (this.gyroscopeSamples > 0) {
          this.lastgammazero = this.gammazero;
          this.lastbetazero = this.betazero;
    
          if (this.gammazero === null) {
            this.gammazero = event.gamma;
            this.betazero = event.beta;
          } else {
            this.gammazero = (event.gamma + this.lastgammazero) / 2;
            this.betazero = (event.beta + this.lastbetazero) / 2;
          }
    
          this.gyroscopeSamples -= 1;
        }
    
        const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
        const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;
    
        const degreesPerPixelX = totalAngleX / this.width;
        const degreesPerPixelY = totalAngleY / this.height;
    
        const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
        const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);
    
        const posX = angleX / degreesPerPixelX;
        const posY = angleY / degreesPerPixelY;
    
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = {
          clientX: posX + this.left,
          clientY: posY + this.top,
        };
    
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
    
      onMouseEnter() {
        this.updateElementPosition();
        this.element.style.willChange = "transform";
        this.setTransition();
      }
    
      onMouseMove(event) {
        if (this.updateCall !== null) {
          cancelAnimationFrame(this.updateCall);
        }
    
        this.event = event;
        this.updateCall = requestAnimationFrame(this.updateBind);
      }
    
      onMouseLeave() {
        this.setTransition();
    
        if (this.settings.reset) {
          requestAnimationFrame(this.resetBind);
        }
      }
    
      reset() {
        this.onMouseEnter();
    
        if (this.fullPageListening) {
          this.event = {
            clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
            clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
          };
        } else {
          this.event = {
            clientX: this.left + ((this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width),
            clientY: this.top + ((this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height)
          };
        }
    
        let backupScale = this.settings.scale;
        this.settings.scale = 1;
        this.update();
        this.settings.scale = backupScale;
        this.resetGlare();
      }
    
      resetGlare() {
        if (this.glare) {
          this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
          this.glareElement.style.opacity = "0";
        }
      }
    
      getValues() {
        let x, y;
    
        if (this.fullPageListening) {
          x = this.event.clientX / this.clientWidth;
          y = this.event.clientY / this.clientHeight;
        } else {
          x = (this.event.clientX - this.left) / this.width;
          y = (this.event.clientY - this.top) / this.height;
        }
    
        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);
    
        let tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
        let tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
        let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
    
        return {
          tiltX: tiltX,
          tiltY: tiltY,
          percentageX: x * 100,
          percentageY: y * 100,
          angle: angle
        };
      }
    
      updateElementPosition() {
        let rect = this.element.getBoundingClientRect();
    
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
      }
    
      update() {
        let values = this.getValues();
    
        this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
          "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
          "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
          "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";
    
        if (this.glare) {
          this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
          this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
        }
    
        this.element.dispatchEvent(new CustomEvent("tiltChange", {
          "detail": values
        }));
    
        this.updateCall = null;
      }
    
      /**
       * Appends the glare element (if glarePrerender equals false)
       * and sets the default style
       */
      prepareGlare() {
        // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
        if (!this.glarePrerender) {
          // Create glare element
          const jsTiltGlare = document.createElement("div");
          jsTiltGlare.classList.add("js-tilt-glare");
    
          const jsTiltGlareInner = document.createElement("div");
          jsTiltGlareInner.classList.add("js-tilt-glare-inner");
    
          jsTiltGlare.appendChild(jsTiltGlareInner);
          this.element.appendChild(jsTiltGlare);
        }
    
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner");
    
        if (this.glarePrerender) {
          return;
        }
    
        Object.assign(this.glareElementWrapper.style, {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": "100%",
          "height": "100%",
          "overflow": "hidden",
          "pointer-events": "none",
          "border-radius": "inherit"
        });
    
        Object.assign(this.glareElement.style, {
          "position": "absolute",
          "top": "50%",
          "left": "50%",
          "pointer-events": "none",
          "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
          "transform": "rotate(180deg) translate(-50%, -50%)",
          "transform-origin": "0% 0%",
          "opacity": "0"
        });
    
        this.updateGlareSize();
      }
    
      updateGlareSize() {
        if (this.glare) {
          const glareSize = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
    
          Object.assign(this.glareElement.style, {
            "width": `${glareSize}px`,
            "height": `${glareSize}px`,
          });
        }
      }
    
      updateClientSize() {
        this.clientWidth = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth;
    
        this.clientHeight = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;
      }
    
      onWindowResize() {
        this.updateGlareSize();
        this.updateClientSize();
      }
    
      setTransition() {
        clearTimeout(this.transitionTimeout);
        this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
        if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;
    
        this.transitionTimeout = setTimeout(() => {
          this.element.style.transition = "";
          if (this.glare) {
            this.glareElement.style.transition = "";
          }
        }, this.settings.speed);
    
      }
    
      /**
       * Method return patched settings of instance
       * @param {boolean} settings.reverse - reverse the tilt direction
       * @param {number} settings.max - max tilt rotation (degrees)
       * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
       * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
       * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
       * @param {string} settings.easing - Easing on enter/exit
       * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
       * @param {number} settings.speed - Speed of the enter/exit transition
       * @param {boolean} settings.transition - Set a transition on enter/exit
       * @param {string|null} settings.axis - What axis should be enabled. Can be "x" or "y"
       * @param {boolean} settings.glare - if it should have a "glare" effect
       * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
       * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
       * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
       * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
       * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
       * @param {boolean} settings.reset-to-start - true = On reset event (mouse leave) will return to initial start angle (if startX or startY is set)
       * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
       * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
       * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
       */
      extendSettings(settings) {
        let defaultSettings = {
          reverse: false,
          max: 15,
          startX: 0,
          startY: 0,
          perspective: 1000,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          scale: 1,
          speed: 300,
          transition: true,
          axis: null,
          glare: false,
          "max-glare": 1,
          "glare-prerender": false,
          "full-page-listening": false,
          "mouse-event-element": null,
          reset: true,
          "reset-to-start": true,
          gyroscope: true,
          gyroscopeMinAngleX: -45,
          gyroscopeMaxAngleX: 45,
          gyroscopeMinAngleY: -45,
          gyroscopeMaxAngleY: 45,
          gyroscopeSamples: 10
        };
    
        let newSettings = {};
        for (var property in defaultSettings) {
          if (property in settings) {
            newSettings[property] = settings[property];
          } else if (this.element.hasAttribute("data-tilt-" + property)) {
            let attribute = this.element.getAttribute("data-tilt-" + property);
            try {
              newSettings[property] = JSON.parse(attribute);
            } catch (e) {
              newSettings[property] = attribute;
            }
    
          } else {
            newSettings[property] = defaultSettings[property];
          }
        }
    
        return newSettings;
      }
    
      static init(elements, settings) {
        if (elements instanceof Node) {
          elements = [elements];
        }
    
        if (elements instanceof NodeList) {
          elements = [].slice.call(elements);
        }
    
        if (!(elements instanceof Array)) {
          return;
        }
    
        elements.forEach((element) => {
          if (!("vanillaTilt" in element)) {
            element.vanillaTilt = new VanillaTilt(element, settings);
          }
        });
      }
    }
    
    if (typeof document !== "undefined") {
      /* expose the class to window */
      window.VanillaTilt = VanillaTilt;
    
      /**
       * Auto load
       */
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
    }
    
    return VanillaTilt;
    
    }());
  
  
