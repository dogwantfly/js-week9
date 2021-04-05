let productData;
let cartListData;
const productList = document.querySelector(".row.list");
const productSelect = document.querySelector("select.form-select");
// 取得產品列表
axios
  .get(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/products",
    headers
  )
  .then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    productData = response.data.products;
    console.log(productData);
    renderProductList(productData)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });

//--------------------------------------------------------------
// 加入購物車

let addCart = (productId) => {
  axios
  .post(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/carts",
    {
      data:{
        productId: productId,
        quantity: 1
      }
    },
    headers
  )
  .then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    getCartList();
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
productList.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("btn-cart"))) return;
  e.preventDefault();
  console.log(e.target.closest("li").querySelector("h5").textContent);
  let product = productData.filter(product => product.title === e.target.closest("li").querySelector("h5").textContent)
  console.log(product[0].id);
  addCart(product[0].id);
})


// ----------------------------------------------------------------
// 渲染產品列表
let renderProductList = (data) => {
  let str = "";
  data.forEach((product) => {
    str += `
    <li class="col-md-3">
    <div class="card">
      <img src="${product.images}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <div class="text-center">
          <p class="card-text text-center">原價：<del>${product.origin_price}</del></p>
          <p class="card-text text-center fst-italic">$${product.price}</p>
          <a href="#" class="btn btn-primary d-inline-block btn-cart">加入購物車</a>
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
    console.log((product.title).indexOf(searchInput.value));
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
      return product.category === productSelect.value && (product.title).indexOf(searchInput.value) !== -1
    }
    console.log((product.title).indexOf(searchInput.value));
    return (product.title).indexOf(searchInput.value) !== -1
  })
  renderProductList(filterArray)
}
searchBtn.addEventListener("click", searchProduct);

// ------------------------------
// 取得購物車內容
let getCartList = () => {
  axios
  .get(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/carts",
    {
      headers: {
        accept: "application/json"
      }
    }
  )
  .then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    cartListData = response.data.carts;
    console.log(cartListData);
    renderCartList(cartListData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
getCartList();
// ---------------
// 呈現購物車列表
const cartTable = document.querySelector("#frontEndTable");
let renderCartList = (data) => {
  let str = "";
  data.forEach((cart) => {
    str += `
    <tr>
      <td>
        <img class="cart-item-img" src="${cart.product.images}">
        ${cart.product.title}
      </td>
      <td>NT$ ${cart.product.price}</td>
      <td>${cart.quantity}</td>
      <td>${cart.product.price * cart.quantity}</td>
      <td><a href="#" class="removeCartItem">x</a></td>
    </tr>`
  })
  cartTable.innerHTML = str;
}
// ------------------------------
//刪除全部購物車內容
const removeCartsBtn = document.querySelector("#removeCarts");
let deleteCartList = () => {
  axios.delete(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/carts",
    {
      headers: {
        accept: "application/json"
      }
    }
  ).then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    getCartList();
    // orderData = response.data.orders;
    // render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
removeCartsBtn.addEventListener("click", deleteCartList);
// ------------------------------
//刪除特定購物車內容
let deleteCartProduct = (cartId) => {
  axios.delete(
    `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/carts/${cartId}`,
    {
      headers: {
        accept: "application/json"
      }
    }
  ).then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    getCartList();
    // orderData = response.data.orders;
    // render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
// 抓刪除特定購物車的 ID，測試刪除特定購物車
cartTable.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("removeCartItem"))) return;
  e.preventDefault();
  console.log();
  let cart = cartListData.filter(cart => cart.product.title === e.target.closest("tr").querySelector("td").textContent.trim())
  console.log(cart[0].id);
  deleteCartProduct(cart[0].id);
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
    }
  },
  email: {
    presence: {
      message: "是必填欄位"
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
const inputs = form.querySelectorAll("input[type=text],input[type=email],select")
const inputArray = [...inputs];
inputArray.forEach((item) => {
    item.addEventListener("change", (e) => {
      console.log("change")
      item.nextElementSibling.textContent = "";
      handleFormSubmit(form);
    });
  });
//表單驗證
let handleFormSubmit = (form) => {
  console.log("validate");
  let error = validate(form, constraints);
  console.log(error);
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
  if (handleFormSubmit(form)) {
    console.log("submit");
    sentOrder()
    form.reset();
  } else {
    console.log("can't submit");
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
  console.log(name,      
    tel,      
    email,      
    address,      
    payment,   )
  axios
  .post(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/hsinyu/orders",
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
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  )
  .then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    getOrderData()
    render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}