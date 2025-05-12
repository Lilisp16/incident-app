$(document).ready(function() {
    // Realiza una solicitud GET para obtener todas las incidencias
    $.get("https://api-rest-fs.onrender.com/api/getIncidents", function(data) {
        
        // Actualiza el total de incidencias
        $('#total-incidencias').text(data.length);

        // Filtra las incidencias completadas
        const completadas = data.filter(incidencia => incidencia.completed).length;
        $('#completadas').text(completadas);

        // Filtra las incidencias incompletas
        const incompletas = data.filter(incidencia => !incidencia.completed).length;
        $('#incompletas').text(incompletas);

        // Llenar la tabla de incidencias
        let tbodyContent = '';
        data.forEach(incidencia => {
            tbodyContent += `
                <tr>
                    <td>${incidencia._id}</td>
                    <td>${incidencia.title}</td>
                    <td>${incidencia.description}</td>
                    <td>${incidencia.user}</td>
                    <td>${incidencia.severity}</td>
                    <td>${incidencia.completed ? 'Completada' : 'Incompleta'}</td>
                    <td>${new Date(incidencia.createdAt).toLocaleString()}</td>
                    <td><button class="btn btn-warning">Editar</button></td>
                    <td><button class="btn btn-danger">Eliminar</button></td>
                </tr>
            `;
        });
        // Agrega el contenido generado en la tabla
        $('#incident-tbody').html(tbodyContent);









           // Ya no se necesita volver a declarar incompletas
        // Usamos la variable incompletas calculada antes

           
        // Configuración del gráfico
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico
            data: {
                labels: ['Completadas', 'Incompletas'], // Etiquetas del gráfico
                datasets: [{
                    label: 'Número de Incidencias',
                    data: [completadas, incompletas], // Datos para cada barra
                    backgroundColor: ['#39FF14', '#FF073A'], // Colores de las barras
                    borderColor: ['#32CD32', '#FF0000'], // Bordes de las barras
                    borderWidth: 2, // Bordes más gruesos para mayor contraste
                    barThickness: 20, // Grosor de las barras (ajustado para simular cilindro)
                    hoverBackgroundColor: ['#32CD32', '#FF6347'], // Colores al pasar el ratón
                    hoverBorderColor: ['#228B22', '#FF4500'],
                    borderRadius: 10, // Bordes redondeados para simular cilindro
                    shadowOffsetX: 5, // Sombra en el eje X
                    shadowOffsetY: 5, // Sombra en el eje Y
                    shadowBlur: 10, // Desenfoque de la sombra
                    shadowColor: 'rgba(0, 0, 0, 0.3)' // Color de la sombra
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        barPercentage: 0.6, // Controla el espacio entre las barras
                        categoryPercentage: 0.4, // Controla el espacio entre categorías
                        grid: {
                            display: false // Quitar la rejilla en el eje X
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1, // Ajustar el tamaño de los pasos del eje Y
                            font: {
                                size: 14, // Tamaño de fuente de las etiquetas en el eje Y
                                family: 'Arial, sans-serif', // Tipografía
                                weight: 'bold' // Peso de la fuente para mayor contraste
                            }
                        },
                        grid: {
                            borderColor: '#ddd', // Color de las líneas de la rejilla
                            borderWidth: 1, // Grosor de las líneas de la rejilla
                            color: '#941ad0' // Color de fondo de la rejilla #f0f0f0
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top', // Colocamos la leyenda en la parte superior
                        labels: {
                            font: {
                                size: 16, // Tamaño de la fuente de la leyenda
                                family: 'Arial, sans-serif',
                                weight: 'bold'
                            },
                            padding: 20 // Espacio entre los ítems de la leyenda
                        }
                    },
                    tooltip: {
                        backgroundColor: '#333', // Color de fondo del tooltip
                        titleColor: '#fff', // Color del título del tooltip
                        bodyColor: '#fff', // Color del cuerpo del tooltip
                        padding: 10, // Espacio dentro del tooltip
                        cornerRadius: 10 // Bordes redondeados del tooltip
                    }
                },
                animation: {
                    duration: 1000, // Duración de la animación al cargar
                    easing: 'easeInOutQuad' // Tipo de animación
                }
            }
        });

      
    });
});
