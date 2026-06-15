# 🐍 Snake Game

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Stack](https://img.shields.io/badge/Feito%20com-React%20%2B%20TypeScript%20%2B%20CSS-blue)

---

## 🧠 Sobre o projeto

Projeto desenvolvido como uma recriação moderna do clássico **Jogo da Cobrinha**, com melhorias visuais, progressão por fases, efeitos sonoros e uma interface em estilo **arcade neon**.

O objetivo é controlar a cobrinha, coletar comidas, acumular pontos, crescer ao longo da partida e sobreviver sem colidir contra as paredes, obstáculos ou o próprio corpo.

O jogo conta com **20 fases**, seleção livre de níveis, feedback sonoro, controles para desktop e dispositivos móveis, além de uma experiência responsiva pensada para diferentes telas.

🔗 **Jogo disponível aqui:**  
https://thiago-pereira79.github.io/snake-game/

---

## 🚀 O que foi aprimorado em relação ao jogo clássico

| Recurso | Descrição |
|---------|-----------|
| 🐍 Progressão por fases | 20 fases com metas, velocidades e dificuldades progressivas |
| 🎮 Seleção de fases | O jogador pode escolher qualquer fase diretamente |
| 🧱 Obstáculos | Fases avançadas contam com obstáculos internos no tabuleiro |
| 🍎 Comidas especiais | Itens com efeitos diferentes durante a partida |
| 🔊 Efeitos sonoros | Sons para comidas, botões, Game Over, fase concluída e vitória |
| 📱 Responsividade | Funciona em desktop, notebook e dispositivos móveis no modo vertical |
| 🔄 Orientação mobile | Em celulares/tablets na horizontal, o jogo orienta o usuário a voltar para vertical |
| 🎯 UX/UI refinada | Interface limpa, botões claros, feedback visual e estados bem definidos |
| 🧩 Estados de jogo | Menu, seleção de fase, partida, pausa, Game Over, fase concluída e vitória final |

---

## 🎮 Como jogar

### Desktop / Notebook

Use as teclas direcionais:

- `↑` para subir
- `↓` para descer
- `←` para ir para esquerda
- `→` para ir para direita

Também é possível jogar com:

- `W` para subir
- `S` para descer
- `A` para esquerda
- `D` para direita

### Celular, Tablet e iPad

O jogo foi pensado para funcionar em **modo vertical**.

Nos dispositivos móveis, é possível controlar a cobrinha usando:

- botões direcionais na tela;
- gestos/swipe no tabuleiro, se disponível.

Ao virar o dispositivo para o modo horizontal, o jogo exibe uma orientação para voltar ao modo vertical, garantindo uma experiência mais confortável e consistente.

---

## 🕹️ Modos de jogo

### ⭐ Jogar Fases

Inicia a jornada a partir da **fase 1**, com progressão até a **fase 20**.

A cada fase, o desafio aumenta por meio de:

- metas maiores;
- velocidade progressiva;
- obstáculos;
- comidas especiais;
- maior exigência de controle e atenção.

### 🔲 Escolher Fase

Permite jogar qualquer fase diretamente, sem precisar seguir a progressão linear.

Essa opção oferece mais liberdade ao jogador e facilita o teste das fases.

---

## 🛠️ Conceitos explorados

- Manipulação de estados com **React**
- Componentização com **TypeScript**
- Estilização com **CSS**
- Lógica de movimentação em grid
- Detecção de colisão
- Game loop
- Controle de fases e dificuldade progressiva
- Feedback sonoro com **Web Audio API**
- Responsividade mobile-first
- Controle por teclado e toque
- Bloqueio de experiência em orientação horizontal mobile
- Organização de estrutura para assets futuros
- Deploy com **GitHub Pages**

---

## 🧰 Ferramentas utilizadas

| Etapa | Ferramenta | Finalidade |
|-------|------------|------------|
| Desenvolvimento | React + TypeScript | Estrutura principal do jogo |
| Build | Vite | Ambiente rápido de desenvolvimento |
| Estilo | CSS | Layout, responsividade e identidade visual |
| Áudio | Web Audio API | Efeitos sonoros gerados por código |
| Versionamento | Git & GitHub | Controle de versão e publicação |
| Deploy | GitHub Pages | Hospedagem do projeto |

---

## 📁 Estrutura do projeto

```text
snake-game/
│
├── assets/
│   ├── backgrounds/
│   │   └── .gitkeep
│   ├── food/
│   │   └── .gitkeep
│   ├── obstacles/
│   │   └── .gitkeep
│   └── snake/
│       └── .gitkeep
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── script.js
├── style.css
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Identidade visual

O jogo segue uma estética **arcade neon**, com:

- fundo escuro;
- tons de verde e ciano;
- botões com brilho sutil;
- contraste forte;
- interface minimalista;
- foco em clareza, controle e fluidez.

A interface foi pensada para reduzir carga cognitiva e permitir que o jogador entenda rapidamente como iniciar, escolher fases e jogar.

---

## 🔊 Sistema de áudio

Os sons foram criados com **Web Audio API**, sem arquivos externos.

O jogo possui efeitos para:

- coleta de comida normal;
- coleta de comidas especiais;
- Game Over;
- fase concluída;
- vitória final;
- cliques em botões.

Não há música de fundo contínua, evitando cansaço auditivo e mantendo os feedbacks sonoros mais claros durante a jogabilidade.

---

## 📱 Responsividade

O jogo foi validado para:

- desktop;
- notebook;
- telas grandes;
- celulares no modo vertical;
- tablets no modo vertical;
- iPad no modo vertical.

Em dispositivos móveis no modo horizontal, a experiência é bloqueada com uma mensagem de orientação, pois o jogo foi otimizado para uma experiência mais confortável no modo vertical.

---

## 🧩 Próximas melhorias possíveis

- Sistema de ranking local
- Novas skins para a cobra
- Temas visuais desbloqueáveis
- Modo infinito clássico
- Mais tipos de comida especial
- Animações extras entre fases
- Melhorias visuais usando sprites personalizados

---

## 📄 Licença

Este projeto está sob a licença **MIT** - sinta-se livre para estudar, adaptar ou evoluir.

---

💻 Desenvolvido por **Thiago Pereira**