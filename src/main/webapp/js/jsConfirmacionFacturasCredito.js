//function opcionMostrarCredito()
//{
//	var nivel = $("#nivel").val()
//	$("#nav-home-tab").hide() 
//	$("#nav-profile-tab").hide()
//	$("#nav-contact-tab").hide()
//	switch(nivel)
//	{
//		case "1":
//			$("#nav-home-tab").show()    
//			$("#nav-home-tab").click()
//			break;
//		case "2":
//			$("#nav-profile-tab").show()
//			$("#nav-profile-tab").click()
//			break;
//		case "3":
//			$("#nav-contact-tab").show()
//			$("#nav-contact-tab").click()
//			break;
//		case "0":  
//			$("#nav-home-tab").show() 
//			$("#nav-home-tab").click();
//			$("#nav-profile-tab").show()
//			$("#nav-contact-tab").show()		
//			break;
//		default:
//			break;
//	}
//	
//}

let jsonCredito; 

async function prb(nameSerlvet, accion, obj)      
{
	let rsp;
	const f = await fetchDatas(nameSerlvet, accion,obj)  .then(resultado => 
	{ 
		rsp = resultado; 
	}) 
	.catch(error => {  
		alert(error);
	});
	return rsp; 
}
     
function fetchDatas(nameSerlvet,accion,obj)         
	{  
	return new Promise((resolve, reject) => 
	{
	  const sps = fetchData(nameSerlvet,accion,obj)          
	    setTimeout(() => {
	      const resultado = sps;    
	      resolve(resultado); 
	    }, 1000);
	});
} 
async function fetchData(nameSerlvet,accion,obj)       
{  
  try 
  { 
	  let formData = new FormData();
		formData.append('accion', accion);  
		formData.append('valores', obj);        
	const response1 = await fetch(nameSerlvet,{method: "POST", body: formData});  
	try
	{
		const responseData =await response1.json();
		return responseData;
	}
	catch(e)  
	{
		return "";     
	}
  } catch (error)            
  {
    console.error('Fetch error:', error); 
  }
}        

function executionCredito(servlet, accion, valores)
{
	alerta()
	var rsp = "";
	$.ajax({
		url : servlet,
		data : "accion="+accion+"&valores="+valores, 
		type : 'POST',
//		async: false,
		dataType : 'json',
		success : function(json) 
		{
			rsp = JSON.parse(json.replace(/=/g,":"))
			document.getElementById('cargando').style.display = 'none';    
		},
		error : function(xhr, status, error) 
		{
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		}
	});       
	return rsp; 
} 

function toggleButtons(selector) 
{ 
	$("#tituloBuscadoCredito").hide() 
	var toggleButtons = document.querySelectorAll('.'+selector);
	 toggleButtons.forEach(function(button) {
         button.classList.add('hideBtn');  
     });    
}  
function toggleButtonsAlternar() {
	var toggleButtons = document.querySelectorAll('.hideCredito');
	toggleButtons.forEach(function(button) {
		button.classList.toggle('hideBtn');
	});  
}
function enableButtons() {
	$("#tituloBuscadoCredito").show()   
    var toggleButtons = document.querySelectorAll('.hideCredito');
    toggleButtons.forEach(function(button) {
        button.classList.remove('hideBtn');
    }); 
}

function enableButtonsSelector(cls)     
{
    var toggleButtons = document.querySelectorAll('.'+cls);
    toggleButtons.forEach(function(button) {
        button.classList.remove('hideBtn');
    }); 
}

function validarCredito() 
{
	// divTableCortesPendientes
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty();
	jsonCredito= null;  
	toggleButtons('hideCredito')     	
	alertaUsr()      
	toggleButtons('hideCortePen')      
	toggleButtons('hideCreditoECC')       
	$("#warningCreditoCorte").hide()
	$("#facurasCredito").show()   
    $("#titleCredito").hide() 
    $("#txtCreditoCorte").val("")
    $("#tituloBuscadoCredito").text("") 
	clearDiv()  
	$("#mdlCreditoCorte").modal("toggle");
	$("input[name='txtCreditoCorte']").blur();
  
	consultarCortesPendientes();     
}

async function consultarCortesPendientes() 
{
	$('#divTableCortesPendientes').empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "58"; 
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";
	$("#esperaValidaCreditoCorte").show()
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)   
	{
		let json = JSON.parse(n.replace(/=/g,":"))
		let contenido =
			"<div style='width:100%;    font-weight: bold;' align = 'left'>FOLIOS DE CREDITO DISPONIBLES</div><table id='tb_articulosDetalleCredito' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+          
			"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
				"<tr id='tr_articulosDetalle' class='f33liberados'>"+
				"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO</label></div></th>"+                                   
				"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURAS</label></div></th>"+
				"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+ 
				"</tr>"+ 
			"</thead>"+
			"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
		for(let i=0; i < json.length ; i++)
		{
		 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;' name = '1520[]'>"; 		 
			  
			 contenido += "" +
			 	 "<td id='td_articulosDetalle0' align='center'  style= ' padding-bottom: 0px;padding-top: 0px;'  class = 'AltoTD bordesTd' ><div style='width: max-content'> "+json[i].folio_corte+" </div> </td>" +
			 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 0px;padding-top: 0px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].facturas+" </div></td>" + 
			 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 0px;padding-top: 0px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_corte+" </div></td>" +      
			"</tr>" ;
		}
		contenido +="</tbody>" +
		"</table>";
		$("#divTableCortesPendientes").append(contenido);
		$("#divTableCortesPendientes").show() 
		$("#esperaValidaCreditoCorte").hide() 
		enableButtonsSelector('hideCortePen')             
		$('#mdlCreditoCorte').on('shown.bs.modal', function () { $("#txtCreditoCorte").focus(); });
		$("#txtCreditoCorte").focus();    
		    
	}
	else
	{
		$("#esperaValidaCreditoCorte").hide() 
		$("#warningCreditoCorte").show();
		$("#warningCreditoCorteLb").text("No se encontraron folios de credito pendientes");
		$("#foco").focus();     
		             
	}
	
}


async function validarCorteCancelado(folio) 
{
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "45"; 
	obj.folio= folio;   
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";    
	const n = await prb('Execution', 'execute',JSON.stringify(obj));  
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{ 
		return "true";
	}
	else
	{
		return "false";  
	}
	
	
}


function procesarJSON(data) {
	  const counts = {};
	  let enProceso = null; // Variable para rastrear el mensaje en proceso

	  data.forEach(item => {
	    counts[item.estatusMsj] = (counts[item.estatusMsj] || 0) + 1;
	    if (["se encuentra en proceso de almacen", "se encuentra en proceso de ecc"].includes(item.estatusMsj)) {
	      enProceso = item.estatusMsj;
	    }
	  });

	  if (enProceso) {
	    return `El folio ${enProceso}`;
	  }

	  if (counts.correcto === data.length) {
	    return "true";
	  }

	  const pendientes = counts.pendiente || 0;
	  return pendientes ? `Hay ${pendientes} facturas pendientes` : `El folio ${Object.keys(counts).filter(key => key !== 'correcto' && key !== 'pendiente').join(', ')}`;
	}   
function consultaCorte(folio)       
{      
	$("#warningCreditoCorte").hide()  
	if (folio == '') return alert("Debe ingresar un folio de corte");  
	$("#esperaValidaCreditoCorte").show()
	jsonCredito= null;
//	alerta()        
	$('#divTableFacturas').empty();
	$('#divTableFacturasCredito').empty();
	$('#divTableFacturasEncargado').empty();  
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "44"; 
	obj.folio= folio;   
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";    
	$.ajax({    
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
//		async: false,
		dataType : 'json',
		success : function(json) 
		{
			$("#txtCreditoCorteFinal").val("");     
			rsp = JSON.parse(json.replace(/=/g,":"))
			$("#esperaValidaCreditoCorteFinal").hide()
			if(rsp.length>0)   
			{ 
				let msj = procesarJSONDelete(rsp);
				if (msj != 'true')      
				{         
					$("#esperaValidaCreditoCorte").hide()
					$("#warningCreditoCorteLb").text(msj)
					$("#warningCreditoCorte").show()
					$("#txtCreditoCorte").val("");
					$("#txtCorte").focus(); 
				}
				else
				{
					enableButtons()   
					toggleButtons('hideEscaneoCredito')       
					enableButtonsSelector('hideCreditoECC')    
					$("#esperaValidaCreditoCorte").hide()
					$("#mdlCreditoCorte").modal("hide");  
					consultarFacturasEscaneadasCredito();           
				}  
			}	
			else
			{   
				$("#esperaValidaCreditoCorte").hide()
				$("#warningCreditoCorteLb").text("No existe el folio de corte "+folio)
				$("#warningCreditoCorte").show()
				$("#txtCreditoCorte").val("");  
				$("#txtCorte").focus();   
			}
			    
		},
		error : function(xhr, status, error) 
		{
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
	  

}



function escanearFacturaCredito(factura) 
{  
	factura = factura.toLowerCase()
	alerta()
	var validate = validarFacturaCredito(factura);
	validate = (validate != 'true') ? validarFacturaCredito(factura.toUpperCase()) : validate;    
	if (validate == 'true') 
	{ 
		factura = validarFacturaCredito(factura.toUpperCase()) == 'true' ? factura.toUpperCase() : factura;     
		document.getElementById('cargando').style.display = 'block';     
	 	var obj = new Object() 
		obj.proceso = "181";
		obj.query = "5";    
		obj.estatus = "5"; 
		obj.estatus_tc = "6";
		obj.ode = obtenerValorJSON(jsonCredito, factura,"ode");
		obj.pedido = obtenerValorJSON(jsonCredito, factura,"pedido");     
		obj.operacion = "InsertarFactura";      
		obj.accion = "insertarFacturaAlmacen";
		obj.tipo = "insert";    
		obj.factura = ""+factura+"";
		 	$.ajax({
			url : "ConfirmacionFacturas",
			data : "accion=insertarFacturaAlmacen&valores="+JSON.stringify(obj),    
			type : 'POST',
			dataType : 'json', 
			success : function(json) 
			{
				rsp = JSON.parse(json.replace(/=/g,":"))
				document.getElementById('cargando').style.display = 'none';
				 if (rsp.length > 0)
				 {       
					consultarFacturasEscaneadasCredito();
					alertMsj('true', "Factura escaneada correctamente")  
					$("#txtFacturaCredito").val(""); 
					document.getElementById("txtFacturaCredito").focus();	 
				 }
				 else  
				 {
					alertMsj('false', "No se pudo insertar la factura: "+factura+".") 
					$("#txtFacturaCredito").val(""); 
					document.getElementById("txtFacturaCredito").focus(); 
				 }      
			},
			error : function(xhr, status, error) 
			{
				if (xhr.status === 200) 
				{
					alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
					window.location.href = '/ConfirmacionFacturas/';
				} else
					alert('Error en el proceso.')
					window.location.href = '/ConfirmacionFacturas/';
			}
		});  
	}
	else
	{
		document.getElementById('cargando').style.display = 'none';
		alertMsj('warning',validate) 
		$("#txtFacturaCredito").val(""); 
		 document.getElementById("txtFacturaCredito").focus();  
	}
}

function validarFacturaCredito(factura)
{
	if(jsonCredito == null) return 'Consulte un folio de corte' 
	if (validarValorJSON(jsonCredito, factura)) {    
		  return 'true'
		} else { 
			return 'La factura '+factura+' no esta disponible, escanee alguna de las mostradas en la tabla';  
		}
}
function validarValorJSON(json, factura) {
	  return json.some(item => item.factura === factura);
	}


function obtenerValorJSON(json, factura,valor) 
{
	console.log(factura)
	console.log(json) 
	  let itemEncontrado = json.find(item => item.factura === factura);
	   
	  console.log(itemEncontrado ? itemEncontrado[valor] : null)
	  return itemEncontrado ? itemEncontrado[valor] : null;    
}
 

function obtenerMensajeCredito(json) 
{
	var msj = ""; 
	switch (json[0].estatus) 
	{
	case "1":
		msj = "true"       
		break;
	case "4":
		msj = "Factura "+json[0].factura+"  se encuentra en area de Almacen"
		break;
	case "0":
		msj = "Factura "+json[0].factura+"  no se ha escaneado por el area de Almacen" 
		break;
	case "2":
		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente";  
		break;
	case "5":
		msj = "true" 
		break;
	case "6": 
		msj = "Factura "+json[0].factura+" se encuentra en proceso de encargada de credito-agente"
		break;   	
	case "3":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por encargada de credito-agente"
		break;
	case "7":   
		msj = "Factura "+json[0].factura+"  se encuentra en area de Almacen"
		break; 
	case "8":   
		msj = "true"
		break;   	
	case "9":
		msj = "Factura "+json[0].factura+" se encuentra en proceso de encargada de credito-agente"
		break;   	
	default:
		msj = "Factura "+json[0].factura+"  no se ha escaneado por el area de Almacen"    
		break;
	}
	
	return msj; 
}

function consultarFacturasEscaneadasCredito()  
{
//	$("#mdlCreditoCorte").modal("hide"); 
	$('#divTableCortesPendientes').empty();
	$("#tituloBuscadoCredito").text("")
	$("#tituloBuscadoCredito").text("FOLIO DE CREDITO: "+$("#txtCreditoCorte").val())  
	jsonCredito= null;   
	alerta()  
	$('#divTableFacturas').empty();
	$('#divTableFacturasCredito').empty();
	$('#divTableFacturasEncargado').empty();  
	document.getElementById('cargando').style.display = 'block';  	        
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = ""+(($("#txtCreditoCorte").val() == "999999") ? 51 : 12)+"";    
	obj.estatus = "1,8";         
	obj.folio = $("#txtCreditoCorte").val();      
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";    
	$.ajax({    
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
//		async: false,
		dataType : 'json',
		success : function(json)        
		{
				document.getElementById('cargando').style.display = 'none'; 
			rsp = JSON.parse(json.replace(/=/g,":"))
			if(rsp.length>0)
			{ 
				jsonCredito = rsp; 
				$("#facurasCredito").show()   
				$("#titleCredito").show()
				llenarTablaPedidosDisponiblesCredito(rsp);
				document.getElementById("txtFacturaCredito").focus();
				enableButtons()     
				toggleButtons('hideCreditoECC')    
			}	    
			else
			{   
				$("#facurasCredito").show()     
				$("#titleCredito").hide()
				clearDiv()   
//				document.getElementById('cargando').style.display = 'none';
				alertMsj('warning', "No se encontraron facturas en estatus pendiente") 
				enableButtons()   
				toggleButtons('hideEscaneoCredito')          
				enableButtonsSelector('hideCreditoECC')                
			}
			    
		},
		error : function(xhr, status, error) 
		{
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
}

function consultarFacturasEscaneadasCreditoCanceladas()  
{
	$("#txtCreditoCorte").val("")
	$("#warningCreditoCorte").hide()
	$("#esperaValidaCreditoCorte").show()
	jsonCredito= null;
	alerta()
	$('#divTableFacturas').empty();
	$('#divTableFacturasCredito').empty();
	$('#divTableFacturasEncargado').empty();  
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "51"; 
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";    
	$.ajax({    
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
//		async: false,
		dataType : 'json',
		success : function(json) 
		{
			$("#esperaValidaCreditoCorte").hide()
			$("#txtCreditoCorteFinal").val("");
			rsp = JSON.parse(json.replace(/=/g,":"))
			if(rsp.length>0)
			{ 
				$("#esperaValidaCreditoCorte").hide()
				$("#mdlCreditoCorte").modal("hide");   
				jsonCredito = rsp; 
				$("#facurasCredito").show()   
				$("#titleCredito").show()
				llenarTablaPedidosDisponiblesCredito(rsp);  
				document.getElementById("txtFacturaCredito").focus();
				$("#txtCreditoCorte").val("999999")
			}	
			else
			{   
				$("#facurasCredito").show()   
				$("#titleCredito").hide()
				clearDiv() 
				$("#esperaValidaCreditoCorte").hide() 
				$("#warningCreditoCorteLb").text("No hay facturas canceladas por ecc") 
				$("#warningCreditoCorte").show()
				$("#txtCreditoCorte").val("");  
				$("#txtCorte").focus();   
			}
			    
		},
		error : function(xhr, status, error) 
		{
			$("#esperaValidaCreditoCorte").hide() 
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
}



function llenarTablaPedidosDisponiblesCredito(json) 
{
	$('#divTableFacturasCredito').empty();
	$('#customBodyCredito').empty();
	$('#divFilterCredito').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalleCredito' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;   background:white; margin-bottom: 0px;' >"+    
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CDO</label></div></th>"+                                   
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ECC</label></div></th>"+  
//							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ODE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+ 
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CORTE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>USUARIO ALMACEN</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA ALMACEN</label></div></th>"+ 
//							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMP. COBRADO</label></div></th>"+ 
//							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>USUARIO CREDITO</label></div></th>"+
//							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA CREDITO</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	var aux = 0;
	for(let i=0; i < json.length ; i++)
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;' name = '1520[]'>"; 		 
		  
		 contenido += "" +
		 	 "<td id='td_articulosDetalle0' align='center'  style= ' padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd' ><div style='width: max-content'> "+json[i].cdo+" </div> </td>" +
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" + 
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].factura+" </div></td>" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd' title='"+json[i].cliente+"'><div style='width: max-content'>  "+json[i].nombreCliente+" </div></td>" +        
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd' title='"+json[i].nombre_agente+"'><div style='width: max-content'> "+json[i].agente+" </div></td>" +   
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd' title='"+json[i].nombreEncargado+"'><div style='width: max-content' > "+json[i].encargado+" </div></td>" +        
		 	"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folio_corte+" </div></td>" + 
		 	"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd' title='"+json[i].cve_usu_almacenNombre+"'> <div style='width: max-content'> "+json[i].cve_usu_almacen+" </div></td>" +       
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].hora_almacen+" "+json[i].fecha_almacen+" </div></td>" +     
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>"+(json[i].id_estatus == 8 ?  'Confirmada Almacen' : json[i].descripcion.substring(0,18))+" </div></td>" +              
		"</tr>" ;
		 if (json[i].id_estatus == 5)     
		 {
			 aux++;
		 }  
	}
//	$("#facturasCorrectas").val(aux)
	contenido +="</tbody>" +
	"</table>";
	$("#divTableFacturasCredito").append(contenido);
	$("#facurasCredito").show()  
	aplicarEstiloTablaConfirmacionFacturasCredito();
} 



function enviarFacturaCredito() 
{
	alerta()                
	$("#fls").text("");  
	$("#txtCreditoCorteFinal").val(""); 
	$("#warningCreditoCorteLbFinal").text("")      
	$("#warningCreditoCorteFinal").hide()
	$("#divFolios").hide()      
	$("#mdlCreditoCorteFinales").modal('hide');   
	consultaCorteAenviar($("#txtCreditoCorte").val())             
//	$('#mdlCreditoCorteFinal').on('shown.bs.modal', function () { $("#txtCreditoCorteFinal").focus(); });   
}


async function deleteCorte(folio)
{
	alerta()  
	var obj = new Object()   
	obj.proceso = "181";
	obj.query = "43";
	obj.folio =  $("#txtCreditoCorte").val();  
	obj.operacion = "UpdateFacturas";
	obj.accion = "updateFacturas";
	obj.tipo = "insert";    
	$.ajax({
		url : "ConfirmacionFacturas",
		data : "accion=enviarFacturas&valores="+JSON.stringify(obj),    
		type : 'POST',
		dataType : 'json', 
		success : function(json) 
		{     
			rsp = JSON.parse(json.replace(/=/g,":"))
			document.getElementById('cargando').style.display = 'none';
			 if (rsp.length > 0)  
			 {       
				 jsonCredito= null;
				 $("#titleCredito").hide()
				 $('#divTableFacturas').empty();
				$('#divTableFacturasCredito').empty();  
				$('#divTableFacturasEncargado').empty();
				clearDiv()
				alertMsj('true',"Folio de corte "+folio+" cancelado correctamente")
				$("#txtFacturaCredito").val(""); 
				$("#txtFacturaCancelarCredito").val(""); 
				document.getElementById("txtFacturaCredito").focus();	 
				
			 }
			 else  
			 {
				 alertMsj('warning',"No se pudo cancelar el folio de corte "+folio+", intente nuevamente.")
				$("#txtFacturaCredito").val("");
				$("#txtFacturaCancelarCredito").val("");
				document.getElementById("txtFacturaCredito").focus(); 
			 }      
		},
		error : function(xhr, status, error) 
		{
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		}
	});
}
function procesarJSONDelete(data) {
	  const counts = {};
	  let enProceso = null; // Variable para rastrear el mensaje en proceso

	  data.forEach(item => {
	    counts[item.estatusMsj] = (counts[item.estatusMsj] || 0) + 1;
	    if (["se encuentra en proceso de almacen", "se encuentra en proceso de ecc"].includes(item.estatusMsj)) {
	      enProceso = item.estatusMsj;
	    }
	  });

	  if (enProceso) {
	    return `El folio ${enProceso}`;
	  }

	  if (counts.correcto === data.length) {
	    return "true";
	  }

	  const pendientes = counts.pendiente || 0;
	  return pendientes ? "true" : `El folio ${Object.keys(counts).filter(key => key !== 'correcto' && key !== 'pendiente').join(', ')}`;  
	}   

async function consultaCorteAenviar(folio)         
{
//     
//	     
	$("#divTableDetalleCredito").empty();
//	 $("#mdlCreditoCorteFinales").modal("toggle");        
		$("#warningCreditoCorteLbFinal").text("")  
		$("#warningCreditoCorteFinal").hide()
		$("#warningCreditoCorteFinal").hide()     
		$("#btnSendCredito").hide();
		$("#btnRegresarFolioCredito").hide();
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "44"; 
		obj.folio= folio;   
		obj.tipo = "select";
		obj.operacion = "consultaFacturas";
		document.getElementById('cargando').style.display = 'block'; 
		const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
		if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
		{
				let json = JSON.parse(n2.replace(/=/g,":"));
				document.getElementById('cargando').style.display = 'none';
				$("#esperaValidaCreditoCorteFinal").hide()
				    let msj = procesarJSON(json);
				console.log(msj) 
				if (msj != 'true') 
				{
					alertMsj('warning', "No se puede enviar a ECC. "+msj)
					
				}
				else
				{
					if(json.length>0)   
					{ 
						$("#mdlCreditoCorteFinales").modal('hide');                        
						$("#txtCreditoCorteFinal").val("");      
						$("#mdlRegresarFolioCredito").modal('toggle')             
						pintarDetalle();  
					}	
					else
					{   
						$("#warningCreditoCorteLbFinal").text("No existe el folio de corte "+folio)
						$("#warningCreditoCorteFinal").show()   
					}    
					
				}
				    
			}else
			{   
					$("#warningCreditoCorteLbFinal").text("No existe el folio de corte "+folio)
				$("#warningCreditoCorteFinal").show()   
			}
	}


async function consultaCorteACancelar(folio)         
{
//     
//	     
//	 $("#mdlCreditoCorteFinales").modal("toggle");
	$("#divTableDetalleCredito").empty();
		$("#warningCreditoCorteLbFinal").text("")  
		$("#warningCreditoCorteFinal").hide()
		$("#warningCreditoCorteFinal").hide()     
		$("#btnSendCredito").hide();
		$("#btnRegresarFolioCredito").hide();
		$("#esperaValidaDetalleCredito").show()    
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "44"; 
		obj.folio= folio;   
		obj.tipo = "select";
		obj.operacion = "consultaFacturas";
		document.getElementById('cargando').style.display = 'block'; 
		const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
		if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
		{
				let json = JSON.parse(n2.replace(/=/g,":"));
				document.getElementById('cargando').style.display = 'none';
				$("#esperaValidaCreditoCorteFinal").hide()
				if(json.length>0)   
				{ 
					$("#mdlCreditoCorteFinales").modal('hide');                        
					$("#txtCreditoCorteFinal").val("");      
					$("#mdlRegresarFolioCredito").modal('toggle')             
					procesarInfoCancelacion();  
				}	
				else
				{    
					$("#warningCreditoCorteLbFinal").text("No existe el folio de corte "+folio)
					$("#warningCreditoCorteFinal").show()   
				}    
		}
		else
		{   
				$("#warningCreditoCorteLbFinal").text("No existe el folio de corte "+folio)
			$("#warningCreditoCorteFinal").show()   
		}
	}

async function procesarInfoCancelacion()   
{
	$("#divTableDetalleCredito").empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "60";       
	obj.folio= $("#txtCreditoCorte").val();     
	obj.tipo = "select";           
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n2.replace(/=/g,":"))
		llenarTablaDetalleCredito(rsp); 
		$("#esperaValidaDetalleCredito").hide()   
		$("#btnSendCredito").hide();        
		$("#btnRegresarFolioCredito").show();  
		$("#mdlRegresarFolioCreditoLb").text("DETALLE DE FACTURAS QUE SE CANCELARAN. FOLIO DE CREDITO: "+$("#txtCreditoCorte").val())     
	}
	else   
	{
		$("#esperaValidaDetalleCredito").hide() 
	}
}
        
async function confirmaRegresarAlmacen() 
{
	if ($("#txtCreditoCorte").val() == '') return alert("No se puede procesar la informacion, intente nuevamente");
	$("#esperaValidaDetalleCredito").show();  
	$("#warningDetalleCredito").hide()
	$("#dangerDetalleCredito").hide()
	$("#btnRegresarFolioCredito").hide()
	var obj = new Object()      
	obj.proceso = "181";
	obj.query = "43";
	obj.folio =  $("#txtCreditoCorte").val();  
	obj.operacion = "UpdateFacturas";
	obj.accion = "updateFacturas";
	obj.tipo = "select";       
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	$("#esperaValidaDetalleCredito").hide();        
	$("#segundo").html("5");   
	$("#ContSegundo").show();
	$("#warningDetalleCredito").show()   
	$("#warningDetalleCreditoLb").text("Se regreso correctamente al area de envios el folio de credito "+$("#txtCreditoCorte").val());       
	$('#divTableDetalleCredito').empty();  
		var segundo = 5;     
		var intervalId = setInterval(function() {   
		    $("#segundo").html(segundo);  
		    segundo--;
		    if (segundo < 0) 
		    {
		    	clearInterval(intervalId);
		    	$("#ContSegundo").hide();
				$("#esperaValidaDetalleCredito").hide()  
				$("#warningDetalleCredito").hide()
				$("#dangerDetalleCredito").hide()
				$("#mdlRegresarFolioCredito").modal('hide')           
				validarCredito();      
		    }
		}, 1000);   
}

async function  pintarDetalle()   
{
	alerta() 
	$('#divTableDetalleCredito').empty();
	$("#esperaValidaDetalleCredito").show()
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "56";
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	const n3 = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n3.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n3.replace(/=/g,":"))) : false)             
	{	  
		 	
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "60";       
		obj.folio= $("#txtCreditoCorte").val();     
		obj.tipo = "select";           
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
		if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
		{
			let json2 = JSON.parse(n3.replace(/=/g,":"))
			rsp = JSON.parse(n2.replace(/=/g,":")) 
			$("#lblTotalEnviarCredito").text("VALIDE QUE ENTREGUE "+rsp.length+" FACTURAS A LOS ECC")    
			llenarTablaDetalleCredito(rsp); 
			$("#esperaValidaDetalleCredito").hide()   
			$("#btnSendCredito").show();
			$("#btnRegresarFolioCredito").hide();  
			$("#mdlRegresarFolioCreditoLb").text("SE ENVIARAN  FACTURAS A ECC. SE GENERARA EL FOLIO DE CREDITO: "+json2[0].folio)   
			$("#folioConfirmacion").val(json2[0].folio)   
			
		}
		else   
		{
			$("#esperaValidaDetalleCredito").hide() 
//			alert("No se encontraron facturas")  
//			$("#mdlAlmacenFolioKey").modal('toggle')       
//			$("#mdlRegresarFolioChofer").modal('hide')
		}
	} 
}




async function enviarFacturaCreditos()
{
	alerta()
	$("#enviarAlmacen").hide()
	$("#enviarCredito").hide()
	$("#enviarEncargado").hide()
	var table = $("#facturasCorrectas").val()
    var obj = new Object()      
		obj.proceso = "181";  
//		obj.estatus = "1,4";  
//		obj.query = "13";       
		obj.query = "22";       
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
		document.getElementById('cargando').style.display = 'block';
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
	{
		let json = JSON.parse(n.replace(/=/g,":"))
		document.getElementById('cargando').style.display = 'none';    
		$("#mdlEnviar").modal("toggle");   
		$("#titleEnvio").text("SE ENVIARAN "+json.length+" FACTURAS A LOS ENCARGADOS");    
		$("#lblFacturas").text(json.map(item => item.factura).join(", "));
		$("#enviarCredito").show()
	}	
	else
	{
		document.getElementById('cargando').style.display = 'none';
		alertMsj('warning',"No hay facturas disponibles para enviar a encargado de credito")
	}
 	
 	  
} 



function llenarTablaDetalleCredito(json)   
{
	$("#divTableDetalleCredito").empty();
	let contenido = '';
//	const foliosUnicosArray = [...new Set(json.map(item => item.folio))];    
//	$("#btnRegresarFolio").val(foliosUnicosArray)
//	for (var j = 0; j < foliosUnicosArray.length; j++) 
//	{
		contenido += 
			" <div style = 'width:99%;max-height: 100%;!important;margin-bottom: 20px;' align='left' class='mv'>" +    
//			"<p style ='    margin-bottom: 0px;     background: black;     color: white; '>FOLIO DE RUTA: <label style='font-weight: bold;    margin-bottom: 0px;'>"+foliosUnicosArray[j]+"</label> FACTURAS: <label style= '    font-weight: bold;    margin-bottom: 0px;' >"+json.filter(item => item.folio === foliosUnicosArray[j]).length+"</label>" +
//					" CHOFER: <label style='    font-weight: bold;    margin-bottom: 0px;' >"+obtenerValueJson(json,foliosUnicosArray[j],"folio",'chofer').substring(0,20)+"</label> TIPO: <label style='    font-weight: bold;    margin-bottom: 0px;' >"+obtenerValueJson(json,foliosUnicosArray[j],"folio",'tipo')+"</label></p> " +                                          
			"<table id='tb_articulosDetalle' class='table  table-striped table-hover table-bordered mv' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  background:white; margin-bottom: 0px; ' >"+     
			"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
			"<tr id='tr_articulosDetalle' class='f33liberados'>"+
			"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ODE</label></div></th>"+
			"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
			"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMP. COBRADO</label></div></th>"+ 
			"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CP</label></div></th>"+
			"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+      
			"</tr>"+ 
			"</thead>"+
			"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;     
		for(let i=0; i < json.length ; i++)
		{
//			if(json[i].folio == foliosUnicosArray[j])
//			{
				contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
				contenido += "" +
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" +    
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ode+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe_cobrado)+" </div></td>" +    
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].condicion+" </div></td>" +
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 0px;padding-top: 0px;    vertical-align: middle'  class = 'AltoTD bordesTd'><div style='width: max-content;    padding-left: 5px;padding-right: 5px;"+(json[i].estatus == 'Escaneado Credito' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"'> "+json[i].estatus+" </div></td>" +              
				"</tr>" ;
//			} 
		}  
		contenido +="</tbody>" +
		"</table> </div>";    
//	}  
	
	
	$("#divTableDetalleCredito").append(contenido); 
	$("#divTableDetalleCredito").show()
	const divTableDetalleCredito = document.getElementById("divTableDetalleCredito");
	const distanciaDesdeElInicio = divTableDetalleCredito.getBoundingClientRect().top;
	const alturaDeseada = window.innerHeight - document.getElementById("divTableDetalleCredito").getBoundingClientRect().top;
	document.getElementById("divTableDetalleCredito").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio) + "px ";
	
} 


async function detalleEscaneoCredito()     
{
	alerta()     
	$('#divPrevio').empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "22";      
	obj.tipo = "select";        
	obj.folio= $("#txtCreditoCorte").val();          
	obj.operacion = "consulta previo credito";   
	document.getElementById('cargando').style.display = 'block';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{ 
		let json = JSON.parse(n.replace(/=/g,":"))
		llenarMdlCredito(json);
	}
	else
	{
		document.getElementById('cargando').style.display = 'none';
		console.log("s" )
		alertMsj('warning',"No se encontraron facturas escaneadas")
	}
}  
  
let totalPrevio = 0;
function llenarMdlCredito(json)
{
	totalPrevio = 0;
	document.getElementById('cargando').style.display = 'none';    
	$("#mdlPrevio").modal("toggle");
	$("#lblPrevio").text("PREVIO FACTURAS ESCANEADAS");
	let contenido = 
		"<table id='tb_articulosDetallePrevio' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+
		"<thead  id='thd_articulosDetallePrevio' style='background-color:#0054A2; color:white; display:none' >" +
		"<tr id='tr_articulosDetalle' class='f33liberados'>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO RUTA</label></div></th>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO CREDITO</label></div></th>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
		"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+  
		"</tr>"+ 
	"</thead>"+
	"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	let aux = 0; 
	console.log(json)   
	for(let i=0; i < json.length ; i++) 
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;display:none' name = '"+json[i].encargado+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;display:none' name = '"+json[i].encargado+"[]'>";    		 
		  
		 contenido += "" +
		 	"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].folio_ruta+" </div></td>" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].folio+" </div></td>" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+(json[i].cliente.substring(0,20))+" </div></td>" +                         
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
		"</tr>" ;
		 totalPrevio++;
		 aux++;  
		 if (json[i].encargado != (i == (json.length-1) ? 'as': json[i+1].encargado))       
//			 if (json[i].encargado !=  json[i+1].encargado)     
		 {
			 contenido += "<tr id = 'tr_articulosDetalle' style='background: black;color:white' onclick=ocultarTD('"+json[i].encargado+"')>";          		 
			 contenido += "" +
//			 	 "<td id='td_articulosDetalle2' align='right' colspan='4'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>TOTAL FACTURAS AGENTE "+json[i].agente+" </div></td>" +
			 	 "<td id='td_articulosDetalle2' align='left' colspan='3'  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 10px;padding-right: 0px;     padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'> ECC "+json[i].encargado+"  "+json[i].nombre+"</div></td>" +      
			 	"<td id='td_articulosDetalle2' align='center' colspan='1'  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'> FACTURAS: "+contarEncargados(json,json[i].encargado)+"</div></td>" +
			 	 "<td id='td_articulosDetalle2' align='left' colspan='2'  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> <button type='button' id='btn' class='btn btn-info' style ='    padding-top: 0px;padding-bottom: 0px;padding-right: 4px;font-size: 13px;padding-left: 4px;'>DETALLE</button> </div></td>" +  
			 	 
//			 	 "<td id='td_articulosDetalle2' align='center' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>FACTURAS: "+aux+" </div></td>" +         
			 	 
			"</tr>" ;
			 aux = 0; 
		 }  
	}  
	$("#titlePrevio").text("TOTAL DE FACTURAS: "+totalPrevio)       
	contenido +="</tbody>" +
	"</table>";
	$("#divPrevio").append(contenido);       
//	aplicarEstiloTablaConfirmacionFacturasPrevio();   
}

function contarEncargados(jsonData, encargado) {
	  return jsonData.filter(item => item.encargado === encargado).length;
	}

function ocultarTD(agene)     
{
	
	if($('tr[name="'+agene+'[]').css('display') == 'none')
	{
		$('tr[name="'+agene+'[]"]').show();
		$("#thd_articulosDetallePrevio").show()
	}
	else
	{
		$('tr[name="'+agene+'[]"]').hide();
		$("#thd_articulosDetallePrevio").hide()  
	}
}



function sendFacturasEncargado()
{
	$("#dangerDetalleCredito").hide()
	$("#warningDetalleCredito").hide()   
	
	if ($("#txtCreditoCorte").val() == '') return alert("Debe consultar un folio de corte")        
	let text = "CONFIRME PARA ENVIAR FACTURAS A ECC";    
	if (confirm(text) == true) 
	{
		
		$("#ContSegundo").show();
		$("#lblTotalEnviarCredito").show();
		$("#btnSendCredito").hide();
		$("#btnRegresarFolioCredito").hide();   
		var segundo = 5;     
		var intervalId = setInterval(function() {
		    $("#segundo").html(segundo);  
		    segundo--;
		    if (segundo < 0) 
		    {
		    	clearInterval(intervalId);
		    	$("#ContSegundo").hide();
		    	$("#lblTotalEnviarCredito").hide();
		    	$("#btnSendCredito").hide()
				$("#esperaValidaDetalleCredito").show()
				var obj = new Object()   
				obj.proceso = "181";
				obj.query = "17";
				obj.operacion = "UpdateFacturas";
				obj.estatus_nuevo = "2"; 
				obj.estatus = "5";         
				obj.estatus_tc = "6";    
				obj.folio_corte= $("#txtCreditoCorte").val();     
				obj.accion = "updateFacturas";
				obj.tipo = "insert";    
			 	$.ajax({
					url : "ConfirmacionFacturas",
					data : "accion=enviarFacturas&valores="+JSON.stringify(obj),    
					type : 'POST',
					dataType : 'json', 
					success : function(json) 
					{ 
						rsp = JSON.parse(json.replace(/=/g,":"))
						$("#esperaValidaDetalleCredito").hide()
						 if (rsp.length > 0)
						 {       
							 	$('#divTableDetalleCredito').empty();     
								$("#warningDetalleCredito").show()
								$("#warningDetalleCreditoLb").text("SE ENVIARON CORRECTAMENTE LAS FACTURAS")
								$("#segundo").html("5");        
								$("#ContSegundo").show()
								segundo = 5;     
								intervalId = setInterval(function() {
								    $("#segundo").html(segundo);  
								    segundo--;
								    if (segundo < 0) 
								    {
								    	clearInterval(intervalId);
								    	$("#ContSegundo").hide();
										$("#esperaValidaDetalleCredito").hide()  
										$("#warningDetalleCredito").hide()
										$("#dangerDetalleCredito").hide()
										$("#mdlRegresarFolioCredito").modal('hide')           
										validarCredito();                         
								    }
								}, 1000);  
						 }
						 else  
						{
							$("#dangerDetalleCredito").show()
							$("#dangerDetalleCreditoLb").text("NO SE PUDIERON ENVIAR LAS FACTURAS, INTENTE NUEVAMENTE.") 
						}      
					},
					error : function(xhr, status, error) 
					{
						$("#esperaValidaProcSurtFac").hide()
						$("#mdlEnviar").modal("hide");
						if (xhr.status === 200) 
						{
							alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
							window.location.href = '/ConfirmacionFacturas/';
						} else
							alert('Error en el proceso.')
							window.location.href = '/ConfirmacionFacturas/';
					}
			 	});
		    }
		}, 1000);  
	} 
}



function cancelarFacturaCredito(factura)
{
	if (factura == '') return alert("Debe ingresar una factura")
	alerta()
	document.getElementById('cargando').style.display = 'block';     
	var obj = new Object() 
	obj.proceso = "181";
	obj.query = "2";  
	obj.tipo = "select";
	obj.operacion = "validaExistenciaFactura"; 
	obj.factura = ""+factura+""; 
	$.ajax({    
	url : "Execution",    
	data : "accion=execute&valores="+JSON.stringify(obj), 
	type : 'POST',   
	dataType : 'json',   
	success : function(json) 
	{
		document.getElementById('cargando').style.display = 'none'; 
		rsp = JSON.parse(json.replace(/=/g,":"))
		if (rsp.length > 0)
		{
			var msj = obtenerMensajeCancelarCredito(rsp)
			 if (msj == 'true') 
			 {
				 
				 var obj = new Object()   
					obj.proceso = "181";
					obj.query = "59";   
					obj.operacion = "UpdateFacturas";
					obj.estatus_nuevo = "8";
					obj.folio = $("#txtCreditoCorte").val();      
					obj.estatus_nuevo_tc = "7";   
					obj.estatus = "5";     
					obj.accion = "updateFacturas";
					obj.tipo = "insert";    
					obj.factura = ""+factura+"";

				 	$.ajax({
						url : "ConfirmacionFacturas",
						data : "accion=enviarFacturas&valores="+JSON.stringify(obj),    
						type : 'POST',
				//		async: false,
						dataType : 'json', 
						success : function(json) 
						{     
							rsp = JSON.parse(json.replace(/=/g,":"))
							document.getElementById('cargando').style.display = 'none';
							 if (rsp.length > 0)
							 {       
								 consultarFacturasEscaneadasCredito();
								 alertMsj('true',"Facturas cancelada correctamente")
								$("#txtFacturaCredito").val(""); 
								$("#txtFacturaCancelarCredito").val(""); 
								document.getElementById("txtFacturaCredito").focus();	 
							 }
							 else  
							 {
								 alertMsj('danger',"No se pudo cancelar la factura, intente nuevamente.")
								$("#txtFacturaCredito").val("");
								$("#txtFacturaCancelarCredito").val("");
								document.getElementById("txtFacturaCredito").focus(); 
							 }      
						},
						error : function(xhr, status, error) 
						{
							if (xhr.status === 200) 
							{
								alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
								window.location.href = '/ConfirmacionFacturas/';
							} else
								alert('Error en el proceso.')
								window.location.href = '/ConfirmacionFacturas/';
						}
					});
					
			 }
			 else 
			 {
				 alertMsj('warning',msj)
				 $("#txtFacturaCancelarCredito").val(""); 
					document.getElementById("txtFacturaCancelarCredito").focus();      
			 }
		}      
		else
		{
			alertMsj('warning',"No se encontraron facturas escaneadas previamente")
			$("#txtFacturaCredito").val(""); 
			 document.getElementById("txtFacturaCancelarCredito").focus();
		}
		    
	},
	error : function(xhr, status, error) 
	{
		if (xhr.status === 200) 
		{
			alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
			window.location.href = '/ConfirmacionFacturas/';
		} else
			alert('Error en el proceso.')
			window.location.href = '/ConfirmacionFacturas/';
	} 
	});       
}


function cancelarFacturaCreditoCorte(folio)
{
	alerta()
		document.getElementById('cargando').style.display = 'block';     
		var obj = new Object() 
		obj.proceso = "181";
		obj.query = "41";  
		obj.tipo = "select";
		obj.operacion = "validaExistenciaFactura"; 
		obj.folio = ""+folio+""; 
		$.ajax({    
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
		dataType : 'json',   
		success : function(json) 
		{
			document.getElementById('cargando').style.display = 'none'; 
			rsp = JSON.parse(json.replace(/=/g,":"))
			if (rsp.length > 0 && rsp[0].facturas != '0')   
			{
				console.log(rsp)   
				var obj = new Object()   
				obj.proceso = "181";
				obj.query = "43";
				obj.folio = ""+folio+"";
				obj.operacion = "UpdateFacturas";
				obj.accion = "updateFacturas";
				obj.tipo = "insert";    
				$.ajax({
					url : "ConfirmacionFacturas",
					data : "accion=enviarFacturas&valores="+JSON.stringify(obj),    
					type : 'POST',
					dataType : 'json', 
					success : function(json) 
					{     
						rsp = JSON.parse(json.replace(/=/g,":"))
						document.getElementById('cargando').style.display = 'none';
						 if (rsp.length > 0)
						 {       
							 jsonCredito= null;
							 $("#titleCredito").hide()
							 $('#divTableFacturas').empty();
							$('#divTableFacturasCredito').empty();  
							$('#divTableFacturasEncargado').empty();
							clearDiv()
							alertMsj('true',"Folio de corte "+folio+" cancelado correctamente")
							$("#txtFacturaCredito").val(""); 
							$("#txtFacturaCancelarCredito").val(""); 
							document.getElementById("txtFacturaCredito").focus();	 
							
						 }
						 else  
						 {
							 alertMsj('danger',"No se pudo cancelar el folio de corte "+folio+", intente nuevamente.")
							$("#txtFacturaCredito").val("");
							$("#txtFacturaCancelarCredito").val("");
							document.getElementById("txtFacturaCredito").focus(); 
						 }      
					},
					error : function(xhr, status, error) 
					{
						if (xhr.status === 200) 
						{
							alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
							window.location.href = '/ConfirmacionFacturas/';
						} else
							alert('Error en el proceso.')
							window.location.href = '/ConfirmacionFacturas/';
					}
				});
			}      
			else
			{
				var obj = new Object() 
				obj.proceso = "181";
				obj.query = "42";  
				obj.tipo = "select";
				obj.operacion = "validaExistenciaFactura"; 
				obj.folio = ""+folio+""; 
				$.ajax({    
				url : "Execution",    
				data : "accion=execute&valores="+JSON.stringify(obj), 
				type : 'POST',   
				dataType : 'json',   
				success : function(json) 
				{
					document.getElementById('cargando').style.display = 'none'; 
					rsp = JSON.parse(json.replace(/=/g,":"))
					console.log("2: ");
					console.log(rsp)
					if (rsp.length > 0)
					{	
						if (rsp[0].msj != 'encargado') 
						{
							alertMsj('warning',"No se pudo cancelar, el folio de corte "+folio+" se encuentra confirmado por credito.")
							$("#txtFacturaCredito").val(""); 
							 document.getElementById("txtFacturaCancelarCredito").focus();	
						}
						else
						{
							alertMsj('warning',"No se pudo cancelar, el folio de corte "+folio+" ya sido cancelado anteriormente.")
							$("#txtFacturaCredito").val(""); 
							 document.getElementById("txtFacturaCancelarCredito").focus();
						}
					}
					else
					{
						alertMsj('warning',"No existe el folio de corte "+folio+" ") 
						$("#txtFacturaCredito").val(""); 
						 document.getElementById("txtFacturaCancelarCredito").focus();
					}
				},
				error : function(xhr, status, error) 
				{
					if (xhr.status === 200) 
					{
						alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
						window.location.href = '/ConfirmacionFacturas/';
					} else
						alert('Error en el proceso.')
						window.location.href = '/ConfirmacionFacturas/';
				} 
				});
			}
			    
		},
		error : function(xhr, status, error) 
		{
			if (xhr.status === 200) 
			{
				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
				window.location.href = '/ConfirmacionFacturas/';
			} else
				alert('Error en el proceso.')
				window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
}


function obtenerMensajeCancelarCredito(json)  
{
	var msj = "";
	switch (json[0].estatus) 
	{
	case "0":
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero";
		break;
	case "1":
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero";
		break;
	case "2":
		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente" 
		break;
	case "3":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por encargado de credito-agente"
		break;
	case "4":
		msj = "Factura "+json[0].factura+" se encuentra en el area de almacen"
		break;
	case "5": 
		msj = "true"
		break;
	case "6":
		msj = "Factura "+json[0].factura+" ya se encuentra en el proceso con el encargado de credito-agente "
		break;
	case "7":
		msj = "Factura "+json[0].factura+" se encuentra en el area de almacen" 
		break;
	case "8":   
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero";
		break;   	
	case "9":
		msj = "Factura "+json[0].factura+" ya se encuentra en el proceso con el encargado de credito-agente "
		break;   	
	default:
		break;
	}
	
	return msj; 
}


