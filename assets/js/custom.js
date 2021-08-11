$(document).ready(function () {

  // ================================= Carousel fetching =====================================================
  async function getCountries() {
    let url = 'https://restcountries.eu/rest/v2/';
    try {
      let res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  async function renderCountries() {
    let Countries = await getCountries();
    let template = '';
    Countries.forEach((country, index) => {

      template += `
      <div class="item">
       <div class="card" id="${index}">
          <img src="${country.flag}" class="card-img-top" alt="Country Flag">
          <div class="card-body">
              <h5 class="card-title">${country.name}</h5>
              <p class="card-text">${country.capital}</p>
          </div>
       </div>
      </div>
    `
    });
    $('.owl-carousel').html(template);

    $(".owl-carousel").owlCarousel({
      items: 4,
      dots: false,
      margin:10,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        768: {
          items: 2
        },
        900: {
          items: 3
        },
        1200: {
          items: 4
        }
      }
    });



    // =============================Current Country Section=====================================================

    // ========= converting the neighbors alphaCode of each country to its full name =========


    function neighborsName(cardBorders) {
      var alphaCode = [];
      var countryName = [];

      for (let i = 0; i < Countries.length; i++) {

        alphaCode[i] = Countries[i].alpha3Code;
        countryName[i] = Countries[i].name;

      }

      if (cardBorders.length == 0) {

        cardBorders[0] = 'No Neighbors Available';

      } else {
        for (let i = 0; i < cardBorders.length; i++) {

          for (let j = 0; j < alphaCode.length; j++) {
            if (alphaCode[j] == cardBorders[i]) {

              cardBorders[i] = countryName[j];

            }

          }
        }

      }

    }

    // ============================== End Of the function ================================



    // ========= Binding card details of the selected country ============================


    function CurrentCountry(myCountry) {
      let html = '';
      let htmlSegment =
        `
         <div class="card mb-3 col-12 col-lg-4 mt-5 text-white">
           <div class="row g-0">
             <div class="col-md-10 col-lg-4 mt-4 me-3 mx-md-auto mx-lg-0">
                 <img src="${myCountry.flag}" class="img-fluid rounded-start" alt="Country Flag">
             </div>
             <div class="col-md-12 col-lg-6">
                 <div class="card-body text-center text-lg-start">
                     <h5 class="card-title fw-bold country name"> ${myCountry.name}</h5>
                     <p class="card-text capital">Capital: ${myCountry.capital} </p>
                     <p class="card-text capital">Currency: ${myCountry['currencies'][0]['name']}</p>
                     <p class="card-text capital">Language: ${myCountry['languages'][0]['name']} </p>
                     <p class="card-text capital">Population: ${myCountry.population} </p>
                     <p class="card-text capital">Subregion: ${myCountry.subregion} </p>
                     <p class="card-text capital">Timezone: ${myCountry.timezones} </p>
                     <h5 class="card-text Neighbors">Neighbors: ${myCountry.borders}</h5>
                </div>
             </div>
           </div>
         </div>
        `;

      html += htmlSegment;

      let selectedCountry = document.querySelector('.current-country .container');
      selectedCountry.innerHTML = html;

    }


    // ========= End of Binding card details of the selected country ============================

    // ========= start of Binding List of News of the selected country ============================


    function gettingNews(newsdata) {

      if (newsdata.totalResults != 0) {
        let newsSection = '';
        let NewsSegment = ''


        newsdata.articles.forEach((article) => {

          if (article.urlToImage == null) {
            article.urlToImage = '/assets/images/no-image.jpg'

          }

          NewsSegment = `
      <div class="card text-white mb-3">
      <div class="row g-0">
          <div class="col-md-12 col-lg-4">
              <div class="bgImg" style="background-image: url('${article.urlToImage}') ;"></div>
          </div>
          <div class="col-md-12 col-lg-8">
              <div class="card-body">
                  <h5 class="card-title country name"><a href="${article.url}">${article.title}</a></h5>
                  <p class="card-text capital">${article.title}</p>
                  <h5 class="card-text Neighbors text-end">${article.source.name}<span>${article.publishedAt}</span></h5>
              </div>
          </div>
      </div>
  </div>`;

          newsSection += NewsSegment;

        });
        let listOfNews = document.querySelector('.list-of-news');
        listOfNews.innerHTML = newsSection;

      } else {
        NewsSegment = `
    <h2 class="text-white text-center mt-4 mb-4">No Current News</h2>
    `;
        let listOfNews = document.querySelector('.list-of-news');
        listOfNews.innerHTML = NewsSegment;
      }

    }

    // ========= End of Binding List of News of the selected country ============================


    // ==============================onClick function=====================================

    var card = $('.countries .container .owl-carousel .item .card');

    card.click(function renderCountry() {

      neighborsName(Countries[this.id].borders);


      CurrentCountry(Countries[this.id]);


      const recievedNews = (newsdata) => {

        gettingNews(newsdata);

      }

      let apikey = 'f364bb873491438b8050bf9566fc04bf';
      let url = `https://newsapi.org/v2/top-headlines?country=${Countries[this.id].alpha2Code}&apiKey=${apikey}`;

      fetch(url)
        .then(response => response.json())
        .then(recievedNews)

    });

  }

  renderCountries();

})