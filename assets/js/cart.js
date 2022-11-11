// Carrito v1
// #1 BASE DE DATOS
const db = [
  {
    id: 1,
    name: 'Xiaomi Redmi Note 11 128GB',
    price: 877000,
    image: 'assets/img/celular1.png',
    category: 'xiaomi',
    quantity: 8
  },
  {
    id: 2,
    name: 'iPhone 13 Pro Max 256gb',
    price: 5949900,
    image: 'assets/img/celular2.webp',
    category: 'iphone',
    quantity: 5
  },
  {
    id: 3,
    name: 'Samsung Galaxy A23 128GB',
    price: 874900,
    image: 'assets/img/celular3.webp',
    category: 'samsung',
    quantity: 10
  },
  {
    id: 4,
    name: 'Motorola Moto G20 128GB',
    price: 619900,
    image: 'assets/img/celular4.png',
    category: 'motorola',
    quantity: 6
  }
]

const products = window.localStorage.getItem('productsDB') ? JSON.parse(window.localStorage.getItem('productsDB')) : db
// const products =  db

// #2 Pintar los productos en el DOM
const productContainer = document.getElementById('products__content')
const productsFilters = document.querySelector('.filter__div')

// const ulFilter = document.querySelector('.ul__filter-total')
// ulFilter.addEventListener('click',()=> {
//        printProducts()
// })    




function printfilters() {
  let html = ''  

  for (let product of products) {
    html += `
    <li class="products__item products__line" data-filter=".${product.category}">
    <h3 class="products__title">
    ${product.category}
    </h3>
    <span class="products__stock">
    ${product.quantity} productos
    </span>
  </li>`
  }  

  productsFilters.innerHTML = html
  window.localStorage.setItem('productsDB', JSON.stringify(products))
}

printfilters()


function printProducts() {
  let html = ''  

  for (let product of products) {
    html += `
    <article class="products__card ${product.category}">
    <div class="products__shape">
      <img src="${product.image}" alt="${product.name}" class="products__img">
    </div>

    <div class="products__data">
      <h2 class="products__name">${product.name}</h2>
      <div class="">
        <h3 class="products__price">$ ${product.price}</h3>
        <span class="products__quantity">Quedan solo ${product.quantity} unidades</span>
      </div>
      <button type="button" class="button products__button addToCart" data-id="${product.id}">
        <i class="bx bx-plus"></i>
      </button>
    </div>
  </article>`
  }  

  productContainer.innerHTML = html
  window.localStorage.setItem('productsDB', JSON.stringify(products))
}

printProducts()

// #3 Carrito
let cart = window.localStorage.getItem('cartDB') ? JSON.parse(window.localStorage.getItem('cartDB')) : []

const cartContainer = document.getElementById('cart__container')
const cartCount = document.getElementById('cart-count')
const itemsCount = document.getElementById('items-count')
const cartTotal = document.getElementById('cart-total')

function printCart() {
  let html = ''
  for (let article of cart) {
    const product = products.find(p => p.id === article.id)

    html += `
    <article class="cart__card">
    <div class="cart__box">
      <img src="${product.image}" alt="${product.name}" class="cart__img">
    </div>

    <div class="cart__details">
      <h3 class="cart__title">${product.name} <span class="cart__price">$ ${product.price}</span></h3>

      <div class="cart__amount">
        <div class="cart__amount-content">
          <span class="cart__amount-box removeToCart" data-id="${product.id}">
            <i class="bx bx-minus"></i>
          </span>

          <span class="cart__amount-number">${article.qty}</span>

          <span class="cart__amount-box addToCart" data-id="${product.id}">
            <i class="bx bx-plus"></i>
          </span>
        </div>

        <i class="bx bx-trash-alt cart__amount-trash deleteToCart" data-id="${product.id}"></i>
      </div>

      <span class="cart__subtotal">
        <span class="cart__stock">Quedan ${product.quantity - article.qty} unidades</span>
        <span class="cart__subtotal-price">${product.price * article.qty}</span>
      </span>
    </div>
  </article>`
  }

  cartContainer.innerHTML = html
  cartCount.innerHTML = totalArticles()
  itemsCount.innerHTML = totalArticles()
  cartTotal.innerHTML = numberToCurrency(totalAmount())
  checkButtons()

  window.localStorage.setItem('cartDB', JSON.stringify(cart))
}

// #4 agregar al carrito
function addToCart(id, qty = 1) {
  const product = products.find(p => p.id === id)

  if (product && product.quantity > 0) {
    const article = cart.find(a => a.id === id)

    if (article) {
      if (checkStock(id, qty + article.qty)) {
        article.qty++
      } else {
        window.alert('No hay stock suficiente')
      }
    } else {
      cart.push({ id, qty })
    }
  } else {
    window.alert('Producto agotado')
  }
  printCart()
}

function checkStock(id, qty) {
  const product = products.find(p => p.id === id)
  return product.quantity - qty >= 0
}

// #5 remover articulos
function removeFromCart(id, qty = 1) {
  const article = cart.find(a => a.id === id)

  if (article && article.qty - qty > 0) {
    article.qty--
  } else {
    const confirm = window.confirm('Estás Seguro???')

    if (confirm) {
      cart = cart.filter(a => a.id !== id)
    }
  }
  printCart()
}

// #6 Eliminar del carrito
function deleteFormCart(id) {
  const article = cart.find(a => a.id === id)
  cart.splice(cart.indexOf(article), 1)
  printCart()
}

// #7 Contar Articulos
function totalArticles() {
  // let acc = 0
  // for (let article of cart) {
  //   acc += article.qty
  // }
  // return acc

  return cart.reduce((acc, article) => acc + article.qty, 0)
}

// #8 El total
function totalAmount() {
  return cart.reduce((acc, article) => {
    const product = products.find(p => p.id === article.id)

    return acc + product.price * article.qty
  }, 0)
}

// #9 Limpiar carrito
function clearCart() {
  cart = []
  // cart.length = 0
  printCart()
}

// #10 Comparar
function checkout() {
  cart.forEach(artcile => {
    const product = products.find(p => p.id === artcile.id)

    product.quantity -= artcile.qty
  })
  clearCart()
  printCart()
  printProducts()
  window.alert('Gracias por su compra')
}

function checkButtons() {
  if (cart.length > 0) {
    document.getElementById('cart-checkout').removeAttribute('disabled')
    document.getElementById('cart-empty').removeAttribute('disabled')
  } else {
    document.getElementById('cart-checkout').setAttribute('disabled', 'disabled')
    document.getElementById('cart-empty').setAttribute('disabled', 'disabled')
  }
}

function numberToCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

printCart()

productContainer.addEventListener('click', function (e) {
  const add = e.target.closest('.addToCart')

  if (add) {
    const id = +add.dataset.id
    addToCart(id)
  }
})

cartContainer.addEventListener('click', function (e) {
  const remove = e.target.closest('.removeToCart')
  const add = e.target.closest('.addToCart')
  const deleteCart = e.target.closest('.deleteToCart')

  if (remove) {
    const id = +remove.dataset.id
    removeFromCart(id)
  }

  if (add) {
    const id = +add.dataset.id
    addToCart(id)
  }

  if (deleteCart) {
    const id = +deleteCart.dataset.id
    deleteFormCart(id)
  }
})

const actionButtons = document.getElementById('action-buttons')

actionButtons.addEventListener('click', function (e) {
  const clear = e.target.closest('#cart-empty')
  const buy = e.target.closest('#cart-checkout')

  if (clear) {
    clearCart()
  }

  if (buy) {
    checkout()
  }
})