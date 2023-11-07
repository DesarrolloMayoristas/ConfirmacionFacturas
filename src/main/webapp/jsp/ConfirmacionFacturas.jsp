
<%@ page language="java"%>   
<%@ page import="java.util.LinkedList"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>   
<html>     
	<head>   
	
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
		
		<title>Confirmacion Facturas</title>
		<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
<meta name="viewport" content="width=device-width, initial-scale=1">   
<!-- 		<script  type="text/javascript" src="js/jquery-ui.min.js"></script>  --> 
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
		<script type="text/javascript" src="js/jquery.js"></script> 
<!-- 		<script  type="text/javascript" src="js/bootstrap.min.js"></script>    -->   
		
		<!--  CSS BOOTSTRAP  y JQUERY-->
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.10.3.custom.css">
		 <!-- Compiled and minified CSS -->    

              
		
		
		<!--  JS PERSONALIZADO Y JQUERY -->
		<script  type="text/javascript" src="js/jsGeneral.js"></script>
		<script  type="text/javascript"   charset="UTF-8"    src="js/jsConfirmacionFacturas.js"></script>
		<script  type="text/javascript" src="js/jsConfirmacionFacturasCredito.js"></script>
		<script  type="text/javascript" src="js/jsConfirmacionFacturasEncargado.js"></script>
		<script  type="text/javascript" src="js/jsMonitor.js"></script>   
		<script  type="text/javascript" src="js/jsGenera.js"></script>
		<script  type="text/javascript" src="js/jsConfirma.js"></script>       
		<script  type="text/javascript" src="js/jquery.min.js"></script>   
		<script  type="text/javascript" src="js/jsjquery.min.js"></script>
		
		<!--  JS JSGRID -->
		<link rel='stylesheet prefetch' href="css/jsgrid.min.css"/>       
	    <link rel='stylesheet prefetch' href="css/jsgrid-theme.min.css"/> 	
	    <script type="text/javascript" src="js/jsgrid.js"></script> 
	    <script type="text/javascript" src="js/jsgrid.min.js"></script> 
		
		<!--  JS BOOTSTRAP -->
		<script  type="text/javascript" src="js/bootstrap.js"></script> 
<script src="https://kit.fontawesome.com/5662b2d6bd.js" crossorigin="anonymous"></script>
<script  type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.dataTables.min.js"></script>
<script  type="text/javascript" src="${pageContext.request.contextPath}/js/dataTables.bootstrap4.min.js"></script> 		
		<link rel="stylesheet" type="text/css" href="css/EstilosGenerales.css">
		<link rel="stylesheet" type="text/css" href="css/Menu.css"> 
		<!--  CSS y JS CALENDARIO -->
		 <link rel="stylesheet" href="css/jquery-ui.css"/> 
		 <script src="js/jquery-ui.js"></script>
		 <link rel="shortcut icon" href="#">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment.min.js"></script>
           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">  
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script  type="text/javascript" src="js/sha1.js"></script> 
    <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/es.js"></script>
          
		<script type="text/javascript">
		      
		$(function() {
// 			$("#txtFechaIniConfirma").datepicker();         
// 			$('#txtFechaIniConfirma').val(ObtenerFechaActual());  
			
			$('input[name="exampleRadios"]').click(function() {
				  $("#txtFolio").val("");
				});    
			$("#txtFolio").on("input", function() {
				  $('input[name="exampleRadios"]').prop("checked", false);
				});
			$("#txtClienteF").on("input", function() {
				  $("#txtAvF").val("");
				});
			$("#txtAvF").on("input", function() {
				  $("#txtClienteF").val("");     
				});
			
			
	
			$("#txt_fechaIni").datepicker();
			$("#txt_fechaFin").datepicker(); 
			$('#txt_fechaIni').val(ObtenerFechaActual());
			$('#txt_fechaFin').val(ObtenerFechaActual());
			
			$("#txt_fechaInig").datepicker();
			$("#txt_fechaFing").datepicker(); 
			$('#txt_fechaInig').val(ObtenerFechaActual());
			$('#txt_fechaFing').val(ObtenerFechaActual());
			
			$("#txtFechaIniF").datepicker();
			$("#txtFechaFinF").datepicker(); 
			$('#txtFechaIniF').val(ObtenerFechaActual());
			$('#txtFechaFinF').val(ObtenerFechaActual());   
			
		});
	
		$(document).ready(function() {
			  $("#txtFechaIniConfirma").datepicker({
			    minDate: 0,
			    dateFormat: "dd/mm/yy",
			    onSelect: function(dateText, inst) {
			      // Convierte la fecha al formato "mm/dd/yy"
			      var parts = dateText.split("/");
			      var formattedDate = parts[1] + "/" + parts[0] + "/" + parts[2];

			      // Crea un objeto Date con la zona horaria de Ciudad de México
			      var selectedDate = new Date(formattedDate);
			      selectedDate.toLocaleString("en-US", {timeZone: "America/Mexico_City"});
		 	      var currentDate = new Date();
		 	      $("#dangerDetalleCreditoConfirma").hide()

			      if (selectedDate < currentDate) 
			      {
			        $("#dangerDetalleCreditoConfirma").show();
			        $("#dangerDetalleCreditoLbConfirma").text("Debe seleccionar una fecha mayor al dia actual") 
				    $("#txtFechaIniConfirma").val("");
			        $("#btnRegresarFolioCreditoConfirma").hide()  
			      }
			      else
		    	  {
			    	  $("#dangerDetalleCreditoConfirma").hide()
			    	  $("#btnRegresarFolioCreditoConfirma").show()
		    	  }
			    }
			  });

			  $('#txtFechaIniConfirma').val("");    
			});


		
		function inicializarDatepickers() {
			  $(".datepicker-input").datepicker({
			    minDate: 0,
			    dateFormat: "dd/mm/yy",
			    onSelect: function(dateText, inst) {
			      // Resto del código del datepicker
			    }
			  });
			}

			$(document).ready(function() {
			  $('#txtFechaIniConfirma').val("");
			});

			$(document).on("click", "#tuBoton", function() {
			  inicializarDatepickers();
			});
		

			function ObtenerFechaActual() {
			  var fecha = new Date();
			  let dia = String(fecha.getDate()).padStart(2, '0');
			  let mes = String(fecha.getMonth() + 1).padStart(2, '0');
			  let year = fecha.getFullYear();
			  fecha = dia + '/' + mes + '/' + year;
			  return fecha;
			}        
		function ObtenerFechaActual()
		{
			var fecha = new Date();
			let dia = String(fecha.getDate()).padStart(2, '0');
			let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
			let year = fecha.getFullYear();
			fecha = dia + '/' + mes + '/' + year;
			return fecha;
		} 
			$(function () {
			    $(document).keydown(function (e) {
			        return (e.which || e.keyCode) != 116;
			    });
			});
			
			
			function aplicarEstiloTablaConfirmacionFacturasCreditoEncargado() 
			{ 
				$('#divTableMonitor').empty();
				$('#customBodyMonitor').empty();
				$('#divFilterMonitor').empty();    
  
				$('#tb_articulosDetalleCreditoEncargado').DataTable( {
					ordering: false,   
				paging: true, 
				"pageLength": 14,   
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyCreditoEncargado');      
				    } 
					} );
				$("#divFilterCreditoEncargado").append("<input id='myInputCreditoEncargado' type='text' placeholder='Filtrar...'>");     	
				var table = $('#tb_articulosDetalleCreditoEncargado').DataTable();
				var pageInfo = table.page.info();
// 				$("#titleCreditoEncargado").text("FACTURAS DISPONIBLES: "+pageInfo.recordsTotal+ " DEL ENCARGADO " + $("#usrCredito").val())
				$("#lblCreditoEncargado").text($("#usrCredito").val()) 
				$('#myInputCreditoEncargado').on( 'keyup', function () {
				    table.search( this.value ).draw();
				} );
			}
			
	
			function aplicarEstiloTablaConfirmacionFacturasCreditoConfirma()          
			{ 
				$('#divTableMonitor').empty();
				$('#customBodyMonitor').empty();
				$('#divFilterMonitor').empty();    
  
				$('#tb_articulosDetalleCreditoConfirma').DataTable( {
					ordering: false,   
				paging: true, 
				"pageLength": 20,           
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyCreditoConfirma');      
				    } 
					} );
				$("#divFilterCreditoConfirma").append("<input id='myInputCreditoConfirma' type='text' placeholder='Filtrar...'>");     	
				var table = $('#tb_articulosDetalleCreditoConfirma').DataTable();
				var pageInfo = table.page.info();
 				$("#titleCreditoConfirma").text("FACTURAS DISPONIBLES: "+pageInfo.recordsTotal  )   
// 				$("#lblCreditoGenera").text($("#usrCredito").val())    
				$('#myInputCreditoConfirma').on( 'keyup', function () {
				    table.search( this.value ).draw();
				} );
			}
			
			function aplicarEstiloTablaConfirmacionFacturasCreditoGenera() 
			{ 
				$('#divTableMonitor').empty();
				$('#customBodyMonitor').empty();
				$('#divFilterMonitor').empty();    
  
				$('#tb_articulosDetalleCreditoGenera').DataTable( {
					ordering: false,   
				paging: true, 
				"pageLength": 20,      
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyCreditoGenera');      
				    } 
					} );
				$("#divFilterCreditoGenera").append("<input id='myInputCreditoGenera' type='text' placeholder='Filtrar...'>");     	
				var table = $('#tb_articulosDetalleCreditoGenera').DataTable();
				var pageInfo = table.page.info();
 				$("#titleCreditoGenera").text("FACTURAS DISPONIBLES: "+pageInfo.recordsTotal  )   
// 				$("#lblCreditoGenera").text($("#usrCredito").val())    
				$('#myInputCreditoGenera').on( 'keyup', function () {
				    table.search( this.value ).draw();
				} );
			}
			
			
			function aplicarEstiloTablaConfirmacionFacturasCredito() 
			{ 
				$("#divTableCortesPendientes").empty()    
				$('#divTableFacturas').empty();
				$('#customBody').empty();
				$('#divFilter').empty();    
				$('#divTableMonitor').empty();
				$('#customBodyMonitor').empty();
				$('#divFilterMonitor').empty();    

				$('#tb_articulosDetalleCredito').DataTable( {
					ordering: false,   
				paging: true, 
				"pageLength": 14,   
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyCredito');      
				    } 
					} );
				$("#divFilterCredito").append("<input id='myInputCredito' type='text' placeholder='Filtrar...'>");     	
				var table = $('#tb_articulosDetalleCredito').DataTable();  
				var pageInfo = table.page.info();
				$("#titleCredito").text("FACTURAS DISPONIBLES: "+pageInfo.recordsTotal)
				$('#myInputCredito').on( 'keyup', function () {
				    table.search( this.value ).draw();    
				} );
			}
			
			function aplicarEstiloTablaConfirmacionFacturas() 
			{ 
				$('#divTableFacturasCredito').empty();
				$('#customBodyCredito').empty();
				$('#divFilterCredito').empty();
				
				
				$('#divTableMonitor').empty();
				$('#customBodyMonitor').empty();
				$('#divFilterMonitor').empty();    

				$('#tb_articulosDetalle').DataTable( {
					ordering: false,   
				paging: true, 
				"pageLength": 19,    
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBody');      
				    } 
					} );
				$("#divFilter").append("<input id='myInput' type='text' placeholder='Filtrar...'>");     	
				var table = $('#tb_articulosDetalle').DataTable();
				var pageInfo = table.page.info();
				$("#titleAlmacen").text("FACTURAS DISPONIBLES: "+pageInfo.recordsTotal)  
				$('#myInput').on( 'keyup', function () {
					       
				    table.search( this.value ).draw();
				} );
			}
			
			function aplicarEstiloTablaConfirmacionFacturasPrevio() 
			{ 
				console.log("3")
				$('#divFilterPrevio').empty(); 
				$('#tb_articulosDetallePrevio').DataTable( {
					ordering: false,   
				paging: false, 
// 				"pageLength": 19,    
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",    
					    "sLoadingRecords": "Cargando...",
					    
				    }
// 					initComplete: function(settings, json){
// 						$('.dataTables_paginate').appendTo('#customBody');      
// 				    } 
					} );
				console.log("4")
				$("#divFilterPrevio").append("<input id='myInputPrevio' type='text' placeholder='Filtrar...' value=''>");      	
				var table = $('#tb_articulosDetallePrevio').DataTable();
				console.log("5")
				var pageInfo = table.page.info();
				console.log("6")
				$('#myInputPrevio').on( 'keyup', function () {       
					table.search( this.value ).draw();     
				} );
				console.log("7")  
			}
			
			
			function aplicarEstiloTablaConfirmacionFacturasMonitor() 
			{ 
				$('#tb_articulosDetalle').DataTable( {   
					ordering: false,   
				paging: true, 
				"pageLength": 19,    
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },  
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyMonitor');      
				    } 
					} );
				$("#divFilterMonitor").append("<input id='myInput' type='text' placeholder='Filtrar...'>");       	
				var table = $('#tb_articulosDetalle').DataTable();
				var pageInfo = table.page.info();
				$("#titleMonitor").text("FACTURAS: "+pageInfo.recordsTotal)
				$('#myInput').on( 'keyup', function () {
					       
				    table.search( this.value ).draw();
				} );
			}
			
			function aplicarEstiloTablaConfirmacionFacturasMonitorg() 
			{ 
				$('#tb_articulosDetalle').DataTable( {   
					ordering: false,   
				paging: true,     
				"pageLength": 22,      
				"bLengthChange" : false, //th    
				    "language": {
				    	"info": "Página _PAGE_ De _PAGES_",
				        "lengthMenu": "Mostrar  _MENU_ productos.",
				        "zeroRecords": "No se encontraron facturas.",
				        "infoEmpty": "No se encontraron facturas.",
				        "infoFiltered": "(Filtrando de _MAX_ registros totales)",
					    "sLoadingRecords": "Cargando...",
					    "paginate": {
					        "previous": "Anterior",
					        "next": "Siguiente"   
					      }   
				    },  
					initComplete: function(settings, json){
						$('.dataTables_paginate').appendTo('#customBodyMonitorg');      
				    } 
					} );
				$("#divFilterMonitorg").append("<input id='myInputg' type='text' placeholder='Filtrar...'>");        	
				var table = $('#tb_articulosDetalle').DataTable();
				var pageInfo = table.page.info();
				$('#myInputg').on( 'keyup', function () {
					       
				    table.search( this.value ).draw();
				} );
			}
			
			
			
		</script>
		  <style>
.big-checkbox {width: 30px; height: 30px;}
</style>
	</head>
	
	<body onload="opcionMostrar()" style="">     
	<input type="hidden" id="nivel" value="${infoUsu.nivel_usuario}">
	<input type="hidden" id="facturasCorrectas" >
<!-- 	<input type="button" onclick="d()" style="width: 80%">--> 
		<!-- ENCABEZADO  -->
		<%@include file="Encabezado.html" %>
		<%@include file="Previo.html" %>
		<%@include file="AlertaMensajeDeEspera.html" %>
		<%@include file="monitorEstatus.html" %>    
<%-- 		<%@include file="ConfirmacionMenu.html" %> --%>
		<div class="menu">
<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist"> 
<!--     <a class="nav-item nav-link" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true" onclick="consultarFacturasEscaneadas(); clearDiv()">Confirmacion Almacen</a>    -->
    <a class="nav-item nav-link" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true" onclick="validarAlmacen(); clearDiv()">Confirmacion Almacen</a>    
<!--     <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false" onclick="consultarFacturasEscaneadasCredito(); clearDiv()">Confirmacion Credito</a> -->
    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false" onclick="clearDiv();validarCredito(); ">Confirmacion Credito</a>      
    <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false" onclick="validarEncargado(); clearDiv()">Confirmacion Facturas por Agente</a>
    <a class="nav-item nav-link" id="nav-genera-tab" data-toggle="tab" href="#nav-genera" role="tab" aria-controls="nav-genera" aria-selected="false" onclick="validarGenera(); clearDiv()">Generar Cobranza</a>
    <a class="nav-item nav-link" id="nav-cobranza-tab" data-toggle="tab" href="#nav-cobranza" role="tab" aria-controls="nav-cobranza" aria-selected="false" onclick="clearDiv(); validarConfirma(); ">Confirma Cobranza</a>           
    <a class="nav-item nav-link" id="nav-monitor-tab" data-toggle="tab" href="#nav-monitor" role="tab" aria-controls="nav-monitor" aria-selected="false" onclick="consultaMonitor(); clearDiv()">Monitor de Facturas</a>
    <a class="nav-item nav-link" id="nav-relacion-tab" data-toggle="tab" href="#nav-relacion" role="tab" aria-controls="nav-relacion" aria-selected="false" onclick="consultaReimpresion(); clearDiv()">Reimpresion Relacion de Cobranza</a>
    <a class="nav-item nav-link" id="nav-monitorg-tab" data-toggle="tab" href="#nav-monitorg" role="tab" aria-controls="nav-monitorg" aria-selected="false" onclick="consultaMonitorg(); clearDiv()">Monitor General</a>          
  </div>  
</nav>
<div align="center" style="width: 100%;margin-top: 7px;margin-bottom: 4px;display:none" id="warning">   
	<div class="alert alert-warning alert-dismissible fade show" role="alert" style="padding-top: 2px;padding-bottom: 2px;width: 60%;margin-bottom: 0px;"> 
	  <label id="lblWarning" style="    margin-bottom: 0px;"></label>  
	  <button type="button" class="close" onclick="$('#warning').hide()" aria-label="Close" style="padding-top: 1px;padding-bottom: 0px;"> 
	    <span aria-hidden="true">&times;</span>
	  </button>
	</div>
</div>
<div align="center" style="width: 100%;margin-top: 7px;margin-bottom: 4px;display:none" id="success">   
	<div class="alert alert-success alert-dismissible fade show" role="alert" style="padding-top: 2px;padding-bottom: 2px;width: 60%;margin-bottom: 0px;">     
	  <label id="lblSuccess" style="    margin-bottom: 0px;"></label>  
	  <button type="button" class="close" onclick="$('#success').hide()" aria-label="Close" style="padding-top: 1px;padding-bottom: 0px;">
	    <span aria-hidden="true">&times;</span>
	  </button>
	</div>
</div>
<div align="center" style="width: 100%;margin-top: 7px;margin-bottom: 4px;display:none" id="danger">   
	<div class="alert alert-danger alert-dismissible fade show" role="alert" style="padding-top: 2px;padding-bottom: 2px;width: 60%;margin-bottom: 0px;"> 
	  <label id="lblDanger" style="    margin-bottom: 0px;"></label>  
	  <button type="button" class="close" onclick="$('#danger').hide()" aria-label="Close" style="padding-top: 1px;padding-bottom: 0px;"> 
	    <span aria-hidden="true">&times;</span>
	  </button>
	</div>
</div>
<div class="tab-content" id="nav-tabContent">
<div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab"  style="">   
	<div style="display:none" id="facurasAlmacen"> 
		<div style="height: 65%">  
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body" style="    padding-bottom: 5px;">  
					<table style="width: 100%">
						<tr>
							<td width="10%"> <label style="    font-family: none;font-size: 21px;margin-bottom: 0px;">Escanee factura:</label> </td>  
							<td align="left" width="10%">    
							<div style="    height: 100%;" align="left" class="hideAlmacen hideEscaneoAlmacen">   
							<div class="input-group mb-3"  align="left" style="    margin-bottom: 0px !important;width: max-content;">  
							  <input type="text" id="txtFactura" placeholder="Factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) escanearFactura($('#txtFactura').val()) "  maxlength="15" > 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviar" onclick="escanearFactura($('#txtFactura').val())"  class="btn btn-success" > <i class='fa-solid fa-check'></i></button>              
							  </div>
							</div>
							 </div> 
							</td>
							<td align="center" width="15%">  
								<button type="button" id="detalleEscaneoAlmacen" onclick="detalleEscaneoAlmacen()" class="btn btn-warning  hideAlmacen " style="">Consultar Previo <i class="fa-solid fa-list-check" style="FONT-SIZE: 17px;font-weight: bold;"></i></button>          
							 </td>  
							<td align="left" width="20%">     
								<button type="button" id="btnEnviar" onclick="enviarFactura()" class="btn btn-success hideAlmacen" style="">Enviar Facturas a Credito <i class="fa-solid fa-arrow-up-from-bracket"></i></button>        
							 </td>
							 <td align="right" width="15%">           
							<div style="    height: 100%; width: 100%;" align="center" >  
							    <button type="button"  onclick="$('#mdlAlmacenFolioKey').modal('toggle');$('#mdlAlmacenFolioKey').on('shown.bs.modal', function () { $('#txtKey').focus()});$('#warningUsrAlmKey').hide(); $('#txtKey').val('')"  class="btn btn-danger hideAlmacen"> Regresar folio a chofer <i class="fa-solid fa-trash-can"></i></button>                           
							 </div>  
							</td>  
							 <td align="right" width="20%">          
							<div style="    height: 100%; width: 100%;" align="right" id="btnCAlmacen">   
							<div class="input-group mb-3"  align="right" style="    margin-bottom: 0px !important;width: max-content;">    
							  <input type="text" id="txtFacturaCancelar" placeholder="Escanee factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) cancelarFactura($('#txtFacturaCancelar').val()) "  maxlength="15"  class="hideAlmacen"> 
							  <div class="input-group-append"> 
							    <button type="button"  onclick="cancelarFactura($('#txtFacturaCancelar').val())"  class="btn btn-warning hideAlmacen"  > Regresar Factura <i class="fa-solid fa-trash-can"></i></button>                 
							  </div>
							</div>  
							 </div>  
							</td>  
						</tr>
						<tr>     
						<td colspan="6">
							<div style="margin-top: 2px; width: 100%"><label id="tituloBuscadoAlmacen" style="margin-bottom: 0px;margin-bottom: 0px; background: black;color: white; font-weight: bold; padding: 5px;display: none"></label></div>          
						</td>
						</tr>
					</table>	 
				</div>
			</div>	
			<div style="margin-top: 0px; height: 100%">  
				<table style="width: 100%"> 
				<tr>
				<td>
					<label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleAlmacen"> FACTURAS DISPONIBLES </label> 
				</td>
				<td align="center">  
					<div style="width: 100%" align="center">
					<div id='customBody' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td>
					<div id='divFilter' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableFacturas" style="width: 100%; height: 100%"></div>    	
			</div>
		</div>	
	</div>
</div>      
<div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">

	<div style="display:none" id="facurasCredito">  
		<div style="height: 65%">  
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body">
					<table style="width: 100%">
						<tr>
							<td width="10%"> <label style="    font-family: none;font-size: 21px;margin-bottom: 0px;">Escanee factura:</label> </td> 
							<td align="left" width="10%">   
							<div style="    height: 100%;" align="left" class="hideCredito hideEscaneoCredito"> 
							<div class="input-group mb-3"  align="center" style="    margin-bottom: 0px !important; width: max-content;"> 
							  <input type="text" id="txtFacturaCredito" placeholder="Factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) escanearFacturaCredito($('#txtFacturaCredito').val()) "  maxlength="15" > 
							  <div class="input-group-append">  
							    <button type="button" id="btnEnviar" onclick="escanearFacturaCredito($('#txtFacturaCredito').val())"  class="btn btn-success" > <i class='fa-solid fa-check'></i></button>              
							  </div>
							</div>
							 </div>    
							</td> 
							 <td align="center" width="15%">   
								<button type="button" id="detalleEscaneoCredito" onclick="detalleEscaneoCredito()" class="btn btn-warning hideCredito" style="">Consultar Previo <i class="fa-solid fa-list-check" style="FONT-SIZE: 17px;font-weight: bold;"></i></button>          
							 </td> 
							<td align="left" width="20%">  
								<button type="button" id="btnEnviar" onclick="enviarFacturaCredito();" class="btn btn-info hideCreditoECC" style="">Enviar Facturas a ECC <i class="fa-solid fa-arrow-up-from-bracket"></i></button>         
							 </td>  
							 <td align="left" width="15%">   
								<div style="    height: 100%; width: 100%;" align="center" >  
								    <button type="button"  onclick="consultaCorteACancelar($('#txtCreditoCorte').val())"  class="btn btn-danger hideCredito">Cancelar Folio Credito <i class="fa-solid fa-trash-can"></i></button>                                     
								 </div> 
							 </td>
							 <td align="right" width="20%">           
							<div style="    height: 100%; width: 100%" align="right" id="btnCCredito">  
							<div class="input-group mb-3"  align="right" style="    margin-bottom: 0px !important;width: max-content;">    
							  <input type="text" id="txtFacturaCancelarCredito" placeholder="Escanee factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;"      
							  onKeyPress="if (event.keyCode == 13) cancelarFacturaCredito($('#txtFacturaCancelarCredito').val()) "  maxlength="15"  class="hideCredito">    
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviar" onclick="cancelarFacturaCredito($('#txtFacturaCancelarCredito').val())"  class="btn btn-warning hideCredito" > Regresar Factura <i class="fa-solid fa-trash-can"></i></button>                      
							  </div>
							</div>  
							 </div>   
							</td>
							</tr>
							<tr>  
						<td colspan="6">
							<div style="margin-top: 2px; width: 100%"><label id="tituloBuscadoCredito" style="margin-bottom: 0px;margin-bottom: 0px; background: black;color: white; font-weight: bold; padding: 5px;display: none"></label></div>          
						</td>	
						</tr>
					</table>	 
				</div>
			</div>
			<div style="margin-top: 30px; height: 100%">  
				<table style="width: 100%"> 
				<tr>
				<td>
					<label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleCredito"> FACTURAS ESCANEADAS </label>
				</td>
				<td align="center">  
					<div style="width: 100%" align="center">
					<div id='customBodyCredito' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td>
					<div id='divFilterCredito' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableFacturasCredito" style="width: 100%; height: 100%"></div>    	
			</div>
		</div>	
	</div>

</div>

<div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
	<div style="display:none" id="facurasCreditoEncargado">  
		<div style="height: 65%">  
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body">
					<table>
						<tr>
							<td width="10%"> <label style="    font-family: none;font-size: 21px;margin-bottom: 0px;">Escanee factura:</label> </td> 
							<td align="left" width="10%">
							<div style="    height: 100%;" align="left" class="hideECC hideEscaneoECC">  
							<div class="input-group mb-3"  align="center" style="    margin-bottom: 0px !important;width: max-content;"> 
							  <input type="text" id="txtFacturaCreditoEncargado" placeholder="Factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) escanearFacturaCreditoEncargado($('#txtFacturaCreditoEncargado').val()) "  maxlength="15" > 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviar" onclick="escanearFacturaCreditoEncargado($('#txtFacturaCreditoEncargado').val())"  class="btn btn-success" > <i class='fa-solid fa-check'></i></button>              
							  </div>
							</div>
							 </div>    
							</td> 
							 <td align="center" width="15%">   
								<button type="button" id="detalleEscaneoCreditoEncargado" onclick="detalleEscaneoCreditoEncargado()" class="btn btn-warning hideECC" style="">Consultar Previo <i class="fa-solid fa-list-check" style="FONT-SIZE: 17px;font-weight: bold;"></i></button>          
							 </td> 
							<td align="left" width="20%"> 
								<button type="button" id="btnEnviar" onclick="enviarFacturaCreditoEncargado()" class="btn btn-info hideCobranzaECC" style="">Confirmar Facturas <i class="fa-solid fa-arrow-up-from-bracket"></i></button>      
							 </td>  
							 <td align="left" width="15%">   
								<div style="    height: 100%; width: 100%;" align="center" >  
								    <button type="button"  onclick="consultaCorteACancelarECC($('#txtCreditoCorteECC').val())"  class="btn btn-danger hideECC">Cancelar Folio Credito <i class="fa-solid fa-trash-can"></i></button>                                        
								 </div> 
							 </td>
							<td align="right" width="20">         
							<div style="    height: 100%; width: 100%" align="right" id="tbnCECC">  
							<div class="input-group mb-3"  align="right" style="    margin-bottom: 0px !important;width: max-content;">    
							  <input type="text" id="txtFacturaCancelarCreditoEncargado" placeholder="Escanee factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) cancelarFacturaCreditoEncargado($('#txtFacturaCancelarCreditoEncargado').val()) "  maxlength="15"  class="hideECC"> 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviarECC" onclick="cancelarFacturaCreditoEncargado($('#txtFacturaCancelarCreditoEncargado').val())"  class="btn btn-warning hideECC" > Regresar Factura <i class="fa-solid fa-trash-can"></i></button>               
							  </div>
							</div>
							 </div> 
							</td>  
						</tr>
						<tr>  
						<td colspan="6">
							<div style="margin-top: 2px; width: 100%"><label id="tituloBuscadoCreditoECC" style="margin-bottom: 0px;margin-bottom: 0px; background: black;color: white; font-weight: bold; padding: 5px;display: none"></label></div>          
						</td>	
						</tr>
					</table>	 
				</div>
			</div>
			<div style="margin-top: 30px; height: 100%">  
				<table style="width: 100%"> 
				<tr>
				<td width="20">
					<label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleCreditoEncargado"> FACTURAS ESCANEADAS </label>
				</td>
				<td width="20">
					 <i class="fa-solid fa-user" id="lblCreditoEncargados"></i><label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="lblCreditoEncargado"></label>
				</td>
				<td align="center" width="30">  
					<div style="width: 100%" align="center">
					<div id='customBodyCreditoEncargado' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td width="20"> 
					<div id='divFilterCreditoEncargado' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableFacturasCreditoEncargado" style="width: 100%; height: 100%"></div>    	
			</div>
		</div>	
	</div>
</div> 












<!-- 														****************************** GENERA RELACION DE COBRANA *********************************** -->



<div class="tab-pane fade" id="nav-genera" role="tabpanel" aria-labelledby="nav-genera-tab">
	<div>  
		<div style="height: 65%">  
		
			<div class="card" style="">
				<div class="card-body" style="    padding-top: 5px;     padding-bottom: 5px;">  
					<table style="width: 100%">
						<tr>
							<td style="width: 15%">
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">ECC</span>  
								 	</div>
									<input type="text"  id="txtEccF" class="form-control" placeholder="Ingrese ECC.."  aria-label="Recipient's username" aria-describedby="basic-addon2">                
								</div>							  
							</td>
							<td style="width: 15%">
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">AV</span>  
								 	</div>
									<input type="text"  id="txtAvF" class="form-control" placeholder="Ingrese agente.."  aria-label="Recipient's username" aria-describedby="basic-addon2" oninput="this.value = this.value.replace(/[^0-9,]/g, '')">                
								</div>							  
							</td>
							<td style="width: 15%">
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">CTE</span>  
								 	</div>
									<input type="text"  id="txtClienteF" class="form-control" placeholder="Ingrese cliente.."  aria-label="Recipient's username" aria-describedby="basic-addon2" oninput="this.value = this.value.replace(/[^0-9,]/g, '')">                  
								</div>							  
							</td>   
							<td style="width: 13%">  
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">FECHA INI</span>  
								 	</div>
									<input type="text"  id="txtFechaIniF" class="form-control " placeholder="Ingrese ECC.."  aria-label="Recipient's username" aria-describedby="basic-addon2" style="text-align: center;">                  
								</div>							  
							</td>
							<td style="width: 13%">
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">FECHA FIN</span>  
								 	</div>
									<input type="text"  id="txtFechaFinF" class="form-control " placeholder="Ingrese ECC.."  aria-label="Recipient's username" aria-describedby="basic-addon2" style="text-align: center;">                    
								</div>							  
							</td>
							<td style="width: 15%">
								<div align="left" style="width: 100%;    margin-right: 10px;margin-left: 10px;" >                    
									<div class="form-check">
						  				<input class="form-check-input " type="radio" name="exampleRadiosF" id="exampleRadios1F" value="0" style="    bottom: 0px;top: 0px;;cursor: pointer;" checked="checked">   
						  				<label class="form-check-label checkbox-lg  " for="exampleRadios1F" style="font-size: 20px;cursor: pointer;"> 
						    				Facturas por vencer
						  				</label>
									</div>						
									<div class="form-check">
						  				<input class="form-check-input " type="radio" name="exampleRadiosF" id="exampleRadios2F" value="1" style="    bottom: 0px;top: 0px;;cursor: pointer;"> 
						  				<label class="form-check-label checkbox-lg  " for="exampleRadios2F" style="font-size: 20px;cursor: pointer;">   
						    			    Todas las facturas
						  				</label>
									</div>
								</div>							  
							</td>
							<td style="width:7%">
							<button onclick="$('#txtEccF').val('');$('#txtAvF').val('');$('#txtClienteF').val('');$('#txtFechaIniF').val(ObtenerFechaActual());$('#txtFechaFinF').val(ObtenerFechaActual());"  style=" " class="btn btn-secondary"  ><i class="fa-solid fa-broom"></i> Limpiar</button>   
							</td>
							<td style="width:7%">   
								<button onclick="consultaGenera()" class="btn btn-primary" style=""><i class="fa-solid fa-magnifying-glass"></i> Consultar</button>       							  
							</td>
						</tr>
					</table>	 
				</div>
			</div>		
		
		
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body" style="display:none" id="facurasCreditoGenera">    
					<table>
						<tr>
							<td width="10%"> <label style="    font-family: none;font-size: 21px;margin-bottom: 0px;">Escanee factura:</label> </td> 
							<td align="left" width="10%">
							<div style="    height: 100%;" align="left" class="hideGenera hideEscaneoGenera">  
							<div class="input-group mb-3"  align="center" style="    margin-bottom: 0px !important;width: max-content;"> 
							  <input type="text" id="txtFacturaCreditoGenera" placeholder="Factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) escanearFacturaCreditoGenera($('#txtFacturaCreditoGenera').val()) "  maxlength="15" > 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviar" onclick="escanearFacturaCreditoGenera($('#txtFacturaCreditoGenera').val())"  class="btn btn-success" > <i class='fa-solid fa-check'></i></button>              
							  </div>
							</div>
							 </div>    
							</td> 
							 <td align="center" width="15%">   
								<button type="button" id="detalleEscaneoCreditoGenera" onclick="detalleEscaneoCreditoGenera()" class="btn btn-warning hideGenera" style="">Consultar Previo <i class="fa-solid fa-list-check" style="FONT-SIZE: 17px;font-weight: bold;"></i></button>          
							 </td> 
							<td align="left" width="20%"> 
								<button type="button" id="btnEnviarGenera" onclick="pintarDetalleGenera()" class="btn btn-info hideCobranzaGenera" style="">Confirmar Facturas <i class="fa-solid fa-arrow-up-from-bracket"></i></button>         
							 </td>  
							 <td align="left" width="15%">   
								<div style="    height: 100%; width: 100%;" align="center" >  
<!-- 								    <button type="button"  onclick="consultaCorteACancelarGenera($('#txtCreditoCorteGenera').val())"  class="btn btn-danger hideGenera">Cancelar Folio Credito <i class="fa-solid fa-trash-can"></i></button>                                         -->  
								 </div> 
							 </td>
							<td align="right" width="20">         
							<div style="    height: 100%; width: 100%" align="right" id="tbnCGenera">  
							<div class="input-group mb-3"  align="right" style="    margin-bottom: 0px !important;width: max-content;">    
							  <input type="text" id="txtFacturaCancelarCreditoGenera" placeholder="Escanee factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) cancelarFacturaCreditoGenera($('#txtFacturaCancelarCreditoGenera').val()) "  maxlength="15"  class="hideGenera"> 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviarGenera" onclick="cancelarFacturaCreditoGenera($('#txtFacturaCancelarCreditoGenera').val())"  class="btn btn-warning hideGenera" > Regresar Factura <i class="fa-solid fa-trash-can"></i></button>               
							  </div>
							</div>
							 </div> 
							</td>  
						</tr>
						<tr>  
						<td colspan="6">
							<div style="margin-top: 2px; width: 100%"><label id="tituloBuscadoCreditoGenera" style="margin-bottom: 0px;margin-bottom: 0px; background: black;color: white; font-weight: bold; padding: 5px;display: none"></label></div>          
						</td>	
						</tr>
					</table>	 
				</div>
			</div>
			<div style="width: 100%" align="center">
			<div style="margin-top: 30px; height: 100%; width: 100%" align="center">        
				<table style="width: 100%"> 
				<tr>
				<td width="20">
					<label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleCreditoGenera"> FACTURAS ESCANEADAS </label>
				</td>
				<td width="20">
					 <i class="fa-solid fa-user" id="lblCreditoGenera"></i><label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="lblCreditoGenera"></label>
				</td>
				<td align="center" width="30">  
					<div style="width: 100%" align="center">
					<div id='customBodyCreditoGenera' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td width="20"> 
					<div id='divFilterCreditoGenera' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableFacturasCreditoGenera" style="width: 100%; height: 100%"></div>      	
			</div>
			</div> 
		</div>	
	</div>
</div> 





<!-- 														****************************** FIN GENERA RELACION DE COBRANA *********************************** -->








































<!-- 														****************************** GENERA CONFIRMA DE COBRANA *********************************** -->



<div class="tab-pane fade" id="nav-cobranza" role="tabpanel" aria-labelledby="nav-cobranza-tab">
	<div>  
		<div style="height: 65%">   
		
			<div class="card" style="">
				<div class="card-body" style="    padding-top: 5px;     padding-bottom: 5px;">  
					<table style="width: 100%">
						<tr>
							<td style="width: 30%">
								<div class="input-group " align="center" style="width: 95%;margin-bottom: 0px;">                 
									<div class="input-group-prepend">       
									   <span class="input-group-text">FOLIO RELACION DE COBRANZA</span>  
								 	</div>
									<input type="text"  id="txtFolioConfirma" class="form-control" placeholder="Ingrese folio.."  aria-label="Recipient's username" aria-describedby="basic-addon2"
									onKeyPress="if (event.keyCode == 13) consultaConfirma($('#txtFolioConfirma').val()) "   
									>                
								</div>							  
							</td>
							<td style="width: 15%">
								<button onclick="consultaConfirma($('#txtFolioConfirma').val())" class="btn btn-primary" style=""><i class="fa-solid fa-magnifying-glass"></i> Consultar</button>  					  
							</td>
							<td style="width: 15%">
													  
							</td>   
							<td style="width: 13%">  
											  
							</td>
							<td style="width: 13%">
												  
							</td>
							 
							<td style="width:9%">  
								     							  
							</td>
							<td style="width:5%">  
								     							  
							</td>
						</tr>
					</table>	 
				</div>
			</div>		
		
		
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body" style="display:none" id="facurasCreditoConfirma">    
					<table>
						<tr>
							<td width="10%"> <label style="    font-family: none;font-size: 21px;margin-bottom: 0px;">Escanee factura:</label> </td> 
							<td align="left" width="10%"> 
							<div style="    height: 100%;" align="left" class="hideConfirma hideEscaneoConfirma">   
							<div class="input-group mb-3"  align="center" style="    margin-bottom: 0px !important;width: max-content;"> 
							  <input type="text" id="txtFacturaCreditoConfirma" placeholder="Factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;"   
							  onKeyPress="if (event.keyCode == 13) escanearFacturaCreditoConfirma($('#txtFacturaCreditoConfirma').val()) "  maxlength="15" > 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviar" onclick="escanearFacturaCreditoConfirma($('#txtFacturaCreditoConfirma').val())"  class="btn btn-success" > <i class='fa-solid fa-check'></i></button>              
							  </div>
							</div>
							  <div class="form-check" style="cursor: pointer;"> 
							    <input type="checkbox" class="form-check-input" id="checkCR" style="cursor: pointer;">  
							    <label class="form-check-label" for="checkCR" style="cursor: pointer;">CONTRARECIBO</label>   
							  </div>
							 </div>
							</td> 
							 <td align="center" width="15%">   
								<button type="button" id="detalleEscaneoCreditoConfirma" onclick="detalleEscaneoCreditoConfirma()" class="btn btn-warning hideConfirma" style="">Consultar Previo <i class="fa-solid fa-list-check" style="FONT-SIZE: 17px;font-weight: bold;"></i></button>          
							 </td> 
							<td align="left" width="20%"> 
								<button type="button" id="btnEnviarConfirma" onclick="pintarDetalleConfirma()" class="btn btn-info hideCobranzaConfirma" style="">Confirmar Facturas <i class="fa-solid fa-arrow-up-from-bracket"></i></button>        
							 </td>  
							 <td align="left" width="15%">   
								<div style="    height: 100%; width: 100%;" align="center" >  
<!-- 								    <button type="button"  onclick="consultaCorteACancelarGenera($('#txtCreditoCorteGenera').val())"  class="btn btn-danger hideGenera">Cancelar Folio Credito <i class="fa-solid fa-trash-can"></i></button>                                         -->  
								 </div> 
							 </td>
							<td align="right" width="20">         
							<div style="    height: 100%; width: 100%" align="right" id="tbnCConfirma">  
							<div class="input-group mb-3"  align="right" style="    margin-bottom: 0px !important;width: max-content;">    
							  <input type="text" id="txtFacturaCancelarCreditoConfirma" placeholder="Escanee factura..." style="    padding-top: 4px;padding-bottom: 4px;padding-left: 5px;margin-left: 10px;" 
							  onKeyPress="if (event.keyCode == 13) cancelarFacturaCreditoConfirma($('#txtFacturaCancelarCreditoConfirma').val()) "  maxlength="15"  class="hideConfirma"> 
							  <div class="input-group-append"> 
							    <button type="button" id="btnEnviarConfirma" onclick="cancelarFacturaCreditoConfirma($('#txtFacturaCancelarCreditoConfirma').val())"  class="btn btn-warning hideConfirma" > Regresar Factura <i class="fa-solid fa-trash-can"></i></button>               
							  </div>
							</div>
							 </div> 
							</td>  
						</tr>
						<tr>  
						<td colspan="6">
							<div style="margin-top: 2px; width: 100%"><label id="tituloBuscadoCreditoConfirma" style="margin-bottom: 0px;margin-bottom: 0px; background: black;color: white; font-weight: bold; padding: 5px;display: none"></label></div>          
						</td>	
						</tr>
					</table>	 
				</div>
			</div>
			<div style="width: 100%" align="center">
			<div style="margin-top: 30px; height: 100%; width: 90%" align="center">    
				<table style="width: 100%"> 
				<tr>
				<td width="20">
					<label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleCreditoConfirma"> FACTURAS ESCANEADAS </label>
				</td>
				<td width="20">
					 <i class="fa-solid fa-user" id="lblCreditoConfirma"></i><label style="margin-bottom: 0px;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="lblCreditoConfirma"></label>
				</td>
				<td align="center" width="30">  
					<div style="width: 100%" align="center">
					<div id='customBodyCreditoConfirma' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td width="20"> 
					<div id='divFilterCreditoConfirma' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableFacturasCreditoConfirma" style="width: 100%; height: 100%"></div>      	
			</div>
			</div> 
		</div>	
	</div>
</div> 





<!-- 														****************************** FIN CONFIRMA RELACION DE COBRANA *********************************** -->
















<div class="tab-pane fade" id="nav-monitor" role="tabpanel" aria-labelledby="nav-monitor-tab">
	<div style="display:block" id="monitor">   
		<div style="height: 65%">  
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body">
					<table style="width: 100%">
						<tr>
							<td > <label class="EG_lbtexto">FECHA INICIO: </label> </td>
							<td > <input type="text" id="txt_fechaIni" class="EG_calendario" > </td>
							<td > <label class="EG_lbtexto">FECHA FIN: </label> </td>   
							<td align="left" ><input type="text" id="txt_fechaFin" class="EG_calendario" ></td>
							<td > <label class="EG_lbtexto">PEDIDO: </label> </td>  
							<td align="left"> 
								<input type="text" id="txtPedido" onKeyPress="return soloNumeros(event);" style="text-align: center;display: block" maxlength="7">   	      
							</td>
							<td > <label class="EG_lbtexto tbl">USUARIO CREDITO: </label> </td>       
							<td align="left"> 
								<input type="text" id="txtUsuarioCredito" class="tbl  "   style="text-align: center;display: block" maxlength="7" oninput="this.value = this.value.toUpperCase()">     	      
							</td>
							<td rowspan="2">
							<button class="btn btn-primary" type="button" style="padding: 4px; width: 100px" onclick="consultaMonitor(); clearDiv()">Consultar</button>     
						</td>
						</tr>
						<tr> 	
							<td > <label class="EG_lbtexto tbl">FACTURA: </label> </td>   
							<td align="left"> 
								<input type="text" id="txtFacturaM" class="tbl "   style="text-align: center;display: block" maxlength="7">     	      
							</td>
							<td > <label class="EG_lbtexto tbl">AGENTE: </label> </td>   
							<td align="left"> 
								<input type="text" id="txtAgente" class=" tbl"   style="text-align: center;display: block" maxlength="7" onKeyPress="return soloNumeros(event);">            	      
							</td>
							<td > <label class="EG_lbtexto tbl">USUARIO ALMACEN: </label> </td>       
							<td align="left"> 
								<input type="text" id="txtUsuarioAlmacen" class="tbl  "   style="text-align: center;display: block" maxlength="7" oninput="this.value = this.value.toUpperCase()">     	      
							</td>
							<td > <label class="EG_lbtexto tbl">USUARIO ENCARGADO: </label> </td>       
							<td align="left"> 
								<input type="text" id="txtUsuarioEncargado" class="tbl  "   style="text-align: center;display: block" maxlength="7" oninput="this.value = this.value.toUpperCase()">      	      
							</td>
							
						</tr>
					</table>	 
				</div>
			</div>
			<div style="margin-top: 6px; height: 100%">    
				<table style="width: 100%"> 
				<tr>
				<td>
					<label style="margin-bottom: 0px;background: black;color: white;font-weight: bold;padding-left: 10px;padding-right: 10px;padding-top: 7px;padding-bottom: 7px;" id="titleMonitor"> FACTURAS:  </label>  
				</td>
				<td align="center">  
					<div style="width: 100%" align="right">   
					<div id='customBodyMonitor' align="center" style="width: max-content;"></div> 
					</div>   
				</td>
				<td>
					<div id='divFilterMonitor' align='right'></div>    
				</td>
				
				</tr>
				</table>
				<div class="table table-responsive" id="divTableMonitor" style="width: 100%; height: 100%"></div>     	
			</div>
		</div>	
	</div>
</div> 

 
 
 
 
 <div class="tab-pane fade" id="nav-relacion" role="tabpanel" aria-labelledby="nav-relacion-tab">
	<div style="display:block" id="relacion">   
		<div style="height: 65%">  
			<div class="card" style=" margin-top: 10px;">
				<div class="card-body" align="center">
					<table style="width: 61%"> 
						<tr>
							<td > <label class="EG_lbtexto" style="margin-bottom: 0px; font-size: 18px">INGRESE UNA FACTURA DE LA RELACION DE COBRANZA: </label> </td> 
							<td align="left"> 
								<input type="text" id="txtFacturaR" class=""   style="text-align: center;display: block; " maxlength="7"  placeholder="Factura... ">     	    
							</td>
							<td align="left"> 
								<button type="button" class="btn btn-info" onclick="imprimirRelacion()" style="padding-top: 2px;padding-bottom: 2px;">Imprimir</button>     	      
							</td>
						</tr>
					</table>	 
				</div>
			</div>
		</div>	
	</div>
</div> 











 
	<div class="tab-pane fade" id="nav-monitorg" role="tabpanel" aria-labelledby="nav-monitor-tab">
		<div class="englobamiento" style="display:grid;" id="monitorg">   
  <div class="encabezadoEstatus">
    <div class="alertMsj">
		<div align="center" style="width: 100%;margin-top: 0px;margin-bottom: 4px;display: none;" id="warningg">   
			<div class="alert alert-warning alert-dismissible fade show" role="alert" style="padding-top: 2px;padding-bottom: 2px;width: 88%;margin-bottom: 0px;">   
			  <label id="lblWarningg" style="    margin-bottom: 0px;"></label>  
			  <button type="button" class="close" onclick="$('#warningg').hide()" aria-label="Close" style="padding-top: 1px;padding-bottom: 0px;">    
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
		</div>
    </div>
    <div class="filtrosConsulta">
		<table style="width: 90%;margin-left: 25px;">  
			<tr>
				<td > <label class="EG_lbtextog" style="    margin-bottom: 0px;">FECHA INICIO: </label> </td>
				<td>
					<input type="text" id="txt_fechaInig" class="EG_calendario" >
				</td>
				<td > <label class="EG_lbtextog" style="    margin-bottom: 0px;">FECHA FIN: </label> </td>   
				<td>
					<input type="text" id="txt_fechaFing" class="EG_calendario" >
				</td>  
				<td > <label class="EG_lbtextog" style="    margin-bottom: 0px;">FACTURA: </label> </td>    
				<td align="left"> 
					<input type="text" id="txtFacturag"class="EG_calendario"   class="tbl "   style="text-align: center;display: block" maxlength="7">     	      
				</td>	
				<td > <label class="EG_lbtextog" style="    margin-bottom: 0px;">PEDIDO: </label> </td>   
				<td align="left"> 
					<input type="text" id="txtPedidog" class="EG_calendario"  onKeyPress="return soloNumeros(event);" style="text-align: center;display: block" maxlength="7">     	      
				</td>
				<td align="left"> 
					<button onclick="cosnultargfiltros()" class="btn btn-info" style="    padding-bottom: 2px;padding-right: 2px;    padding-top: 2px;   padding-right: 2px;padding-left: 2px;"><i class="fa-solid fa-magnifying-glass"></i> Buscar</button>  
				</td>	
				<td align="left"> 
					<button onclick="consultaMonitorg()"  style="  padding-bottom: 2px;padding-right: 2px;    padding-top: 2px;   padding-right: 2px;padding-left: 2px;" class="btn btn-warning"  ><i class="fa-solid fa-arrows-rotate"></i>Actualizar </button>      	      
				</td>
				<td align="left"> 
					<button onclick="$('#divTableMonitorg').empty();"  style="  padding-bottom: 2px;padding-right: 0px;    padding-top: 2px;   padding-right: 2px;padding-left: 2px;" class="btn btn-secondary"  ><i class="fa-solid fa-broom"></i> Limpiar</button>   
				</td>												
			</tr> 
		</table> 		    	
    </div>
  </div>
  <div class="tipoEstatus">      
  
  						<div style="width: 100%" align="right">
 							<label style="
							    background: #28a745;
							    color: white;
							    font-weight: bold;
							    padding-left: 5px;
							    padding-right: 6px;
							    border-radius: 15px;
							        margin-bottom: 2px;
							">Facturas</label>
							<label style="
							    background: #a6bfeb;
							    color: white;
							    font-weight: bold; 
							    padding-left: 5px;
							    padding-right: 6px;
							    border-radius: 15px;
							        margin-bottom: 2px; 
							">Trayectos</label> 
  						</div>
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;cursor: pointer;    background: #d84856;color: white !important; " onclick="consultarmonitorgDetalle($('#mpendienteAsignarFol').text(),'0','pendienteAsignar',48)" id="mpendienteAsignarD">  
						  <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/pendiente.png"style="height: 30px; width: 30px;     color: white;background-color: white;border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important;color: white;font-weight: bold;"  align="left"> 									
								  	Pendiente por Asignar
								  </td>
								  <td style="width: 20%!important" align="center" >   									  
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mpendienteAsignarFol">0</label></td>            
								  			<td width="50%" align="center" ><label class="lblcls" id="mpendienteAsignar">0</label></td>  
								  		</tr>
								  	</table>
								  </td>
								  
							  </tr>
						  </table>						 
						  </div>
						</div>
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mregionalPFol').text(),'8','entregado en CDO regional',47)" id="mregionalPD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important"> 
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/entregadocdoregional.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">
								  	Pendiente CDO Regional
								  </td>
								  <td style="width: 20%!important" align="center" > 
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mregionalPFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mregionalP">0</label></td>  
								  		</tr>
								  	</table>   									
								  </td>
							  </tr>
						  </table>										 
						  </div>
						</div>
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mpendienteFol').text(),'0','pendiente',47)" id="mpendienteD">  
						  <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/pendiente.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Pendiente iniciar Ruta 
								  </td>
								  <td style="width: 20%!important" align="center" >   									
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mpendienteFol">0</label></td>            
								  			<td width="50%" align="center" ><label class="lblcls" id="mpendiente">0</label></td>  
								  		</tr>
								  	</table>
								  </td>
								  
							  </tr>
						  </table>						 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mtransitoFol').text(),'1','transito',47)" id="mtransitoD">     
						  <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/transito.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Transito
								  </td>
								  <td style="width: 20%!important" align="center" >
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mtransitoFol">0</label></td>            
								  			<td width="50%" align="center" ><label class="lblcls" id="mtransito">0</label></td>  
								  		</tr>
								  	</table>   									
								  </td>
							  </tr>
						  </table>						 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mentregadoFol').text(),'2','entregado',47)" id="mentregadoD">   
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/entregado.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Entregado
								  </td>
								  <td style="width: 20%!important" align="center" >
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mentregadoFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mentregado">0</label></td>  
								  		</tr>
								  	</table>   									
								  	 
								  </td>
							  </tr>
						  </table>										 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mcanceladoFol').text(),'3','cancelado',47)" id="mcanceladoD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/cancelado.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Cancelado
								  </td>
								  <td style="width: 20%!important" align="center" >
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mcanceladoFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mcancelado">0</label></td>  
								  		</tr>
								  	</table>   									
								  	 
								  </td>
							  </tr>
						  </table>									 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mreprogramadoFol').text(),'8','reprogramado',47)" id="mreprogramadoD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/reprogramar.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Reprogramado
								  </td>
								  <td style="width: 20%!important" align="center" >   			
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mreprogramadoFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mreprogramado">0</label></td>  
								  		</tr>
								  	</table>   															
								  </td>
							  </tr>
						  </table>									 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mregionalFol').text(),'8','entregado en CDO regional',47)" id="mregionalD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important"> 
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/entregadocdoregional.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">
								  	Entregado CDO Regional
								  </td>
								  <td style="width: 20%!important" align="center" >
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mregionalFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mregional">0</label></td>  
								  		</tr>
								  	</table>   									
								  </td>
							  </tr>
						  </table>										 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mdevolucionFol').text(),'9','devolucion de factura',47)" id="mdevolucionD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/devolucion.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">
								  	Devolucion Factura
								  </td>
								  <td style="width: 20%!important" align="center" >
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mdevolucionFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mdevolucion">0</label></td>   
								  		</tr>
								  	</table>   									   									
								  </td>
							  </tr>
						  </table>								 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#menviosFol').text(),'5','confirmado por envios',47)" id="menviosD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/envios.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Conf. Admin Envios
								  </td>
								  <td style="width: 20%!important" align="center" >
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="menviosFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="menvios">0</label></td>  
								  		</tr>
								  	</table>   									
								  </td>
							  </tr>
						  </table>								 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mcorteFol').text(),'7','corte generado',47)" id="mcorteD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/corte.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Pendiente Recibir Credito
								  </td>
								  <td style="width: 20%!important" align="center" >   									
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mcorteFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mcorte">0</label></td>  
								  		</tr>
								  	</table>   									 
								  </td>
							  </tr>
						  </table>									 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mdevolucionFol').text(),'9','devolucion de factura',47)" id="mdevolucionD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/devolucion.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Devolucion Factura
								  </td>
								  <td style="width: 20%!important" align="center" >
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mdevolucionFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mdevolucion">0</label></td>  
								  		</tr>
								  	</table>   									    									
								  </td>
							  </tr>
						  </table>								 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#menviosFol').text(),'5','confirmado por envios',47)" id="menviosD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/envios.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Confirmado Admin Envios
								  </td>
								  <td style="width: 20%!important" align="center" >   									
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="menviosFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="menvios">0</label></td>  
								  		</tr>
								  	</table> 
								  </td>
							  </tr>
						  </table>								 
						  </div>
						</div>
						
					
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mcreditoFol').text(),'6','confirmado por credito',47)" id="mcreditoD">  
						   <table style="width: 100%">
							  <tr>
								  <td style="width: 10%!important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/envios.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">  									
								  	Confirmado por Aux Credito
								  </td>
								  <td style="width: 20%!important" align="center" >   									
								  		<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mcreditoFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mcredito">0</label></td>  
								  		</tr>
								  	</table>   
								  </td>
							  </tr>
						  </table>									 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#meccFol').text(),'2','confirmado por ecc',48)" id="meccD">  
						   <table style="width: 100%">
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/ecc.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">									
								  	Confirmado por ECC
								  </td>
								  <td style="width: 20%!important" align="center" >   
								  <table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="meccFol">0</label></td>            
								  			<td width="50%" align="center"><label class="lblcls" id="mecc">0</label></td>  
								  		</tr>
								  	</table>									
								  </td>
							  </tr>
						  </table>									 
						  </div>
						</div>
						
						<div class="card text-center cardcls">
						  <div class="card-footer text-muted" style="padding-top: 3px;padding-bottom: 3px;padding-right: 7px;cursor: pointer;" onclick="consultarmonitorgDetalle($('#mrelacionFol').text(),'3','relacion de cobranza',48)" id="mrelacionD">     
						   <table style="width: 100%"> 
							  <tr>
								  <td  style="width: 10% !important">
								  	<input type="image" onclick="showAlertProcesosSurtido()"data-toggle="modal" data-target="#exampleModal"name="imgDestino" id="ImgDestino" class="img-fluid"
								  	src="images/relacion.png"style="height: 30px; width: 30px; border-width: 0px;"value="MenuSurtido.jsp">
								  </td>  										
								  <td style="padding-left: 5px;width:70%!important"  align="left">						
								  	Relacion Cobranza Grenerada
								  </td>
								  <td style="width: 20%!important" align="center" >   									
								  	<table style="width: 100%">
								  		<tr>
								  			<td width="50%" align="center"><label class="lblclsSuccess" id="mrelacionFol">0</label></td>              
								  			<td width="50%" align="center"><label class="lblcls" id="mrelacion">0</label></td>  
								  		</tr> 
								  	</table>									   
								  </td>
							  </tr>
						  </table>								  
						  </div>    
						</div>
						
  </div>
  <div class="tableConsulta" style="    display: grid;place-items: center; "> 
  		<div class="table table-responsive" id="divTableMonitorg" style="width: 100%;height: 100%;margin-top: 10px;margin-left: 10px;display: none">
  		
  		</div>
  		<div style="     display: none;     justify-items: center;" id="cargandoV2">
  			<label style="     font-weight: bold;     font-size: 20px;     color: #0084ff;">Espere un momento por favor...</label>  
  			<div class="loader"></div>
  		</div>  
    </div>
</div>
	</div>  






       


























 
 
</div>
</div>
	</body>
</html>   