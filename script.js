// Função genérica para carregar e comprimir imagem, atualizando preview e campo base64
function configurarInputImagem(inputId, previewId, base64Id) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const base64Input = document.getElementById(base64Id);

  input.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) {
      preview.src = "";
      base64Input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        base64Input.value = compressedDataUrl;
        preview.src = compressedDataUrl;
      };
    };
    reader.readAsDataURL(file);
  });
}

// Configura inputs de imagem para todas as áreas que precisam
configurarInputImagem('fotoPersonagem', 'previewFoto', 'previewFoto'); // fotoPersonagem não usa base64 escondido, só preview
configurarInputImagem('imagemHistoria', 'previewHistoria', 'imagemHistoriaBase64');
configurarInputImagem('imagemPersonalidade', 'previewPersonalidade', 'imagemPersonalidadeBase64');
configurarInputImagem('imagemMotivacao', 'previewMotivacao', 'imagemMotivacaoBase64');
configurarInputImagem('imagemPericia', 'previewPericia', 'imagemPericiaBase64');
configurarInputImagem('imagemItem', 'previewItem', 'imagemItemBase64');
configurarInputImagem('imagemMagia', 'previewFotoMagia', 'imagemMagiaBase64');

// Criar card genérico
function criarCard(textoHTML) {
  const div = document.createElement('div');
  div.className = 'card-item';
  div.style.flexWrap = 'wrap';

  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = textoHTML;
  contentDiv.classList.add("contentDiv");

  const btnEditar = document.createElement('button');
  btnEditar.textContent = 'Editar';
  btnEditar.style.marginRight = '8px';
  btnEditar.style.cursor = 'pointer';

  const btnRemover = document.createElement('button');
  btnRemover.textContent = 'Remover';
  btnRemover.style.cursor = 'pointer';

  [btnEditar, btnRemover].forEach(btn => {
    btn.style.padding = '4px 8px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.backgroundColor = '#3498db';
    btn.style.color = 'white';
    btn.style.fontSize = '0.85rem';
  });

  btnEditar.style.backgroundColor = '#f39c12';
  btnEditar.onmouseover = () => btnEditar.style.backgroundColor = '#e67e22';
  btnEditar.onmouseout = () => btnEditar.style.backgroundColor = '#f39c12';

  btnRemover.style.backgroundColor = '#e74c3c';
  btnRemover.onmouseover = () => btnRemover.style.backgroundColor = '#c0392b';
  btnRemover.onmouseout = () => btnRemover.style.backgroundColor = '#e74c3c';

  btnRemover.onclick = () => {
    if (confirm('Remover este item?')) {
      div.remove();
    }
  };

  btnEditar.onclick = () => {
    const html = contentDiv.innerHTML;

    // Editar perícia com imagem
    if (html.includes('<strong style="display: none;">Perícia:</strong>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const texto = doc.querySelector("strong").nextSibling.textContent.trim();
      document.getElementById("novaPericia").value = texto;

      const img = doc.querySelector("img");
      if (img && img.src.startsWith("data:image")) {
        document.getElementById("previewPericia").src = img.src;
        document.getElementById("imagemPericiaBase64").value = img.src;
      } else {
        document.getElementById("previewPericia").src = "5663766.png";
        document.getElementById("imagemPericiaBase64").value = "";
      }
    }
    // Editar item com imagem
    else if (html.includes('<strong style="display: none;">Item:</strong>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const texto = doc.querySelector("strong").nextSibling.textContent.trim();
      document.getElementById("novoItem").value = texto;

      const img = doc.querySelector("img");
      if (img && img.src.startsWith("data:image")) {
        document.getElementById("previewItem").src = img.src;
        document.getElementById("imagemItemBase64").value = img.src;
      } else {
        document.getElementById("previewItem").src = "5663766.png";
        document.getElementById("imagemItemBase64").value = "";
      }
    }
    // Editar magia com imagem (já existente)
    else if (html.includes("<h3")) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      document.getElementById("nomeMagia").value = doc.querySelector("h3").childNodes[0].textContent.trim();
      document.getElementById("nivelMagia").value = doc.querySelector("small")?.textContent || "";

      const paragrafos = doc.querySelectorAll("p");
      const imagemTag = doc.querySelector("img");
      if (imagemTag && imagemTag.src.startsWith("data:image")) {
        const base64 = imagemTag.src;
        document.getElementById("previewFotoMagia").src = base64;
        document.getElementById("imagemMagiaBase64").value = base64;
      } else {
        document.getElementById("previewFotoMagia").src = "guest.png";
        document.getElementById("imagemMagiaBase64").value = "";
      }

      paragrafos.forEach(p => {
        const texto = p.textContent.trim();

        if (texto.startsWith("Execução:")) {
          document.getElementById("execucaoMagia").value = texto.replace("Execução:", "").trim();
        } else if (texto.startsWith("Alcance:")) {
          document.getElementById("alcanceMagia").value = texto.replace("Alcance:", "").trim();
        } else if (texto.startsWith("Alvo:")) {
          document.getElementById("alvoMagia").value = texto.replace("Alvo:", "").trim();
        } else if (texto.startsWith("Duração:")) {
          document.getElementById("duracaoMagia").value = texto.replace("Duração:", "").trim();
        } else if (texto.startsWith("Descrição:")) {
          document.getElementById("descMagia").value = texto.replace("Descrição:", "").trim();
        } else if (texto.startsWith("Aprimorar:")) {
          document.getElementById("aprimorarMagia").value = texto.replace("Aprimorar:", "").trim();
        } else if (texto.startsWith("Verdadeiro:")) {
          document.getElementById("verdadeiroMagia").value = texto.replace("Verdadeiro:", "").trim();
        }
      });
    }
    // Editar habilidade (já existente)
    else {
      const match = html.match(/<strong>([^:]+):<\/strong>\s*(.+)/);
      if (match) {
        document.getElementById("nomeHabilidade").value = match[1];
        document.getElementById("descHabilidade").value = match[2];
      } else {
        alert("Formato inesperado para edição.");
        return;
      }
    }

    div.remove();
  };

  const divBtn = document.createElement('div');
  divBtn.classList.add("btnDiv");
  div.appendChild(contentDiv);

  divBtn.appendChild(btnEditar);
  divBtn.appendChild(btnRemover);
  div.appendChild(divBtn);

  return div;
}

// Funções para adicionar perícia, item, habilidade e magia com imagem

function adicionarPericia() {
  const texto = document.getElementById('novaPericia').value.trim();
  const base64 = document.getElementById('imagemPericiaBase64').value.trim();
  if (!texto) return;

  let html = `<img src="${base64}" style="max-width: 20%; border-radius: 6px; height: fit-content; margin-right: 5px;">`;
  if (base64){
    html += `<strong style="display: none;">Perícia:</strong>${texto}`;
  }

  document.getElementById('listaPericias').appendChild(criarCard(html));

  // Limpa campos
  document.getElementById('novaPericia').value = '';
  document.getElementById('imagemPericiaBase64').value = '';
  document.getElementById('previewPericia').src = '5663766.png';
  document.getElementById('imagemPericia').value = '';
}

function adicionarItem()
{
  const texto = document.getElementById('novoItem').value.trim();
  const base64 = document.getElementById('imagemItemBase64').value.trim();
  if (!texto) return;

  let html = `<img src="${base64}" style="max-width: 40%; border-radius: 6px; height: fit-content; margin-right: 5px;" class="">`;
  if (base64) {
    html += `<strong style="display: none;">Item:</strong>${texto}`;
  }

  document.getElementById('listaItens').appendChild(criarCard(html));

  // Limpa campos
  document.getElementById('novoItem').value = '';
  document.getElementById('imagemItemBase64').value = '';
  document.getElementById('previewItem').src = '5663766.png';
  document.getElementById('imagemItem').value = '';
}

function adicionarHabilidade() {
  const nome = document.getElementById('nomeHabilidade').value.trim();
  const desc = document.getElementById('descHabilidade').value.trim();
  if (!nome || !desc) return;

  const html = `<strong>${nome}:</strong> ${desc}`;
  document.getElementById('listaHabilidades').appendChild(criarCard(html));

  document.getElementById('nomeHabilidade').value = '';
  document.getElementById('descHabilidade').value = '';
}

function adicionarMagia() {
  const nome = document.getElementById('nomeMagia').value.trim();
  const nivel = document.getElementById('nivelMagia').value.trim();
  const execucao = document.getElementById('execucaoMagia').value.trim();
  const alcance = document.getElementById('alcanceMagia').value.trim();
  const alvo = document.getElementById('alvoMagia').value.trim();
  const duracao = document.getElementById('duracaoMagia').value.trim();
  const descricao = document.getElementById('descMagia').value.trim();
  const aprimorar = document.getElementById('aprimorarMagia').value.trim();
  const verdadeiro = document.getElementById('verdadeiroMagia').value.trim();
  const imagemBase64 = document.getElementById('imagemMagiaBase64').value.trim();
  const lista = document.getElementById('listaMagias');

  const gerarCard = (imagem = "") => {
    const textoHTML = `
      <div style="display: flex; width: 100%; flex-direction: row; flex-wrap: wrap; justify-content: space-between;">
        <h3 style="margin: 0 0 8px; font-size: 1.2em; color: #5e2b00; width: 100%;">
          ${nome} <small style="font-weight: normal;">${nivel}</small>
        </h3>
        ${imagem ? `<img src="${imagem}" style="max-width: calc(50% - 5px); border: 2px solid #5c3a0a; border-radius: 8px;">` : ""}
        <div style="width: calc(50% - 5px) !important; display: flex; flex-direction: column; justify-content: space-evenly;">
          <p><strong>Execução:</strong> ${execucao}</p>
          <p><strong>Alcance:</strong> ${alcance}</p>
          <p><strong>Alvo:</strong> ${alvo}</p>
          <p><strong>Duração:</strong> ${duracao}</p>
        </div>
        <hr>
        <p><strong>Descrição:</strong><br>${descricao}</p>
        <hr>
        <p><strong>Aprimorar:</strong><br>${aprimorar || '-'}</p>
        <hr>
        <p><strong>Verdadeiro:</strong><br>${verdadeiro || '-'}</p>
      </div>
    `;
    lista.appendChild(criarCard(textoHTML));

    // Limpa campos após adicionar
    ['nomeMagia', 'nivelMagia', 'execucaoMagia', 'alcanceMagia', 'alvoMagia', 'duracaoMagia', 'descMagia', 'aprimorarMagia', 'verdadeiroMagia', 'imagemMagiaBase64']
      .forEach(id => document.getElementById(id).value = '');
    document.getElementById('previewFotoMagia').src = "guest.png";
    document.getElementById('imagemMagia').value = "";
  };

  gerarCard(imagemBase64);
}

// Função para extrair o conteúdo dos cards da lista
function extrairCards(idLista) {
  const lista = document.getElementById(idLista);
  const cards = [];
  lista.querySelectorAll('.card-item > div:first-child').forEach(div => {
    cards.push(div.innerHTML);
  });
  return cards;
}

// Salvar ficha (substituindo localStorage pela função salvarNoDB)
function salvarFicha() {
  const dados = {
    nome: document.getElementById('nome').value,
    idade: document.getElementById('idade').value,
    classe: document.getElementById('classe').value,
    raca: document.getElementById('raca').value,
    nivel: document.getElementById('nivel').value,
    tracos: document.getElementById('tracos').value,
    historia: document.getElementById('historia').value,
    imagemHistoriaBase64: document.getElementById('imagemHistoriaBase64').value,
    imagemPersonalidadeBase64: document.getElementById('imagemPersonalidadeBase64').value,
    motivacao: document.getElementById('motivacao').value,
    imagemMotivacaoBase64: document.getElementById('imagemMotivacaoBase64').value,
    pv: document.getElementById('pv').value,
    pm: document.getElementById('pm').value,
    ca: document.getElementById('ca').value,
    esquiva: document.getElementById('esquiva').value,
    bloqueio: document.getElementById('bloqueio').value,
    deslocamento: document.getElementById('deslocamento').value,
    agilidade: document.getElementById('agilidade').value,
    carisma: document.getElementById('carisma').value,
    forca: document.getElementById('forca').value,
    inteligencia: document.getElementById('inteligencia').value,
    sabedoria: document.getElementById('sabedoria').value,
    vigor: document.getElementById('vigor').value,
    pericias: extrairCards('listaPericias'),
    itens: extrairCards('listaItens'),
    habilidades: extrairCards('listaHabilidades'),
    magias: extrairCards('listaMagias'),
    imagem: document.getElementById('previewFoto').src || ''
  };

  salvarNoDB('dados', dados).then(() => {
    alert("Ficha salva com sucesso!");
  }).catch((err) => {
    alert("Erro ao salvar ficha: " + err);
  });
}

// Carregar ficha do DB
function carregarFicha() {
  carregarDoDB('dados').then(dados => {
    if (!dados) return;

    document.getElementById('nome').value = dados.nome || '';
    document.getElementById('idade').value = dados.idade || '';
    document.getElementById('classe').value = dados.classe || '';
    document.getElementById('raca').value = dados.raca || '';
    document.getElementById('nivel').value = dados.nivel || '';
    document.getElementById('tracos').value = dados.tracos || '';
    document.getElementById('historia').value = dados.historia || '';
    document.getElementById('imagemHistoriaBase64').value = dados.imagemHistoriaBase64 || '5663766.png';
    document.getElementById('imagemPersonalidadeBase64').value = dados.imagemPersonalidadeBase64 || '5663766.png';
    document.getElementById('motivacao').value = dados.motivacao || '';
    document.getElementById('imagemMotivacaoBase64').value = dados.imagemMotivacaoBase64 || '5663766.png';
    document.getElementById('pv').value = dados.pv || '';
    document.getElementById('pm').value = dados.pm || '';
    document.getElementById('ca').value = dados.ca || '';
    document.getElementById('esquiva').value = dados.esquiva || '';
    document.getElementById('bloqueio').value = dados.bloqueio || '';
    document.getElementById('deslocamento').value = dados.deslocamento || '';
    document.getElementById('agilidade').value = dados.agilidade || '';
    document.getElementById('carisma').value = dados.carisma || '';
    document.getElementById('forca').value = dados.forca || '';
    document.getElementById('inteligencia').value = dados.inteligencia || '';
    document.getElementById('sabedoria').value = dados.sabedoria || '';
    document.getElementById('vigor').value = dados.vigor || '';

    ['listaPericias', 'listaItens', 'listaHabilidades', 'listaMagias'].forEach(idLista => {
      const lista = document.getElementById(idLista);
      lista.innerHTML = '';
      const arrayCards = dados[idLista.replace('lista', '').toLowerCase()] || [];
      arrayCards.forEach(texto => {
        lista.appendChild(criarCard(texto));
      });
    });

    // Carregar previews das imagens das áreas de texto com imagens
    document.getElementById('previewHistoria').src = dados.imagemHistoriaBase64 || '5663766.png';
    document.getElementById('previewPersonalidade').src = dados.imagemPersonalidadeBase64 || '5663766.png';
    document.getElementById('previewMotivacao').src = dados.imagemMotivacaoBase64 || '5663766.png';
    document.getElementById('previewFoto').src = dados.imagem || 'guest.png';
  }).catch(console.error);

  // Adiciona o evento de clique para expandir a imagem
  document.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
          const modal = document.getElementById('imageModal');
          const expandedImage = document.getElementById('expandedImage');
          expandedImage.src = img.src;
          modal.style.display = 'flex';
      });
  });
}

// Adiciona o evento de clique para fechar o modal
document.getElementById('imageModal').addEventListener('click', () => {
    document.getElementById('imageModal').style.display = 'none';
});

// Ao carregar página, carregar dados salvos e preencher
window.addEventListener('load', carregarFicha);

function carregarFichaDoLocalStorage() {
  const dadosString = localStorage.getItem('dados');
  if (!dadosString) {
    console.warn('Nenhuma ficha encontrada no localStorage.');
    return;
  }

  try {
    const dados = JSON.parse(dadosString);

    // Campos de texto principais
    document.getElementById('nome').value = dados.nome || '';
    document.getElementById('raca').value = dados.raca || '';
    document.getElementById('classe').value = dados.classe || '';
    document.getElementById('nivel').value = dados.nivel || '';
    document.getElementById('historia').value = dados.historia || '';
    document.getElementById('motivacao').value = dados.motivacao || '';

    // Imagens principais
    document.getElementById('previewFoto').src = dados.imagem || 'guest.png';
    document.getElementById('previewHistoria').src = dados.imagemHistoriaBase64 || '5663766.png';
    document.getElementById('previewPersonalidade').src = dados.imagemPersonalidadeBase64 || '5663766.png';
    document.getElementById('previewMotivacao').src = dados.imagemMotivacaoBase64 || '5663766.png';

    // Limpa listas antes de preencher
    document.getElementById('listaPericias').innerHTML = '';
    document.getElementById('listaItens').innerHTML = '';
    document.getElementById('listaHabilidades').innerHTML = '';
    document.getElementById('listaMagias').innerHTML = '';

    // Preenche Perícias
    if (Array.isArray(dados.pericias)) {
      dados.pericias.forEach((p) => adicionarPericia(p.nome, p.descricao, p.imagem));
    }

    // Preenche Itens
    if (Array.isArray(dados.itens)) {
      dados.itens.forEach((item) => adicionarItem(item.nome, item.descricao, item.imagem));
    }

    // Preenche Habilidades
    if (Array.isArray(dados.habilidades)) {
      dados.habilidades.forEach((h) => adicionarHabilidade(h.nome, h.descricao));
    }

    // Preenche Magias
    if (Array.isArray(dados.magias)) {
      dados.magias.forEach((m) => adicionarMagia(m.nome, m.descricao, m.imagem));
    }

    console.log('Ficha carregada e campos de edição preenchidos.');
  } catch (erro) {
    console.error('Erro ao carregar dados do localStorage:', erro);
  }
}


