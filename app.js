// PART ONE

// Number 1
let url = "http://numbersapi.com/";
let num1 = 42;

async function favNumber() {
    let res = await axios.get(url + num1 + '?json');
    console.log(res.data);
}

favNumber();

// Number 2
let nums = [5,7,9,42];

async function favNumbers() {
    let res = await axios.get(url + nums + '?json');
    console.log(res.data);
}

favNumbers();

// Number 3

async function getFourFacts(){
    let fourFacts = await Promise.all(
        Array.from({ length: 4 }, () => axios.get(url + num1 + '?json'))
      );
      fourFacts.forEach(res => {
        $('#part_2').append(`<p>${res.data.text}</p>`);
      });    
}

getFourFacts();



    
// PART TWO 

// Number 1
let url2 = "https://deckofcardsapi.com/api/deck"

async function drawCard() {
    let res = await axios.get(url2 + "/new/draw/?count=1");
    let suit = res.data.cards[0].suit;
    let value = res.data.cards[0].value;
    console.log(`${value} of ${suit}`)
}

drawCard();


// Number 2

async function draw2Cards() {
    let firstCard = await axios.get(url2 + "/new/draw/?count=1");
    let deckId = firstCard.data.deck_id;
    let secondCard = await axios.get(url2 + `/${deckId}/draw/?count=1`);
    [firstCard, secondCard].forEach(card => {
      let { suit, value } = card.data.cards[0];
      console.log(`${value} of ${suit}`);
    });
}

draw2Cards();


// Number 3

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
};

async function drawCards(){
    let deckId = null;
    let $btn = $('button');
    let $cards = $('#cards');
    
    let res = await axios.get(url2 + "/new/shuffle");
    deckId = res.data.deck_id;
    $btn.show();


    $btn.on('click', async function() {
        let data = await axios.get(`${url2}/${deckId}/draw`);
        let cardSrc = data.data.cards[0].image;
            
        let randomRotation = `rotate(${getRandom(-10, 10)}deg)`;
        let randomOffsetX = `${getRandom(-10, 10)}px`;
        let randomOffsetY = `${getRandom(-10, 10)}px`;
            
        $cards.append(
            $('<img>', {
                src: cardSrc,
                style: `transform: ${randomRotation} translate(${randomOffsetX}, ${randomOffsetY});`
            })
        );
        if (data.data.remaining === 0) $btn.off('click');
        });
    
};

drawCards();



// FURTHER STUDY
// Number 1
let url3 = "https://pokeapi.co/api/v2/"

async function allPokemon() {
    let res = await axios.get(url3 + "pokemon?limit=1000&offset=0");
    console.log(res.data.results);
};

allPokemon();



// Number 2
async function threePokemon(){
    let res = await axios.get(url3 + "pokemon?limit=1000&offset=0");
    let total = res.data.results.length;
    let pokemonUrls = [];

    for (let i = 0; i < 3; i++) {
        let randId = getRandom(1, total);
        let url = res.data.results.splice(randId, 1)[0].url;
        pokemonUrls.push(url);
    }

    const pokemonData = await Promise.all(pokemonUrls.map(url => axios.get(url)));

    pokemonData.forEach(res => console.log(res.data));

};

threePokemon();


// Number 3
async function threePokemonV2(){
    let res = await axios.get(url3 + "pokemon?limit=1000&offset=0");
        let total = res.data.results.length;
        let pokemonUrls = [];

        for (let i = 0; i < 3; i++) {
            let randId = getRandom(1, total);
            let url = res.data.results.splice(randId, 1)[0].url;
            pokemonUrls.push(url);
        }

        const pokemonData = await Promise.all(pokemonUrls.map(url => axios.get(url)));

        const names = pokemonData.map(d => d.data.name);

        const speciesData = await Promise.all(pokemonData.map(d => axios.get(d.data.species.url)));

        const descs = speciesData.map(d => {
            let descriptionObj = d.data.flavor_text_entries.find(entry => entry.language.name === "en");
            return descriptionObj ? descriptionObj.flavor_text : "No description available, sorry!";
        });

        descs.forEach((desc, i) => {
            console.log(`${names[i]}: ${desc}`);
        });
};

threePokemonV2();
   