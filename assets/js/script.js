let indicadorUsd = 0
let indicadorEur = 0
let indicadorBtc = 0

const mindicador = async () => {
    try {
        // Obtenemos datos de la API
        const res = await fetch("https://mindicador.cl/api")
        const data = await res.json()

        // Asignamos variables 
        indicadorUsd = data.dolar.valor
        indicadorEur = data.euro.valor
        indicadorBtc = data.bitcoin.valor

        console.log("Valores actualizados: ", { indicadorUsd, indicadorEur, indicadorBtc })
    } catch (error) {
        console.error(error)
        alert("No se logró obtener datos de la API")
    }
}

mindicador()

function calcular() {
    const num1 = parseFloat(document.querySelector("#num1").value)
    const operacion = document.querySelector("#convertir").value

    // Validamos el valor ingresado
    if (isNaN(num1)) {
        return "Error: Debes ingresar un número válido"
    }

    let resultado;

    // Realizamos cálculo según select
    switch (operacion) {
        case "dolar":
            resultado = num1 / indicadorUsd
            break
        case "euro":
            resultado = num1 / indicadorEur
            break
        case "bitcoin":
            resultado = num1 / indicadorBtc
            break
        default:
            resultado = "Error: Selecciona una operación válida"
            break
    }

    return `Resultado: ${resultado.toFixed(2)}`
}

// Agregamos evento al botón de calcular y actualizamos la gráfica
const btnCalcular = document.querySelector("#calcular")
btnCalcular.addEventListener("click", () => {
    const resultado = calcular()
    document.querySelector("#result").innerText = resultado
    renderGrafica()  
})

// gráfica segun la opción de moneda
const selectMoneda = document.querySelector("#convertir")
selectMoneda.addEventListener("change", renderGrafica)



async function getHistorialMoneda(moneda) {
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`)
        const data = await res.json();

        // Procesar datos históricos
        const labels = data.serie.slice(0, 10).map((item) => {
            const fecha = new Date(item.fecha)
            return fecha.toLocaleDateString()
        })

        const valores = data.serie.slice(0, 10).map((item) => item.valor)

        return { labels, valores }
    } catch (error) {
        alert("No se logró obtener datos históricos")
        return { labels: [], valores: [] }
    }
}

// Función para renderizar la gráfica
async function renderGrafica() {
    const moneda = document.querySelector("#convertir").value  
    const { labels, valores } = await getHistorialMoneda(moneda)

    const data = {
        labels: labels,
        datasets: [
            {
                label: `Historial de ${moneda.toUpperCase()} en CLP`,
                data: valores,
                borderColor: "#fca311",
                
            },
        ],
    }

    const config = {
        type: "line",
        data,
    }
    
    const myChartElement = document.getElementById("myChart")
    myChartElement.style.backgroundColor = "white"
    
    // Destruye la gráfica anterior si es q hay
    if (window.myChartInstance) {
        window.myChartInstance.destroy()
    }
    
    // Crea nueva gráfica
    window.myChartInstance = new Chart(myChartElement, config)
}

renderGrafica()  
