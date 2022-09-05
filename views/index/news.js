const newsType=document.getElementById("newsType");
const newsdetails=document.getElementById("newsdetails");


//array
var newsDataArr=[];

//apis

const API_KEY ="3314d224194e4878ace3b0d512e1e989";

const SPORTS_NEWS=("https://newsapi.org/v2/top-headlines?country=in&category=Sports&pageSize=6&apiKey=3314d224194e4878ace3b0d512e1e989")

window.onload=function(){
    newsType.innerHTML="";
    fetchSportsNews();

};


const fetchSportsNews =async() => {
    const response=await fetch(SPORTS_NEWS);
    newsDataArr=[];
    if(response.status >=200 && response.status <300){
         const myJson=await response.json();
         console.log(myJson);
         newsDataArr=myJson.articles;
    }else{
        //handle errors
        console.log(response.status,response.statusText);
    }
    displayNews();
}

function displayNews(){

     newsdetails.innerHTML="";

    if(newsDataArr.length==0){
        newsdetails.innerHTML="<h4>No data formed</h4>"
        return;
    }

    var i=0;

    newsDataArr.forEach(news =>{
        i++;
        console.log(i);
        var date=news.publishedAt.split("T");

        var col=document.createElement('div');
        col.className="card mycard";
        col.setAttribute("width","80rem");

        // var card= document.createElement('div');
        // card.className="p-3 align-left";

        var image=document.createElement('img');
        image.className="caed-img-top";
        // image.setAttribute("object-fit","contain");
        // image.setAttribute("width","100%");
        image.src=news.urlToImage;
        col.appendChild(image);

        // var cardbody=document.createElement('div');

        // var newsHeading=document.createElement('h4');
        // newsHeading.className="card-title";
        // news.innerHTML=news.title;
        var card_body = document.createElement("div");
        card_body.className="card-body";

        var dateHeading=document.createElement('p');
        dateHeading.className="text-secondary date";//* */
        dateHeading.innerHTML=date[0];

        var discription=document.createElement('p');
        discription.className="text-dark card-text";//** */
        discription.innerHTML=news.description.substring(0, 120);  

        card_body.appendChild(dateHeading);
        card_body.appendChild(discription);

        var card_body2 = document.createElement('div');
        card_body2.className="card-body";

        var link=document.createElement('a');
        link.className="card-link";
        link.setAttribute("target","_blank");
        link.href=news.url;
        link.innerHTML="Read More &#8594 ";



        // cardbody.appendChild(newsHeading);
        // cardbody.appendChild(dateHeading);
        // cardbody.appendChild(discription);
        card_body2.appendChild(link);
       
        col.appendChild(card_body);
        col.appendChild(card_body2);

        // card.appendChild(image);
        // card.appendChild(cardbody);

        // col.appendChild(card);

        newsdetails.appendChild(col);



    })
}