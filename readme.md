# Fractal Simulator

Um fractal é uma figura geométrica cujas partes, quando observadas em diferentes escalas, apresentam a mesma estrutura do todo. Essa característica é conhecida como auto-semelhança, ou seja, cada parte do fractal é uma miniatura do todo. A palavra "fractal" vem do latim "fractus", que significa "quebrado" ou "fraccionado", indicando a estrutura irregular e fragmentada desses objetos. 

O termo, criado em 1975 por Benoît Mandelbrot, é uma tentativa de se medir o tamanho de objetos para os quais as definições tradicionais da geometria euclidiana falham.

---

# Simulação Árvore Fractal

***Desenho Fractal***
A árvore é gerada recursivamente. Cada galho pode dar origem a novos galhos, com ângulos e comprimentos progressivamente menores.

## Controles Interativos

***Ângulo***
Permite ajustar o ângulo de ramificação entre os galhos.

***Profundidade***
Controla o nível de detalhe/recursão da árvore. Valores mais altos criam árvores mais complexas.

***Fator de Comprimento***
Determina o quão mais curtos os novos galhos são em relação ao galho pai.

***Largura Inicial***
Define a espessura do tronco.

***Cor dos Galhos e Folhas***
Seletores de cor para personalizar a aparência.

***Botão "Gerar Nova Árvore"***
Redesenha a árvore com os parâmetros atuais (e alguma aleatoriedade para variar a forma).

***Aparência Natural***
Uma pequena aleatoriedade é adicionada aos ângulos e comprimentos para que cada árvore gerada seja ligeiramente diferente, imitando a variabilidade natural. "Folhas" simples (pequenos círculos) são adicionadas nas pontas dos galhos mais finos.

***Responsividade***
O canvas tenta ajustar-se ao tamanho da janela, mantendo uma proporção razoável.

---

# Simulação Conjunto de Madelbrot

## Como funciona o algoritmo de Mandelbrot?

Para cada pixel no canvas, ele é mapeado para um número complexo **c**. 

Então, a seguinte iteração é realizada: **z_novo = z_antigo² + c**, começando com **z = 0**. 

Se o valor absoluto de **z** permanecer pequeno (normalmente abaixo de 2) após um certo número de iterações, o ponto **c** pertence ao Conjunto de Mandelbrot (e é geralmente colorido de preto). Caso contrário, ele "escapa" para o infinito, e a cor é determinada pelo quão rápido ele escapa.

**Controles**

***Iterações***
Um slider para definir o número máximo de iterações para o cálculo. Mais iterações resultam em mais detalhes, mas levam mais tempo para renderizar.

***Zoom***
Cmpo numérico para definir o nível de zoom. O limite máximo da ampliação é de **140.737.488.355.328** (cento e quarenta trilhões, setecentos e trinta e sete bilhões, quatrocentos e oitenta e oito milhões, trezentos e cinquenta e cinco mil, trezentos e vinte e oito) vezes a imagem do vetor inicial.

***Esquema de Cores***
Seleção para diferentes aparências visuais.

***Botão "Renderizar"***
Aplica alterações de iterações e zoom.

***Botão "Resetar Zoom"***
Volta à visualização inicial.

***Funcionalidade de Zoom***
Clicar no canvas irá dar zoom no ponto clicado, recentralizando a visualização.

***Indicador de Carregamento***
Mostra uma mensagem enquanto o fractal está a ser renderizado.

***Design Responsivo***
O canvas tenta ajustar-se ao tamanho da janela.
