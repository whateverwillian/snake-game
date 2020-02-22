window.onload = () => {

    // trazendo elementos da DOM
    var stage = document.getElementById('stage')
    var context = stage.getContext('2d')


    // o top 3 vai permanecer o mesmo até que a página seja reiniciada, ent deve estar no escopo "global"
    top = [
        { nickname: '', highscore: '' },
        { nickname: '', highscore: '' },
        { nickname: '', highscore: '' }
    ]

    // init() // iniciando o jogo
    var difficulty = 80; // Adicionar velocidade, algum dia
    setInterval(render, difficulty) // renderiza o jogo


    // Inicializando os eventListeners
    document.getElementById('new__game').addEventListener('click', init)
    document.getElementById('change__color').addEventListener('click', changeColor)
    document.addEventListener('keydown', move)
    document.getElementById('change__difficulty').addEventListener('click', () => {
        if (gameOn) {
            alert('the game is already running.')
        } else if (difficulty >= 40) {
            // alert('Life already is, take it easy')
            difficulty -= 10
            if (difficulty === 70) {
                document.getElementById('change__difficulty').textContent = 'normal'
            } else if (difficulty === 60) {
                document.getElementById('change__difficulty').textContent = 'hard'
            } else if (difficulty === 50) {
                document.getElementById('change__difficulty').textContent = 'hardcore'
            } else if (difficulty === 40) {
                document.getElementById('change__difficulty').textContent = 'oh jesus'
            } else {
                document.getElementById('change__difficulty').textContent = 'easy'
                difficulty = 80
            }

        }
    })

    var size, camp, point, speed, apple, tail, colors, colorIndex, actualSpeed, gameOn, top;

    // init()

    // Função que faz os movimentos
    function move(event) {

        // Caso estiver em GameOver, essa função não deve funcionar
        if (gameOn !== true) {
            console.log('Game Over porra')
            return false
        }

        var movement = event.key
        if ((movement === 'w' || movement === 'ArrowUp') && actualSpeed !== 'down') {
            // Cima
            speed.x = 0
            speed.y = -1
            actualSpeed = 'up'

        } else if ((movement === 'a' || movement === 'ArrowLeft') && actualSpeed !== 'right') {
            // Esquerda
            speed.x = -1
            speed.y = 0
            actualSpeed = 'left'

        } else if ((movement === 's' || movement === "ArrowDown") && actualSpeed !== 'up') {
            // Baixo
            speed.x = 0
            speed.y = 1
            actualSpeed = 'down'

        } else if ((movement === 'd' || movement === "ArrowRight") && actualSpeed !== 'left') {
            // Direita
            speed.x = 1
            speed.y = 0
            actualSpeed = 'right'

        }
    }

    function render() {

        // a cada chamada, é somada à posição, para que o movimento seja feito
        // quando a direção não é mudada, a cobra continua incrementando naquela direção
        point.x += speed.x
        point.y += speed.y

        // Agora temos de nos certificar de que a cobra não vai sair do mapa
        // E sim percorrer um loop infinito ao chegar às extremidades...
        if (point.x < 0) {
            point.x = camp - 1
        } else if (point.x > camp - 1) {
            point.x = 0
        } else if (point.y < 0) {
            point.y = camp - 1
        } else if (point.y > camp - 1) {
            point.y = 0
        }

        // 1. renderizando o campo
        context.fillStyle = "white"
        context.fillRect(0, 0, stage.width, stage.height)

        // 2. renderiza a maçã
        context.fillStyle = "rgb(160, 5, 5)"
        context.fillRect(apple.x * size, apple.y * size, size, size)

        // 3. renderizando o player
        context.fillStyle = playerColor
        for (var i = 0; i < tail.element.length; i++) {
            context.fillRect(tail.element[i].x * size, tail.element[i].y * size, size, size)
            if (tail.element[i].x === point.x && tail.element[i].y === point.y && tail.size > 1) {
                gameOver()
            }
        }


        // Caso a maçã seja comida
        if (point.x === apple.x && point.y === apple.y) {
            apple.x = Math.round(Math.random() * 39)
            apple.y = Math.round(Math.random() * 39)
            tail.size++
        }

        // Vai mantendo o tamanho correto da cobra
        tail.element.push({ x: point.x, y: point.y })
        while (tail.element.length > tail.size) {
            tail.element.shift()
        }



    }

    // Iniciando um novo jogo
    function init() {

        // the game is on
        gameOn = true

        // Inicializa a cobrinha na cor padrão
        playerColor = "rgb(29, 29, 29)"

        // camp é o número de quadrados no campo
        // size é o tamanho da peça neste "tabuleiro"
        camp = 40;
        size = 10;

        // Objeto que guarda a posição no eixo X Y
        point = {
            x: 1,
            y: 1
        }

        // As velocidades serão sempre 0 ou 1
        // Para informar a direção no eixo X Y
        speed = {
            x: 0,
            y: 0
        }

        apple = {
            x: 15,
            y: 10
        }

        // Guardando na variávei "cauda" o tamanho dela e as posições X Y
        tail = {
            size: 1,
            element: []
        }

        // Guardando as três primeiras pontuações
        var contadorTop = 0

        colorIndex = 0

    }

    // Função que zera a velocidade e tranca a movimentação
    function gameOver() {
        // Chamando a função que calcula os highscores
        highscore(tail.size * 100)
        speed.x = speed.y = 0
    }

    // Trocando a cor da cobrinha
    function changeColor() {
        colors = ['rgb(29, 29, 29)', 'green', 'blue', 'yellow', 'red', 'orange', 'purple', 'pink', 'lilac']
        // Porque o último não é contado
        if (colorIndex < colors.length - 1) {
            colorIndex++
            playerColor = colors[colorIndex]
        } else {
            colorIndex = 0
            playerColor = colors[colorIndex]
        }
    }

    // Função que faz a verificação e mantém as três maiores pontuações (very very ugly code, btw)
    function highscore(highscore) {
        var nickname = document.getElementById('nickname').value

        if (gameOn === true) {
            // 1. Vamos inserir o highscore no array top 3
            top.push({ highscore: highscore, nickname: nickname })

            // 2. Ordenar o array com bubbleSort mesmo
            var ordenado, contador

            ordenado = false
            contador = 0

            while (ordenado === false) {
                for (i = 0; i < top.length - 1; i++) {
                    if (top[i].highscore <= top[i + 1].highscore) {
                        contador += 1;
                    } else {
                        var aux = top[i];
                        top[i] = top[i + 1];
                        top[i + 1] = aux;
                    }
                }

                if (contador === top.length - 1) {
                    ordenado = true;
                } else {
                    contador = 0;
                }
            }

            gameOn = false

            // 3. Atualizar os itens na UI

            // Toda vez que nós empurramos um novo highscore, as três maiores pontuações ficam no fim do array
            document.getElementById('one').
                textContent = `1. ${top[top.length - 1].nickname} ${top[top.length - 1].highscore}`
            document.getElementById('two').
                textContent = `2. ${top[top.length - 2].nickname} ${top[top.length - 2].highscore}`
            document.getElementById('three').
                textContent = `3. ${top[top.length - 3].nickname} ${top[top.length - 3].highscore}`
        }
    }
}