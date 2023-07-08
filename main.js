import {
   v4 as uuidv4
} from 'uuid';
import {
   reloadCard,
   reloadMiniTransactions,
   reloadTransactions
} from "./modules/reload"
import {
   useHttp
} from "./modules/http.requests";
import {
   Chart,
   registerables
} from 'chart.js'
import {
   wallets
} from "./modules/ui";
import axios from 'axios'
import { user } from './modules/user.js'

if(Chart) {
   Chart.register(...registerables)
}

const {request} = useHttp();
let ellipse = document.querySelector('#ellipse')

ellipse.innerHTML = `${user.name} ${user.surname}`

let conts = document.querySelectorAll("main .container");
let tabs = document.querySelectorAll("aside p");

conts.forEach((cont, idx) => {
   if (idx !== 0) {
      cont.classList.add("hide");
   }
});

tabs.forEach((btn) => {
   let key = btn.id;
   btn.style.backgroundImage = `url("/icons/${key}.svg")`;

   btn.onclick = () => {
      tabs.forEach(btn => btn.classList.remove("active_link"))
      btn.classList.add("active_link")
      if (key !== "ellipse" && key !== "out") {

         conts.forEach(cont => cont.classList.add('hide'))

         let cont = document.querySelector(`#cont-${key}`)
         cont.classList.remove('hide')
      }
   }
})

// Overview
let addWidget = document.querySelector(".top__container-right-btn");
let widgetModal = document.querySelector(".overview-modal");
let addWidgetBtn = document.querySelector(".add-widget");
let widgetForm = document.forms.addWidget

request('/overviews', 'get').then(res => {
   wallets(res.splice(res.length - 4, res.length))
})

widgetForm.onsubmit = (e) => {
   e.preventDefault()

   let widget = {
      "cryptoCurrency": "BTC",
      "walletContentPriceUSD": "30,000,000",
      "currencyBox": [{
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
         },
         {
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
         },
         {
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
         },
      ]
   }

   let fm = new FormData(widgetForm)

   fm.forEach((value, key) => {
      widget[key] = value
   })

   console.log(widget);
   request("/overviews", "post", widget)
   widgetModal.style.display = 'none'
   location.assign('/')
}

addWidget.onclick = () => {
   widgetModal.style.display = 'flex'
};

// =====================


let trans_column = document.querySelector(".trans-column");
let trans_smoke = document.querySelector(".trans-wrapper .trans-after");

// reloadTransactions(transactions, trans_column);

setTimeout(() => {
   if (trans_column.childElementCount <= 4) {
      trans_smoke.style.display = "none";
   } else {
      trans_smoke.style.display = "block";
   }
}, 300);

trans_column.onscroll = () => {
   if (trans_column.scrollTop < trans_column.scrollHeight - 401) {
      trans_smoke.style.bottom = "0px";
   } else {
      trans_smoke.style.bottom = "-100px";
   }
};

trans_smoke.onclick = () => {
   trans_column.scrollTop = trans_column.scrollHeight;
};

let hystory = document.querySelector(".trans-title #hystory");
let addTransBtn = document.querySelector(".trans-title #addTransaction");
let trans_modal_bg = document.querySelector(".trans-modal_bg");
let trans_modal = document.querySelector(".trans-modal");

addTransBtn.onclick = () => {
   trans_modal_bg.style.display = "block";

   setTimeout(() => {
      trans_modal_bg.style.opacity = "1";
      trans_modal.style.left = "37%";
   }, 500);
};

hystory.onclick = () => {
   console.log(trans_column);
};

trans_modal_bg.onclick = () => {
   trans_modal_bg.style.opacity = "0";
   trans_modal.style.left = "-30%";
   setTimeout(() => {
      trans_modal_bg.style.display = "none";
   }, 500);
};

let currency_list = document.querySelector("#currency-list");
let currency_inp = document.querySelector(".inp-currency");
let localedSymbols = JSON.parse(localStorage.getItem("symbols"));

if (!localedSymbols) {
   axios
      .get(
         import.meta.env.VITE_CURRENCY_API, {
            headers: {
               apiKey: import.meta.env.VITE_API_KEY,
            },
         })
      .then((res) => {
         if (res.status === 200 || res.status === 201) {
            localStorage.setItem("symbols", JSON.stringify(res.data.symbols));
            setOption(res.data.symbols);
         }
      });
} else {
   setOption(localedSymbols);
}

function setOption(data) {
   for (let key in data) {
      let opt = new Option(data[key], key);

      currency_list.append(opt);
   }
}

let addTransaction = document.forms.addTransaction;
let trans_inputs = document.addTransaction.querySelectorAll("input");



request("/transactions/", "get").then((res) =>
   reloadTransactions(res, trans_column)
);



let filterBtns = document.querySelectorAll('.trans-btns button')
let transAll = document.querySelector('.trans-btns #transAll')

filterBtns.forEach(btn => {
   btn.onclick = () => {
      let key = btn.getAttribute("data-select")
      filterBtns.forEach(btn => btn.classList.remove("trans-btn_active"))
      btn.classList.add("trans-btn_active")
      // console.log(key);
      if (key === "All") {
         request("/transactions", "get")
            .then(res => reloadTransactions(res, trans_column))

         setTimeout(() => {
            if (trans_column.childElementCount <= 4) {
               trans_smoke.style.display = "none"
            } else {
               trans_smoke.style.display = "block"
            }

         }, 300);

      } else {

         request("/transactions?succes=" + key, "get")
            .then(res => reloadTransactions(res, trans_column))

         setTimeout(() => {
            if (trans_column.childElementCount <= 4) {
               trans_smoke.style.display = "none"
            } else {
               trans_smoke.style.display = "block"
            }

         }, 300);
      }
   }
})

addTransaction.onsubmit = (e) => {
   e.preventDefault();

   let filled = true;

   trans_inputs.forEach((inp) => {
      inp.classList.remove("error");
      inp.style.border = "none";

      if (inp.value.length === 0) {
         filled = false;
         inp.style.border = "1px solid red";
      }
   });

   if (filled) {
      let random = ["Waiting", "true", "false"];
      let transaction = {
         id: uuidv4(),
         succes: random[Math.floor(Math.random()) * random.length],
         date: {
            time: "AM " + new Date().getHours() + ":" + new Date().getMinutes(),
            day: new Date().getDate() + " jun " + new Date().getFullYear(),
         },
         img: "bitcoin",
      };

      let fm = new FormData(addTransaction);

      fm.forEach((value, key) => {
         transaction[key] = value;
      });

      trans_modal_bg.style.opacity = "0";
      trans_modal.style.left = "-30%";

      setTimeout(() => {
         trans_modal_bg.style.display = "none";
      }, 500);

      console.log(transaction);
      addTransaction.reset();

      request("/transactions", "post", transaction);

      request("/transactions/", "get").then((res) =>
         reloadTransactions(res, trans_column)
      );

      setTimeout(() => {
         if (trans_column.childElementCount <= 4) {
            trans_smoke.style.display = "none";
         } else {
            trans_smoke.style.display = "block";
         }
      }, 300);
   }

   filterBtns.forEach(btn => {
      filterBtns.forEach(btn => btn.classList.remove("trans-btn_active"))
      transAll.classList.add("trans-btn_active")
   })
}

let valuts = {
   BTC: "bitcoin",
};

currency_inp.oninput = () => {
   currency_inp.style.backgroundImage = `url("/public/icons/ellipse.svg"), url("/public/icons/${valuts[currency_inp.value]
      }.svg")`;
};

// market
function marketChart(id) {
   const ctx = document.getElementById(id);
   ctx.height = 10
   new Chart(ctx, {
      type: "line",
      data: {
         labels: [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
         datasets: [{
            data: [1, 2, 2, 3, 1, 5, 1, 2, 2, 3, 1, 2],
            fill: false,
            pointRadius: 0
         }]
      },
      options: {
         scales: {
            x: {
               display: false
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
               borderColor: '#00E8AC',
               shadowColor: 'rgba(0,0,0,0.2)',
               shadowBlur: 10
            }
         }
      }
   });
}

// wallets
let box = document.querySelector('.wallets__top-box-cards');
let items_box = document.querySelector('.right-block__box');
const ctx = document.getElementById('wl-chard__circle-chart');
let total_p = document.querySelector('.effect-chart p');
export let itemWallet = document.querySelector('.item-wallet')
request("/cards", "get")
   .then(res => {
      let [data, total] = reloadCard(res, box);
      new Chart(ctx, {
         type: 'doughnut',
         data: data,
         options: {
            cutout: 40,
            plugins: {
            elements: {
               arc: {
                 borderWidth: 10, 
                 borderColor: 'red' 
               },
               point: {
                 radius: 10, 
                 pointStyle: 'circle' 
               }
            }
         },
          }
      });
      total_p.innerText = `${total}$`;
      let items = document.querySelectorAll('.wallets__top-box-cards .cards-slide');

      items.forEach(item => {
         item.onmouseover = () => {
            item.classList.add('hover')
         }
         item.onmouseout = () => {
            item.classList.remove('hover')
         }
      })
   })


let effect = document.querySelector('.effect');

let obj = [
   1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]
reloadMiniTransactions(obj, items_box)
effect = document.querySelector('.effect');

setTimeout(() => {
   if (items_box.childElementCount <= 4) {
      effect.style.display = "none";
   } else {
      effect.style.display = "flex";
   }
}, 240);

items_box.onscroll = () => {
   if (items_box.scrollTop < (items_box.scrollHeight - 241)) {
      effect.style.opacity = '1'
   } else {
      effect.style.opacity = '0'
   }
}

effect.onclick = () => {
   items_box.scrollTop = items_box.scrollHeight;
}

if (!localedSymbols) {
  axios
     .get(
        import.meta.env.VITE_CURRENCY_API, {
           headers: {
              apiKey: import.meta.env.VITE_API_KEY,
           },
        })
     .then((res) => {
        if (res.status === 200 || res.status === 201) {
           localStorage.setItem("symbols", JSON.stringify(res.data.symbols));
           setOption(res.data.symbols);
        }
     });
}

let boxLeft = document.querySelector('.box-left')

request("/cards", "get")
   .then(res => {
     new Chart(boxLeft, {
         type: 'line',
         data: {
            labels: ["February", "March", "April", "May", "June", "July"],
            datasets: [{
               label: "",
               data: [0, 5000, 6500, 4500, 8200, 6700, 6000],
               backgroundColor: ['#1288E8'],
               borderColor: ['#1288E8'],
               borderWidth: 2,
               pointRadius: 0,
          pointHitRadius: 10,
          lineBorderRadius: 15
            }],
         },
         options: {
            responsive: false,
            tensions: {
               easing: 'easeInBounce',
               from: 1,
               to: 0,
               loop: true,
            }
         },
      });
   })

// Exchange 

let currencyExchange = document.querySelector('.currency-exchange')

if(localedSymbols) {
  setOptionExchange(localedSymbols)
} else {
  axios
  .get(
     import.meta.env.VITE_CURRENCY_API, {
        headers: {
           apiKey: import.meta.env.VITE_API_KEY,
        },
     })
  .then((res) => {
     if (res.status === 200 || res.status === 201) {
        localStorage.setItem("symbols", JSON.stringify(res.data.symbols));
        setOption(res.data.symbols);
      }
  })
}

function setOptionExchange(data) {
  for(let key in data) {
      let opt = new Option(data[key], key)

      currencyExchange.append(opt)
  }
}

const apiKey = "332555db6c7941f1a4f7a5c15e00f1ba";
const amountInDollars = 100;
let toInput = document.querySelector('.to-input')
let fromInput = document.querySelector('.from-currency')



// Функция для получения курса обмена валют
function getExchangeRate(baseCurrency, targetCurrency) {
  const rates = JSON.parse(localStorage.getItem('exchangeRates'));
  
  if (rates && rates[baseCurrency] && rates[baseCurrency][targetCurrency]) {
    return Promise.resolve(rates[baseCurrency][targetCurrency]);
  } else {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&base=${baseCurrency}`;
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const rate = data.rates[targetCurrency];
        
        const updatedRates = {
          ...(rates || {}),
          [baseCurrency]: {
            ...(rates && rates[baseCurrency] || {}),
            [targetCurrency]: rate
          }
        };

        localStorage.setItem('exchangeRates', JSON.stringify(updatedRates));
        
        return rate;
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
}

// Функция для конвертации валют
function convertCurrency(amount, baseCurrency, targetCurrency) {
  return getExchangeRate(baseCurrency, targetCurrency)
    .then(rate => {
      const convertedAmount = amount * rate;
      return convertedAmount;
    });
}

fromInput.onkeyup = () => {
  console.log(fromInput.value);
  convertCurrency(+fromInput.value, 'USD', 'RUB')
    .then(convertedAmount => {
      toInput.value = +convertedAmount;
    });
}


let logOut = document.querySelector('#log-out')

console.log(logOut);

logOut.onclick = () => {
  let con = confirm('are u sure?')
   if(con) {
      localStorage.removeItem("user");
      location.assign("/auth/")
   }
}
  

let circleOverviewChart = document.querySelector('#circle-overview-chart')

request("/cards", "get")
   .then(res => {
      new Chart(circleOverviewChart, { data: {
         labels: ["February", "March", "April", "May", "June", "July"],
         datasets: [{
            label: "Balance",
            type: 'doughnut',
            data: [0, 5000, 6500, 4500, 8200, 6700, 6000],
            backgroundColor: ['#1288E8', 'red', 'blue', 'black', 'green', 'white'],
            borderColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
       pointHitRadius: 10,
       lineBorderRadius: 15
         }],
      },
         options: {
            cutout: 40,
            plugins: {
            elements: {
               arc: {
                 borderWidth: 10, 
                 borderColor: 'red' 
               },
               point: {
                 radius: 10, 
                 pointStyle: 'circle' 
               }
            }
         },
          }
      });
   })
