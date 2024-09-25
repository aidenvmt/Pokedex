const url = "https://pokeapi.co/api/v2/pokemon/snivy";

// function returnName() {
//   fetch(url)
//     .then((res) => res.json())
//     .then((response) => {
//       const name = response.name;
//       console.log(name);
//       return name;
//     });
// }

async function returnURL(pokemon) {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const data = await response.json();
  const pokemonEncontrado = data.results.find(
    (elemento) => elemento.name === pokemon
  );

  if (pokemonEncontrado) {
    console.log(pokemonEncontrado.url);
    return pokemonEncontrado.url;
  } else {
    return null;
  }
}

async function returnPokemon() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const data = await response.json();
  const pokemones = data.results.map((pokemon) => pokemon.name);

  return pokemones;
}

document.addEventListener("DOMContentLoaded", async () => {
  const pokemon_list = await returnPokemon();

  const resultsBox = document.querySelector(".result-box");
  const inputBox = document.getElementById("input-box");

  inputBox.onkeyup = function () {
    let resultado = [];
    let input = inputBox.value;

    if (input.length) {
      resultado = pokemon_list.filter((keyword) => {
        return keyword.toLowerCase().includes(input.toLowerCase());
      });
      console.log(resultado);
    } else {
      return " ";
    }
    mostrar(resultado);
  };

  function mostrar(resultado) {
    const contenido = resultado.map((lista) => {
      return "<li onclick='selectInput(this)'>" + lista + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + contenido.join("") + "</ul>";
  }

  window.selectInput = async function (lista) {
    inputBox.value = lista.innerHTML;
    resultsBox.innerHTML = "";

    let pokemon = inputBox.value;
    let pokemon_url = await returnURL(pokemon);
    crearCard(pokemon_url);
  };
});
async function crearCard(url) {
  const response = await fetch(url);
  const data = await response.json();

  const div = document.querySelector(".cards_container");
  div.innerHTML = "";

  const cards = document.createElement("div");
  cards.classList.add("cards");

  const titulo = document.createElement("h1");

  const nombre_pokemon = data.name;
  caracter_titulo = nombre_pokemon.charAt(0).toUpperCase();
  cadena_final = nombre_pokemon.slice(1);
  titulo_final = caracter_titulo + cadena_final;
  titulo.innerHTML = titulo_final;

  async function mostrarTipos(data) {
    for (let tipo of data.types) {
      const response = await fetch(tipo.type.url);
      const res = await response.json();

      const sprite_tipo = res.sprites["generation-vi"]["x-y"].name_icon;

      const tipos_img = document.createElement("img");
      tipos_img.classList.add("tipos");
      tipos_img.src = sprite_tipo;
      cards.appendChild(tipos_img);
    }
  }

  const sprite = document.createElement("img");
  sprite.classList.add("sprite");
  const sprites = data.sprites.other.showdown.front_default;
  sprite.src = sprites;

  div.appendChild(cards);
  cards.appendChild(titulo);
  mostrarTipos(data);
  cards.appendChild(sprite);
}
