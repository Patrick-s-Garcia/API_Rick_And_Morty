function getCharacterIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
  

  function loadCharacterDetails() {
    const characterId = getCharacterIdFromUrl();
    if (!characterId) {
      alert('ID do personagem não encontrado');
      return;
    }
  
    axios.get(`https://rickandmortyapi.com/api/character/${characterId}`)
      .then(response => {
        const character = response.data;
        const characterDetailsContainer = document.getElementById('character-details');
        characterDetailsContainer.innerHTML = `
          <img src='${character.image}' alt='' class="card-img-top">
          <div class="card-body py-4 px-5 bg-transparent border border-3 border-top-0 border-success rounded-bottom">
            <h1 class="card-title fw-bold fs-1 text-decoration-none namehovermodal fontmodal lh-1">${character.name}</h1>
            <p class="card-text text-white lh-base fs-4">Status: ${character.status}</p>
            <p class="card-text text-white lh-base fs-4">Espécie: ${character.species}</p>
            <p class="card-text text-white lh-base fs-4">Gênero: ${character.gender}</p>
            <p class="card-text text-white lh-base fs-4">Origem: ${character.origin.name}</p>
            <p class="card-text text-white-50 fs-5 lh-1">Última localização conhecida:</p>
            <p class="card-text text-white fs-4">${character.location.name}</p>
          </div>
        `;
      })
      .catch(error => {
        console.error('Erro ao carregar detalhes do personagem:', error);
        alert('Erro ao carregar detalhes do personagem.');
      });
  }
  
  window.onload = loadCharacterDetails;
  