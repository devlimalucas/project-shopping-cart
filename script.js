/* 
Recebi ajuda do colega Guilherme Azevedo para desenvolver este projeto.
*/

const cartItems = document.querySelector('.cart__items');

const sumCartItems = () => {
  const items = JSON.parse(getSavedCartItems());
  const element = document.querySelector('.total-price');
  if (items) {
    const replaced = items.map((item) => item.split('$')[1]);
    const sum = parseFloat(replaced.reduce((acc, curr) => acc + Number(curr), 0));
    element.innerText = `${sum}`;
    return;
  }
  element.innerText = '0';
};

const checkToSave = (param) => {
  const saved = localStorage.getItem('cartItems');
  if (typeof param === 'object') {
    return JSON.stringify(param);
  }
  if (saved === null) {
    return JSON.stringify([param]);
  }
  const savedArray = JSON.parse(localStorage.getItem('cartItems'));
  savedArray.push(param);

  return JSON.stringify(savedArray);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items');
  items.appendChild(section);
}

const createProduct = (product) => {
  product.forEach((element) => {
    createProductItemElement({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const items = JSON.parse(getSavedCartItems());
  const filtered = items.filter((item) => item !== event.target.innerHTML);
  localStorage.removeItem('cartItems');
  saveCartItems(checkToSave(filtered));
  sumCartItems();
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const item = cartItems;
  item.appendChild(li);
  saveCartItems(checkToSave(li.innerHTML));
  sumCartItems();
}

const addCartItem = () => {
  const getItem = document.querySelectorAll('.item');
  getItem.forEach((element) => {
    const getButton = element.querySelector('button');
    const getId = getSkuFromProductItem(element);
    getButton.addEventListener('click', async () => {
      const getProduct = await fetchItem(getId);
      const getObject = {
        sku: getProduct.id,
        name: getProduct.title,
        salePrice: getProduct.price,
      };
      createCartItemElement(getObject);
    });
  });
};

const getButtonClear = document.querySelector('.empty-cart');

getButtonClear.addEventListener('click', () => {
  const getLi = document.querySelectorAll('li');
  getLi.forEach((element) => element.remove());
  localStorage.removeItem('cartItems');
  sumCartItems();
});

const loadingFunc = async () => {
  const items = document.querySelector('.items');
  const element = cartItems;
  const loadingOne = createCustomElement('div', 'loading', 'carregando...');
  const loadingTwo = createCustomElement('div', 'loading', 'carregando...');
  items.appendChild(loadingOne);
  element.appendChild(loadingTwo);
  const result = await fetchProducts('computador');
  loadingOne.remove();
  loadingTwo.remove();
  return result;
};

const displaySavedCartItems = () => {
  const items = JSON.parse(getSavedCartItems());
  if (items) {
    items.forEach((item) => {
      const itemToDisplay = document.createElement('li');
      itemToDisplay.innerHTML = item;
      cartItems.appendChild(itemToDisplay);
    });
  }
  sumCartItems();
};

window.onload = async () => {
  const url = await loadingFunc();
  createProduct(url.results);
  addCartItem();
  displaySavedCartItems();
  const getLi = document.querySelectorAll('li');
  getLi.forEach((element) => element.addEventListener('click', cartItemClickListener));
};

/* commit */
