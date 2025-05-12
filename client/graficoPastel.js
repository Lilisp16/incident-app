$(document).ready(function(){
  getIncidencias(); // Llamar a obtener todas las incidencias al cargar
  obtenerDatosGrafico(); // Actualizar el gráfico al inicio
});

// Esta función obtiene las incidencias de la API
function obtenerDatosGrafico() {
  $.ajax({
      type: "GET",
      url: "https://api-rest-fs.onrender.com/api/getIncidents",
      success: function(data){
          var leve = 0;
          var media = 0;
          var grave = 0;

          // Contamos las incidencias por severidad
          $.each(data, function(index, incidencia) {
              if (incidencia.severity === 'leve') {
                  leve++;
              } else if (incidencia.severity === 'media') {
                  media++;
              } else if (incidencia.severity === 'grave') {
                  grave++;
              }
          });

          // Actualizamos el gráfico con los datos obtenidos
          actualizarGrafico(leve, media, grave);
      }
  });
}

// Función para actualizar el gráfico con las incidencias filtradas
function actualizarGrafico(leve, media, grave) {
  var ctx = document.getElementById('myPieChart').getContext('2d');
  var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: ['Leve', 'Media', 'Grave'],
          datasets: [{
              label: 'Incidencias por Severidad',
              data: [leve, media, grave],
              backgroundColor: ['#2c8793', '#e38418', '#dc3545'],
              hoverOffset: 4,
              borderWidth: 2,
              borderColor: '#fff'
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'left',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return tooltipItem.raw + ' Incidencias';
                      }
                  }
              }
          },
          aspectRatio: 2 // Esto hace que el gráfico sea más pequeño en relación a su contenedor
      }
  });
}

// Filtrar las incidencias por severidad seleccionada desde el gráfico
function filtrarSeveridad(severity){
  $.ajax({
      type: "GET",
      url: "https://api-rest-fs.onrender.com/api/getIncidentsBySeverity?severity="+severity,
      success: function(data){
          // Filtramos las incidencias
          mostrarIncidencias(data);

          // Luego contamos las incidencias por severidad para actualizar el gráfico
          var leve = 0;
          var media = 0;
          var grave = 0;
          $.each(data, function(index, incidencia) {
              if (incidencia.severity === 'leve') {
                  leve++;
              } else if (incidencia.severity === 'media') {
                  media++;
              } else if (incidencia.severity === 'grave') {
                  grave++;
              }
          });

          // Actualizamos el gráfico con los datos filtrados
          actualizarGrafico(leve, media, grave);
      }
  });
}

// Función que maneja el filtrado de las incidencias por estado (completadas o no)
function filtrarEstado(completed) {
  $.ajax({
      type: "GET",
      url: "https://api-rest-fs.onrender.com/api/getIncidentsByState?completed=" + completed,
      success: function(data) {
          mostrarIncidencias(data); // Mostrar las incidencias filtradas
      }
  });
}

// Función para mostrar las incidencias en la tabla
function mostrarIncidencias(incidencias){
  let contenido = "";

  if (incidencias.length > 0){
      $.each(incidencias, function(index, incidencia){
          contenido += '<tr';
          if (incidencia.completed) {
              contenido += ' style="background-color:lightskyblue">';
          } else {
              contenido += ' style="background-color:lightyellow">';
          }

          contenido += '<td>' + incidencia._id + '</td>'
                     + '<td>' + incidencia.title + '</td>'
                     + '<td>' + incidencia.description + '</td>'
                     + '<td>' + incidencia.user + '</td>'
                     + '<td>' + incidencia.severity + '</td>'
          if (incidencia.completed) {
              contenido += '<td>SI</td>';
          } else {
              contenido += '<td>NO</td>';
          }

          let date = new Date(incidencia.create_at);
          contenido += '<td>' + date.toLocaleDateString()+" "+date.toLocaleTimeString()+ '</td>';

          contenido += '<td><button onclick="cambiarEstado(\''+incidencia._id+'\',' + incidencia.completed + ')" class="btn btn-custom2">';
          if (incidencia.completed){
              contenido += 'Descompletar</button></td>';
          } else {
              contenido += 'Completar</button></td>';
          }
          contenido += '<td><button onclick="eliminar(\''+ incidencia._id + '\');" class="btn btn-custom">Eliminar</td>';
          contenido += '</tr>';
      });
      $("#incident-tbody").html(contenido);
  }
}

// Cambiar el estado de la incidencia entre completado o no completado
function cambiarEstado(id, completed){
  $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
          "id": id,
          "completed": !completed
      }),
      url: "https://api-rest-fs.onrender.com/api/updateIncident",
      success: function(){
          getIncidencias(); // Volver a obtener las incidencias
      }
  })
}

// Eliminar una incidencia
function eliminar(id){
  $.ajax({
      type: "DELETE",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
          "id": id
      }),
      url: "https://api-rest-fs.onrender.com/api/deleteIncident",
      success: function(data){
          getIncidencias(); // Volver a obtener las incidencias
      }
  })
}
