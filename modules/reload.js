import { Chart } from "chart.js"
import { getRandomColor } from "./http.requests"

export function reloadTransactions(arr, place) {

   place.innerHTML = ""

   for (let item of arr) {

      let trans_item = document.createElement('div')
      let trans_row__left = document.createElement('div')
      let time = document.createElement('span')
      let day = document.createElement('span')
      let trans_currency = document.createElement('img')

      let trans_row__center = document.createElement('div')
      let trans_waiting = document.createElement('div')
      let trans_id = document.createElement('span')

      let trans_row__right = document.createElement('div')
      let amount = document.createElement('span')
      let btn = document.createElement('button')

      trans_item.classList.add("trans-item")
      trans_item.classList.add("trans-row")

      trans_row__left.classList.add("trans-row")
      trans_row__left.classList.add("trans-row__left")

      trans_currency.classList.add("trans-currency")
      trans_currency.src = "/public/icons/ellipse.svg"
      trans_currency.style.backgroundImage = ` url('/public/icons/${item.img}.svg')`
      trans_currency.alt = "currency"

      time.innerHTML = item.date.time
      day.innerHTML = item.date.day

      trans_row__center.classList.add("trans-row__center")
      trans_row__center.classList.add("trans-row")
      trans_waiting.classList.add("trans_waiting")
      trans_id.classList.add("trans-id")

      trans_waiting.style.backgroundImage = `url("/public/icons/${item.succes.includes("false")}Arrow.svg")`
      trans_id.innerHTML = item.id

      trans_row__right.classList.add("trans-row__right")
      trans_row__right.classList.add("trans-row")

      amount.classList.add("amount")
      amount.innerHTML = item.sum + " " + item.currency

      if (item.succes === "false") {
         btn.innerHTML = "Error"
         btn.classList.add("btn-error")
         btn.classList.remove("btn-complete")
      }
      else if (item.succes === "Waiting") {
         btn.innerHTML = item.succes
         btn.classList.remove("btn-error")
         btn.classList.remove("btn-complete")
      }
      else {
         btn.innerHTML = "Complete"
         btn.classList.add("btn-complete")
         btn.classList.remove("btn-error")
      }

      trans_item.append(trans_row__left, trans_row__center, trans_row__right)
      trans_row__left.append(time, day, trans_currency)
      trans_row__center.append(trans_waiting, trans_id)
      trans_row__right.append(amount, btn)
      place.append(trans_item)

   }
}
export function reloadMiniTransactions(arr, place) {
   place.innerHTML = '<div class="effect"><span>></span></div>'

   for (let item of arr) {
      let itemWallet =  document.createElement('div')
      let itemLeft = document.createElement('div')
      let itemRight = document.createElement('div')
      let itemBox = document.createElement('div')
      let imgUp = document.createElement('img')
      let itemText = document.createElement('div')
      let itemH5 = document.createElement('h5')
      let itemP = document.createElement('p')
      let itemPrice = document.createElement('div')
      let randomFrom = ["From Elon Musk", "To Unknown"];
      let randomIndex = Math.floor(Math.random() * randomFrom.length);
      let randomItem = randomFrom[randomIndex];
      
      itemP.innerHTML = randomItem;

      if(itemP.innerHTML == "From Elon Musk") {
         itemPrice.innerHTML = '+ 4500$'
         imgUp.src = "./public/icons/Arrow-up.svg"
         itemH5.innerHTML = "Received BitCoin"
      } else {
         itemPrice.innerHTML = '- 4500$'
         imgUp.src = "./public/icons/arrow_tr_down.svg"
         itemH5.innerHTML = "Sent BitCoin"
      }
      itemLeft.innerHTML = "1:16 AM"

      itemWallet.classList.add('item-wallet')
      itemLeft.classList.add('item__left')
      itemRight.classList.add('item__right')
      itemBox.classList.add('item__box')
      itemText.classList.add('item__text-box')
      itemPrice.classList.add('.item__price')
      

      itemWallet.append(itemLeft, itemRight)
      itemRight.append(itemBox, itemPrice)
      itemBox.append(imgUp, itemText)
      itemText.append(itemH5, itemP)
      place.append(itemWallet)
   }
}
export function reloadCard(arr, place) { const data = { labels: [], datasets: [{ label: 'This card balance', data: [], backgroundColor: [], hoverOffset: 4, borderColor: "transparent",}], }; let total = 0; place.innerHTML = ' '; for (let item of maxBalanxe(arr)) { place.innerHTML += `<div class="cards-slide"><div class="item"><div class="item__title">${item.name}</div><div class="item__statistic-box"><div class="item__text-box"><div class="item__price">${item.balance + " " + item.currens}</div><div class="item__proc">+2,59%</div></div><img src="./public/icons/btc-icon.png" alt="Btc" class="item__img"></div><img src="./public/images/statistic-vector.png" alt="" class="item__status-vector"></div></div>`; total += (+item.balance) }; function maxBalanxe(array) { return [...array].sort((a, b) => +b.balance - +a.balance); }; for (let q of maxBalanxe(arr).slice(0, 3)) { data.datasets[0].data.push(q.balance); data.labels.push(q.name); data.datasets[0].backgroundColor.push(getRandomColor()); }; return [data, total]; }

export function marketNews(arr, place) {
   place.innerHTML = ""
   for (let item of arr) {
     let market_item = document.createElement("a")
     let trans_row = document.createElement("div")
     let market_img = document.createElement("img")
     let market_title = document.createElement("p")
     let market_text = document.createElement("p")
     let canw_wrap = document.createElement("div")
     let canvas = document.createElement("canvas")
 
     market_item.classList.add("market_item")
     trans_row.classList.add("trans-row")
     market_title.classList.add("market_title")
     canw_wrap.classList.add("canw_wrap")
 
     market_item.href = item.amp_url
     market_img.src = item.publisher.logo_url
     market_img.alt = 'img'
     market_title.innerHTML = item.publisher.name
     market_text.innerHTML = item.title.slice(0, 70)
 
     canw_wrap.append(canvas)
     trans_row.append(market_img, market_title)
     market_item.append(trans_row, market_text, canw_wrap)
     place.append(market_item)
     
     let lineColor = Math.random().toFixed()
     const ctx = canvas
     ctx.height = 47
     new Chart (ctx, {
       type: "line",
       data: {
         labels: [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
         datasets: [{
           data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 12)),
           fill: false,
           pointRadius: 0
         }],
       },
       options: {
         scales: {
           x: {
             display: "false"
           },
           y: {
             display: false
           }
         },
         plugins: {
           legend: {
             display: false
           }
         },
         elements: {
           line: {
             borderWidth: 3,
             borderColor: lineColor > 0 ? "red" : '#00E8AC',
             shadowColor: "red"
 
           }
         },
       }
     })
   }
 }