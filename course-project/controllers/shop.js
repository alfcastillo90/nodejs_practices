const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.id;
  Product.findByPk(prodId).then(product => {
    if (!product) {
      return res.redirect('/');
    }

    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product: product
    })
  }).catch(err => {
    console.log(err);
  });
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log(error);
    });
}

exports.getCart = (req, res, next) => {
  console.log(req.user.cart);
  req.user
  .getCart()
  .then(cart => {
    return cart
    .getProducts()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart',
        products: products
      })
    })
    .then()
  }).catch((error) => {
    console.log(error)
  });
}

exports.postCart = (req, res, next) => {
  const prodId = parseInt(req.body.productId);
  let fetchedCart;
  let newQuantity = 1;

  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({ where: {id: prodId} });
  })
  .then(products => {
    let product;
    if (products.length > 0) {
      product = products[0]
    }
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId);
  })
  .then(product => {
    return fetchedCart.addProduct(product, {
      through: {
        quantity: newQuantity
      }
    })
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(error => {
    console.log(error)
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your orders'
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { id: prodId }});
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  }).then(() => {
    res.redirect('/cart')
  }).catch(error => {
    console.log(error);
  })
}