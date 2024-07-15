const cardsContainer = document.querySelector(".container-cards");
const contentModal = document.querySelector(".modal");

function getAllCharacters(url = "https://rickandmortyapi.com/api/character/") {
  return axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const allCharacters = data.results;

      if (data.info.next) {
        return getAllCharacters(data.info.next).then((nextCharacters) => {
          return allCharacters.concat(nextCharacters);
        });
      }

      return allCharacters;
    })
    .catch((error) => {
      console.error("Erro ao buscar personagens:", error);
      throw error;
    });
}

let paginaAtual = 1;
const numeroPagina = document.getElementById("pageNumber");

function getCharacters(pagina = 1) {
  getAllCharacters()
    .then((allCharacters) => {
      const personagemPorPagina = 6;
      const inicio = (pagina - 1) * personagemPorPagina;
      const fim = inicio + personagemPorPagina;
      const personagensPagina = allCharacters.slice(inicio, fim);

      cardsContainer.innerHTML = "";

      personagensPagina.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");
        const details = character.url;
        const lastEpisodeUrl = character.episode.pop();

        characterCard.innerHTML = `
        <div class="card bg-transparent ">
            <img src='${character.image}' alt='' class="card-img-top">
            <div class="card-body py-4 px-5 bg-transparent border border-3 border-top-0 border-success rounded-bottom">
            <a  class="card-title fw-bold fs-2 text-decoration-none namehover lh-1" id="abrirModal${character.id}">
            ${character.name}</a>
            <p class="card-text d-flex align-items-center text-white lh-base fs-5"><span class="${character.status}"></span>${character.status} - ${character.species}</p>
            <p class="card-text text-white-50 fs-6 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-5">${character.location.name}</p>
            <p class="card-text text-white-50 fs-6 lh-1">Último episódio visto:</p><p class="card-text text-white fs-5" id="last-seen-${character.id}" ></p>
            </div>
        </div>
          `;

        cardsContainer.appendChild(characterCard);

        document.getElementById(`abrirModal${character.id}`).addEventListener("click", function () {
          window.location.href = `detalhes.html?id=${character.id}`;
        });

        axios
          .get(lastEpisodeUrl)
          .then(function (episode) {
            const labelEpisode = document.getElementById(
              `last-seen-${character.id}`
            );
            const nameEpisode = episode.data.name;
            labelEpisode.innerHTML = nameEpisode;
          })
          .catch(function (error) {
            console.log(error);
          });
      });

      numeroPagina.innerHTML = `<p class="page-link bg-transparent text-warning fw-bold border border-success" >${pagina}</p>`;

      console.log(allCharacters);
    })
    .catch((error) => {
      console.error("Erro ao buscar personagens:", error);
    });
}

function proximaPagina() {
  paginaAtual++;
  getCharacters(paginaAtual);
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    getCharacters(paginaAtual);
  }
}

document.getElementById("pesquisaForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const inputPesquisa = document.getElementById("inputPesquisa").value;
  if (inputPesquisa) {
    getAllCharacters()
      .then((allCharacters) => {
        const personagensFiltrados = allCharacters.filter((character) =>
          character.name.toLowerCase().includes(inputPesquisa.toLowerCase())
        );

        cardsContainer.innerHTML = "";

        personagensFiltrados.forEach((character) => {
          const characterCard = document.createElement("div");
          characterCard.classList.add("character-card");
          const details = character.url;
          const lastEpisodeUrl = character.episode.pop();

          characterCard.innerHTML = `
          <div class="card bg-transparent ">
              <img src='${character.image}' alt='' class="card-img-top">
              <div class="card-body py-4 px-5 bg-transparent border border-3 border-top-0 border-success rounded-bottom">
              <a class="card-title fw-bold fs-2 text-decoration-none namehover lh-1" id="abrirModal${character.id}">
              ${character.name}</a>
              <p class="card-text d-flex align-items-center text-white lh-base fs-5"><span class="${character.status}"></span>${character.status} - ${character.species}</p>
              <p class="card-text text-white-50 fs-6 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-5">${character.location.name}</p>
              <p class="card-text text-white-50 fs-6 lh-1">Último episódio visto:</p><p class="card-text text-white fs-5" id="last-seen-${character.id}" ></p>
              </div>
          </div>
            `;

          cardsContainer.appendChild(characterCard);

          document.getElementById(`abrirModal${character.id}`).addEventListener("click", function () {
            window.location.href = `detalhes.html?id=${character.id}`;
          });

          axios
            .get(lastEpisodeUrl)
            .then(function (episode) {
              const labelEpisode = document.getElementById(
                `last-seen-${character.id}`
              );
              const nameEpisode = episode.data.name;
              labelEpisode.innerHTML = nameEpisode;
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar personagens:", error);
      });
  } else {
    getCharacters();
  }
});

getCharacters(paginaAtual);
