let pokemonData = null;

async function fetchPokemonData() {
  if (!pokemonData) {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
      );
      if (!response.ok)
        throw new Error("Error al obtener los datos del Pokémon");
      pokemonData = await response.json();
    } catch (error) {
      console.error("Error al obtener los datos del Pokémon:", error);
    }
  }
  return pokemonData;
}

async function returnURL(pokemon) {
  const data = await fetchPokemonData();
  const pokemonEncontrado = data.results.find(
    (elemento) => elemento.name.toLowerCase() === pokemon.toLowerCase()
  );

  if (pokemonEncontrado) {
    return pokemonEncontrado.url;
  } else {
    console.error("Pokémon no encontrado:", pokemon);
    return null;
  }
}

async function returnPokemon() {
  const data = await fetchPokemonData();
  return data.results.map((pokemon) => pokemon.name);
}

document.addEventListener("DOMContentLoaded", async () => {
  const pokemon_list = await returnPokemon();
  const resultsBox = document.querySelector(".result-box");
  const inputBox = document.getElementById("input-box");

  inputBox.onkeyup = function () {
    let resultado = [];
    let input = inputBox.value;

    if (input.length) {
      resultado = pokemon_list.filter((keyword) =>
        keyword.toLowerCase().includes(input.toLowerCase())
      );
    } else {
      resultsBox.innerHTML = "";
      return;
    }
    mostrar(resultado);
  };

  function mostrar(resultado) {
    const contenido = resultado
      .map((lista) => {
        const texto_formateado = lista.charAt(0).toUpperCase() + lista.slice(1);
        return `<li onclick='selectInput("${lista}")'>${texto_formateado}</li>`;
      })
      .join("");

    resultsBox.innerHTML = `<ul>${contenido}</ul>`;
  }

  window.selectInput = async function (lista) {
    inputBox.value = lista;
    resultsBox.innerHTML = "";

    const pokemon_url = await returnURL(lista);
    if (pokemon_url) crearCard(pokemon_url);
  };
});

async function crearCard(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const div = document.querySelector(".cards_container");
    div.innerHTML = ""; // Limpiar contenido anterior

    const cards = document.createElement("div");
    cards.classList.add("cards");

    const titulo = document.createElement("h1");
    titulo.textContent = data.name.toUpperCase(); // Formatear nombre

    const content_container = document.createElement("div");
    content_container.classList.add("content-container");

    const sprite = document.createElement("img");
    sprite.classList.add("sprite");
    sprite.src = data.sprites.other["official-artwork"].front_default;

    const stats_container = document.createElement("div");
    stats_container.classList.add("stats-container");

    await mostrarStats(data, stats_container);

    content_container.appendChild(sprite);
    content_container.appendChild(stats_container);

    cards.appendChild(titulo);
    cards.appendChild(content_container);

    div.appendChild(cards);

    mostrarTipos(data, cards);
  } catch (error) {
    console.error("Error al crear la tarjeta:", error);
  }
}

async function mostrarTipos(data, cards) {
  const tipos_container = document.createElement("div");
  tipos_container.classList.add("tipos_container");

  for (let tipo of data.types) {
    const response = await fetch(tipo.type.url);
    const res = await response.json();

    // Obtener el sprite del tipo de Pokémon (ajusta si es necesario)
    const sprite_tipo = res.sprites["generation-vi"]["x-y"].name_icon;

    // Crear la imagen del tipo
    const tipos_img = document.createElement("img");
    tipos_img.classList.add("tipos");
    tipos_img.src = sprite_tipo;

    // Agregar la imagen al contenedor de tipos
    tipos_container.appendChild(tipos_img);
  }

  // Agregar el contenedor de tipos debajo del sprite
  cards.appendChild(tipos_container);
}

async function mostrarStats(data, stats_container) {
  const ul = document.createElement("ul");
  ul.classList.add("stats-list");

  data.stats.forEach((stat) => {
    const li = document.createElement("li");
    li.textContent = `${stat.stat.name.toUpperCase()}: ${stat.base_stat}`;
    ul.appendChild(li);
  });

  stats_container.appendChild(ul);
}
