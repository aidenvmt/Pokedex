const url = "https://pokeapi.co/api/v2/pokemon/snivy";

function returnName() {
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const name = response.name;
      console.log(name);
      return name;
    });
}
returnName();

function returnID() {
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const id = response.id;
      console.log(id);
      return id;
    });
}

function returnPokemon() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
    .then((res) => res.json())
    .then((response) => {
      const pokemones = response.results.map((pokemon) => pokemon.name);
      console.log(pokemones);
      return pokemones;
    });
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

  window.selectInput = function (lista) {
    inputBox.value = lista.innerHTML;
    resultsBox.innerHTML = "";
  };
});
