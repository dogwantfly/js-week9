const backendTable = document.querySelector('#backendTable');
let orderData;
const removeOrderAllBtn = document.querySelector(".removeOrderAllBtn");
const api_path = "hsinyu";
const baseUrl = "https://hexschoollivejs.herokuapp.com";
const config = {
  headers: {
    Authorization: 'hRZMCzzUpvYCLCuIlqiu3h2h9Hx2'
  }
}
// 渲染訂單
let render = (data) => {
    let str = "";
    data.forEach((item) => {
        let orderStateStr;
        if (item.paid) {
            orderStateStr = "已處理";
        } else {
            orderStateStr = "未處理";
        }
        let productTitleStr = item.products[0].title;
        item.products.forEach((product, index) => {
          if (index === 0) return;
          productTitleStr += `、${product.title}`
        })
        let date = new Date(item.createdAt*1000).toLocaleString()
        str += `
        <tr>
          <td class="order-id">${item.id}</td>
          <td>${item.user.name}</td>
          <td>${item.user.address}</td>
          <td>${item.user.email}</td>
          <td class="text-truncate w-25">${productTitleStr}</td>
          <td>${date}</td>
          <td><a href="#" class="orderState">${orderStateStr}</a></td>
          <td><button type="button" class="btn btn-primary btn-delete">刪除</button></td>
        </tr>`
    })
    
    backendTable.innerHTML = str;
}
// 呈現訂單列表
let getOrderData = () => {
  const url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
  axios
  .get(url, config)
  .then(function (response) {
    // 成功會回傳的內容
    orderData = response.data.orders;
    if (orderData.length > 0) {
      addChart();
    } else {
      document.querySelector('#revenueChart').innerHTML = '';
    }
    render(orderData);
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error);
    alert("請確認 API Path 是否已申請 (っ˘ω˘ς )");
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
  const url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;

  axios
    .put(
      url,
      {
        data:{
          id: orderID,
          paid: (!orderPaid)
        }
      },
      config
    )
    .then(function (response) {
      // 成功會回傳的內容
      orderData = response.data.orders;
      render(orderData);
      alert("已更改訂單狀態！")
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error.response);
      alert(error.response.data.message)
    });
}
backendTable.addEventListener("click", (e) => {
  e.preventDefault();
  if (!(e.target.classList.contains("orderState"))) return;
  let orderID = e.target.closest("tr").querySelector(".order-id").textContent
  modifyOrderData(e.target.textContent,orderID)
})
//------------------------------------------------------
// c3 圖表
let addChart = () => {
  let columns = [];
    let productObj = {};
    orderData.forEach((item,index) => {
      orderData[index].products.forEach((product) => {
        if (productObj[product.title] == undefined) {
          productObj[product.title] = (product.price) * (product.quantity);
        } else {
          productObj[product.title] += (product.price) * (product.quantity);
        }
      })
    });
  let productTitle = [];
  productTitle = Object.keys(productObj);
  
  productTitle.forEach((item) => {
    columns.push([item, productObj[item]]);
  });
  let sortArr = [...columns];
  sortArr.sort((a, b) => {
      return b[1] - a[1];
  })
  if (sortArr.length > 3) {
    let otherTotal = 0;
    for (let i = 3; i < sortArr.length; i++) {
        otherTotal += sortArr[i][1];
    }
    sortArr.splice(3);
    sortArr.push(['其他', otherTotal]);
  }
  
  let revenueChart = c3.generate({
    bindto: "#revenueChart",
    data: {
      columns: sortArr,
      type: 'pie'
    },
    pie: {
      label: {
        show: false
      }
    },
    color: {
      pattern: ['#b4e6ee','#cd7b29', '#8bc5cd', '#5a9ca4']
    }
  });
};
//------------------------------------------------------
// 刪除全部訂單
let deleteAllOrder = () => {
  if (orderData.length < 1) {
    alert('訂單為空');
    return
  }
  const url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders`;
  axios.delete(url, config)
  .then(function (response) {
    // 成功會回傳的內容
    orderData = response.data.orders;
    if (orderData.length > 0) {
      addChart();
    } else {
      document.querySelector('#revenueChart').innerHTML = '';
    }
    render(orderData);
    alert(response.data.message)
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response.data.message);
    alert(error.response.data.message)
  });
}
removeOrderAllBtn.addEventListener("click", deleteAllOrder)
//------------------------------------------------------
// 刪除特定訂單
let deleteOrder = (orderId) => {
  const url = `${baseUrl}/api/livejs/v1/admin/${api_path}/orders/${orderId}`;
  axios.delete(url, config)
  .then(function (response) {
    // 成功會回傳的內容
    orderData = response.data.orders;
    if (orderData.length > 0) {
      addChart();
    } else {
      document.querySelector('#revenueChart').innerHTML = '';
    }
    render(orderData);
    alert("刪除訂單成功")
  })
  .catch(function (error) {
    // 失敗會回傳的內容
    console.log(error.response);
    alert(error.response.data.message)
  });
}
backendTable.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("btn-delete"))) return;
  e.preventDefault();
  let order = orderData.filter(order => order.id === e.target.closest("tr").querySelector("td").textContent)
  deleteOrder(order[0].id);
})