console.log('Hello World!');

const form=document.querySelector('form');
const loadingElement=document.querySelector('.loading');
const mewsElement=document.querySelector('.mews');
const API_URL=window.location.hostname==='localhost' ? 'http://localhost:3000/mews' : 'https://memexg.herokuapp.com/';  //the server I am making request to

loadingElement.style.display='none';

listAllMews();

form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const formData=new FormData(form);
    const owner=formData.get('owner');
    const caption=formData.get('caption');
    const umeme=formData.get('umeme');

    const mew={
        owner,
        caption,
        umeme
    };

    form.style.display='none';

    loadingElement.style.display='none';

    console.log(mew);
    form.style.display='none';
    loadingElement.style.display='';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'Content-Type':'application/json'
        }

    }).then(response => response.json())
      .then(createdMew => {
          console.log(createdMew);
          form.reset();
          listAllMews();
          form.style.display='';
          loadingElement.style.display='none';
      });

});

  

function listAllMews(){
    mewsElement.innerHTML='';
    fetch(API_URL)
        .then(response=>response.json())
        .then(mews=>{
       console.log(mews); 
       mews.reverse();
       mews.forEach(mew => {
           const div=document.createElement('div');

           const header=document.createElement('h3');
           header.textContent=mew.owner;
           
           const contents=document.createElement('h5');
           contents.textContent=mew.caption;
           
           const img = document.createElement("img");
           img.src = mew.umeme;
           img.style.border="1px solid #ddd";
           img.style.padding="5px";
           img.style.width="50%";

           

           div.appendChild(header);
           div.appendChild(contents);
           div.appendChild(img);
           

           mewsElement.appendChild(div);
           div.style.marginBottom="100px";
       });
       loadingElement.style.display='none';
    });
}