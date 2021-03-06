let productData;
let cartListData;
const productList = document.querySelector(".row.list");
const productSelect = document.querySelector("select.form-select");
let quantityInputs;
// 取得產品列表
let getProductList = () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/products`;
  axios
  .get( url, config)
  .then(function (response) {
    // 成功會回傳的內容
    productData = response.data.products;
    renderProductList(productData)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
getProductList();

//-------------------------------------------------------------
// 加入購物車

let addCart = (productId, quantity) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
  axios
  .post(
    url,
    {
      data:{
        productId,
        quantity,
      }
    }
  )
  .then(function (response) {
    // 成功會回傳的內容
    if (response.data.status) {
      alert(`成功加入購物車！`);
    }
    cartListData = response.data.carts;
    renderCartList(cartListData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
    alert(error.response.data.message);
  });
}
productList.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("btn-cart"))) return;
  e.preventDefault();
  let productId = e.target.dataset.id;
  let quantity;
  let productArray = cartListData.filter(cartItem => cartItem.product.id === productId)
  if (productArray.length > 0) {
    quantity = productArray[0].quantity + 1
  } else {
    quantity = 1;
  }
  addCart(productId, quantity);
})
// ----------------------------
// 編輯購物車產品數量
let editCartQuantity = (cartId, quantity) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
  axios
  .patch(
    url,
    {
      data:{
        id: cartId,
        quantity: quantity
      }
    },
    config
  )
  .then(function (response) {
    // 成功會回傳的內容
    cartListData = response.data.carts;
    renderCartList(cartListData);   
    alert("更改數量成功!")
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
    alert(error.response.data.message)
  });
}


// ----------------------------------------------------------------
// 渲染產品列表
let renderProductList = (data) => {
  let str = "";
  data.forEach((product) => {
    str += `
    <li class="col-md-3 mb-3">
    <div class="card h-100">
      <img src="${product.images}" class="card-img-top" alt="...">
      <div class="d-flex flex-column justify-content-between h-100">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
        </div>
        <div class="card-footer text-center bg-transparent border-top-0">
          <p class="card-text text-center">原價：<del>${product.origin_price}</del></p>
          <p class="card-text text-center fst-italic">$${product.price}</p>
          <a href="#" class="btn btn-primary d-inline-block btn-cart" data-id="${product.id}">加入購物車</a>
        </div>
      </div>
    </div>
  </li>
    `
  })
  productList.innerHTML = str;
}
//----------------------------------------------------------------
// 篩選產品
let productFilter = () => {
  let filterArray = [];
  filterArray = productData.filter(product => {
    if (productSelect.value) {
      return product.category === productSelect.value && (product.title).indexOf(searchInput.value) !== -1
    }
    return (product.title).indexOf(searchInput.value) !== -1
  })
  renderProductList(filterArray)
}
productSelect.addEventListener("change", productFilter)
//----------------------------------------------------------------
// 搜尋產品
const searchBtn = document.querySelector(".btn-search");
const searchInput = document.querySelector(".input-search");
let searchProduct = () => {
  let filterArray = [];
  filterArray = productData.filter(product => {
    if (productSelect.value) {
      return product.category === productSelect.value && (product.title.toUpperCase()).indexOf(searchInput.value.toUpperCase()) !== -1
    }
    return (product.title.toUpperCase()).indexOf(searchInput.value.toUpperCase()) !== -1
  })
  renderProductList(filterArray)
}
searchBtn.addEventListener("click", searchProduct);

// ------------------------------
// 取得購物車內容
let getCartList = () => {
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
  axios
  .get(url)
  .then(function (response) {
    // 成功會回傳的內容
    cartListData = response.data.carts;
    renderCartList(cartListData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response);
    alert(`請確認 API Path 是否已申請 (っ˘ω˘ς )`);
  });
}
getCartList();
// ---------------
// 呈現購物車列表
const cartTable = document.querySelector("#frontEndTable");
let renderCartList = (data) => {
  let str = "";
  let totalPrice = 0;
  data.forEach((cart) => {
    str += `
    <tr data-id="${cart.id}">
      <td>
        <img class="cart-item-img" src="${cart.product.images}">
        ${cart.product.title}
      </td>
      <td>NT$ ${cart.product.price}</td>
      <td>
      <div class="input-group" role="group">
        <button type="button" class="btn btn-outline-secondary">-</button>
        <div class="input-group-text"">${cart.quantity}</div>
        <button type="button" class="btn btn-outline-secondary">+</button>
      </div>
      </td>
      <td>${cart.product.price * cart.quantity}</td>
      <td><a href="#" class="removeCartItem">x</a></td>
    </tr>`
    totalPrice += (cart.product.price * cart.quantity)
  })
  cartTable.innerHTML = str;
  document.querySelector(".total").textContent = `總金額：${totalPrice} 元`
}
// ------------------------------
//刪除全部購物車內容
const removeCartsBtn = document.querySelector("#removeCarts");
let deleteCartList = () => {
  if (cartListData.length < 1) {
    alert("購物車為空");
    return;
  }
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts`;
  axios.delete(url)
  .then(function (response) {
    // 成功會回傳的內容
    alert(response.data.message)
    getCartList();
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response);
    alert(error.response.data.message)
  });
}
removeCartsBtn.addEventListener("click", deleteCartList);
// ------------------------------
//刪除特定購物車內容
let deleteCartProduct = (cartId) => {
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/carts/${cartId}`;
  axios.delete(url)
  .then(function (response) {
    // 成功會回傳的內容
    getCartList();
    if (response.data.status) {
      alert(`成功刪除！`)
    } else {
      alert(response.data.message);
    }
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response);
    alert(`請確認 API Path 是否已申請 (っ˘ω˘ς )`)
  });
}
// 抓刪除特定購物車的 ID，測試刪除特定購物車、編輯購物車產品數量
cartTable.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("removeCartItem")) {
    let cart = cartListData.filter(cart => cart.product.title === e.target.closest("tr").querySelector("td").textContent.trim())
    deleteCartProduct(cart[0].id);
  } else if (e.target.classList.contains("btn", "btn-outline-secondary")) {
    let quantity;
    if (e.target.textContent === "+") {
      quantity = Number(e.target.previousElementSibling.textContent)
      quantity++
    } else if (e.target.textContent === "-") {
      quantity = Number(e.target.nextElementSibling.textContent);
      if (quantity === 1) {
        let message = confirm("商品即將移除");
        if (message) {
          let cart = cartListData.filter(cart => cart.product.title === e.target.closest("tr").querySelector("td").textContent.trim())
          deleteCartProduct(cart[0].id);
        }
        return;
      } 
      quantity--;
    }
    let carttId = e.target.closest("tr").dataset.id;
    editCartQuantity(carttId, quantity)
  }
})
// validate.js
let constraints = {
  name: {
    presence: {
      message: "是必填欄位"
    }
  },
  tel: {
    presence: {
      message: "是必填欄位"
    },
    length: {
      minimum: 8,
      tooShort: "電話號碼至少需八碼"
    }
  },
  email: {
    presence: {
      message: "是必填欄位"
    },
    email: {
      message: "信箱格式需正確"
    }
  },
  address: {
    presence: {
      message: "是必填欄位"
    }
  },
  payment: {
    presence: {
      message: "是必填欄位"
    }
  }
};
const form = document.querySelector(".form");
const inputs = form.querySelectorAll("input[type=text],input[type=email],input[type=tel],select")
const inputArray = [...inputs];
inputArray.forEach((item) => {
    item.addEventListener("change", (e) => {
      item.nextElementSibling.textContent = "";
      handleFormSubmit(form);
    });
  });
//表單驗證
let handleFormSubmit = (form) => {
  let error = validate(form, constraints);
  if (error) {
    Object.keys(error).forEach(
      (keys) => (document.querySelector(`.${keys}`).textContent = error[keys])
    );
  } else {
    return true;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (cartListData.length < 1) {
    alert("購物車中無商品，請將商品加入購物車！");
    return;
  }
  if (handleFormSubmit(form)) {
    sentOrder()
  }
});

// ----------------------------
// 送出訂單
let sentOrder = () => {
  const name = document.querySelector("#name").value;
  const tel = document.querySelector("#tel").value;
  const email = document.querySelector("#email").value;
  const address = document.querySelector("#address").value;
  const payment = document.querySelector("#payment").value;
  const url = `${baseUrl}/api/livejs/v1/customer/${api_path}/orders`;
  axios
  .post(
    url,
    {
      data:{
        user: {      
          name,      
          tel,      
          email,      
          address,      
          payment,   
        }
      }
    }
  )
  .then(function (response) {
    // 成功會回傳的內容
    getOrderData();
    getCartList();
    renderCartList(cartListData);
    render(orderData);
    alert("成功送出訂單！")
    form.reset();
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response);
    alert(error.response.data.message)
  });
}

