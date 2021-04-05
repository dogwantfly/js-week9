const backendTable = document.querySelector('#backendTable');
let orderData;
const removeOrderAllBtn = document.querySelector(".removeOrderAllBtn");
let headers = {
  headers: {
    accept: "application/json",
    authorization: "hRZMCzzUpvYCLCuIlqiu3h2h9Hx2",
    "Content-Type": "application/json"
  }
};
let render = (data) => {
    let str = "";
    data.forEach((item) => {
        let orderStateStr;
        if (item.paid) {
            orderStateStr = "已處理";
        } else {
            orderStateStr = "未處理";
        }

        str += `
        <tr>
          <td class="order-id">${item.id}</td>
          <td>${item.user.name}</td>
          <td>${item.user.address}</td>
          <td>${item.user.email}</td>
          <td>${item.products[0].title}</td>
          <td>${item.createdAt}</td>
          <td><a href="#" class="orderState">${orderStateStr}</a></td>
          <td><button type="button" class="btn btn-primary btn-delete">刪除</button></td>
        </tr>`
    })
    
    backendTable.innerHTML = str;
}
// 呈現訂單列表
let getOrderData = () => {
  axios
  .get(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/hsinyu/orders",
    headers
  )
  .then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    orderData = response.data.orders;
    // console.log(orderData);
    let productObj = {};
    orderData.forEach((item,index) => {
      orderData[index].products.forEach((product) => {
        if (productObj[product.title] == undefined) {
          productObj[product.title] = (product.price) * (product.quantity);
          // console.log(product.price ,product.quantity)
        } else {
          productObj[product.title] += (product.price) * (product.quantity);
          // console.log(product.price ,product.quantity)
        }
      })
    });
    //console.log(productObj);
    let productTitle = [];
    productTitle = Object.keys(productObj);
    // console.log(productTitle);
    let columns = [];
    productTitle.forEach((item) => {
      columns.push([item, productObj[item]]);
    });
    // console.log(columns);
    addChart(columns);
    render(orderData);
    let tableRow = backendTable.querySelectorAll('tr');
    tableRow = [...tableRow];
    // console.log(tableRow);
    tableRow.forEach((tr,index) => {
      tr.dataset.id = index + 1;
    })
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
getOrderData();
//------------------------------------------------------
// 修改單一訂單
let modifyOrderData = (str,orderID) => {
  let orderPaid = true;
  if (str === "未處理") {
    orderPaid = false;
  }
  console.log(orderID);
  axios
    .put(
      "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/hsinyu/orders",
      {
        data:{
          id: orderID,
          paid: (!orderPaid)
        }
      },
      headers
    )
    .then(function (response) {
      // 成功會回傳的內容
      console.log(response);
      orderData = response.data.orders;
      render(orderData);
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });
}
backendTable.addEventListener("click", (e) => {
  e.preventDefault();
  if (!(e.target.classList.contains("orderState"))) {
      return;
  }
  let orderID = e.target.closest("tr").querySelector(".order-id").textContent
  modifyOrderData(e.target.textContent,orderID)
})
//------------------------------------------------------
// c3 圖表
let addChart = (columns) => {
  // console.log(columns);
  let revenueChart = c3.generate({
    bindto: "#revenueChart",
    data: {
      columns: columns,
      type: "donut"
    },
    donut: {
      title: "營收"
    }
  });
};
//------------------------------------------------------
// 刪除全部訂單
let deleteAllOrder = () => {
  axios.delete(
    "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/hsinyu/orders",
    headers
  ).then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    orderData = response.data.orders;
    render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
removeOrderAllBtn.addEventListener("click", () => {
  deleteAllOrder();
})
//------------------------------------------------------
// 刪除特定訂單
let deleteOrder = (orderId) => {
  axios.delete(
    `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/hsinyu/orders/${orderId}`,
    headers
  ).then(function (response) {
    // 成功會回傳的內容
    console.log(response);
    orderData = response.data.orders;
    render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
}
backendTable.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("btn-delete"))) return;
  e.preventDefault();
  console.log(e.target.closest("tr").querySelector("td").textContent);
  let order = orderData.filter(order => order.id === e.target.closest("tr").querySelector("td").textContent)
  console.log(order[0].id);
  deleteOrder(order[0].id);
})