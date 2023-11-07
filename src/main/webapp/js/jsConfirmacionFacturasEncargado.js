let jsonCreditoEncargado; 
let jsonCreditoCobranza; 

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
function validarFacturaCreditoEncargado(factura)
{
	if (validarValorJSON(jsonCreditoEncargado, factura)) {    
		  return 'true'
		} else { 
			return 'La factura '+factura+' no esta mostrada en la tabla';  
		}
}
function validarValorJSON(json, factura) {
	  return json.some(item => item.factura === factura);
	}


function obtenerValorJSON(json, factura,valor) 
{
	  let itemEncontrado = json.find(item => item.factura === factura);   
	  return itemEncontrado ? itemEncontrado[valor] : null;    
}
 
function executionCreditoEncargado(servlet, accion, valores)
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
function consultaCorteECC(folio)       
{      
	$("#warningCreditoCorteECC").hide()  
	if (folio == '') return alert("Debe ingresar un folio de corte");  
	$("#esperaValidaCreditoCorteECC").show()
	jsonCredito= null;
	$('#divTableFacturas').empty();
	$('#divTableFacturasCredito').empty();
	$('#divTableFacturasEncargado').empty();  
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "61";  
	obj.folio= folio;   
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";    
	$.ajax({    
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
		dataType : 'json',
		success : function(json) 
		{
			rsp = JSON.parse(json.replace(/=/g,":"))
			$("#esperaValidaCreditoCorteFinalECC").hide()
			if(rsp.length>0)   
			{ 
				let msj = procesarJSONDelete(rsp);
				console.log(msj)
				if (msj != 'true')      
				{         
					$("#esperaValidaCreditoCorteECC").hide()
					$("#warningCreditoCorteLbECC").text(msj)
					$("#warningCreditoCorteECC").show()
					$("#txtCreditoCorteECC").val("");   
				}
				else
				{
					enableButtonsss()   
					toggleButtons('hideEscaneoCreditoECC')       
					enableButtonsSelectors('hideCreditoECC')      
					$("#esperaValidaCreditoCorteECC").hide()
					$("#mdlCreditoCorteECC").modal("hide");  
					consultarFacturasEscaneadasCreditoEncargado();            
				}  
			}	
			else
			{   
				$("#esperaValidaCreditoCorteECC").hide()
				$("#warningCreditoCorteLbECC").text("No existe el folio de corte "+folio)
				$("#warningCreditoCorteECC").show()
				$("#txtCreditoCorteECC").val("");   
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
	    if (["se encuentra en proceso de almacen", "se encuentra en proceso de aux credito", "se encuentra en proceso de relacion de cobranza"].includes(item.estatusMsj)) {
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






async function detalleEscaneoCreditoEncargado()       
{
	alerta() 
	$('#divPrevio').empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "23";      	
	obj.tipo = "select";        
	obj.usuario = $("#usrCredito").val();     
	obj.folio = $("#txtCreditoCorteECC").val();  
	obj.operacion = "consulta previo almacen";
	document.getElementById('cargando').style.display = 'block';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{ 
		let json = JSON.parse(n.replace(/=/g,":"))
		console.log("1")  
		llenarMdlEncargado(json);  
//		aplicarEstiloTablaConfirmacionFacturasPrevio()      
	}
	else
	{
		document.getElementById('cargando').style.display = 'none';   
		alertMsj('warning',"No se encontraron facturas escaneadas")
	}
}  

let ttl = 0;
function ocultarTDa(agene)     
{
	console.log("a: "+agene)
	if($('tr[name="'+agene+'[]').css('display') == 'none')
	{
		$('tr[name="'+agene+'[]"]').show();  
	}
	else
	{
		$('tr[name="'+agene+'[]"]').hide(); 
	}
}
function llenarMdlEncargado(json)
{
	ttl= 0;  
	$('#divPrevio').empty();  
	$('#divFilterPrevio').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	document.getElementById('cargando').style.display = 'none';    
	$("#mdlPrevio").modal("toggle");
	$("#lblPrevio").text("PREVIO FACTURAS ESCANEADAS");
	let contenido = 
		"<table id='tb_articulosDetallePrevio' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+
		"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
		"<tr id='tr_articulosDetalle' class='f33liberados'>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
		"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
		"</tr>"+ 
	"</thead>"+
	"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	aux = 0; 
	for(let i=0; i < json.length ; i++) 
	{
		contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;display:none' name = '"+json[i].agente+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;display:none' name = '"+json[i].agente+"[]'>"; 		 
	 ttl++;  
		 contenido += "" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].agente+" </div></td>" +                           
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
		"</tr>" ;
      	 aux++;  
		 if (json[i].agente != (i == (json.length-1) ? 'as': json[i+1].agente))
		 {
			 contenido += "<tr id = 'tr_articulosDetalle' style='background: black;color:white' onclick=ocultarTDa('"+json[i].agente+"')>";   		 
			 contenido += "" +
//			 	 "<td id='td_articulosDetalle2' align='right' colspan='4'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>TOTAL FACTURAS AGENTE "+json[i].agente+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> <button type='button' id='btn' class='btn btn-info' style ='    padding-top: 0px;padding-bottom: 0px;padding-right: 4px;font-size: 12px;padding-left: 4px;'>Detalle</button> </div></td>" +
			 	 "<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" + 
			 	 "<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'>AGENTE "+json[i].agente+"</div></td>" +  
			 	 "<td id='td_articulosDetalle2' align='center' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> FACTURAS: "+aux+" </div></td>" +           
			"</tr>" ;
			 aux = 0; 
		 }  
		 
		 
		 
	}  
	contenido +="</tbody>" +  
	"</table>";
	$("#divPrevio").append(contenido); 
	$("#titlePrevio").text("TOTAL DE FACTURAS: "+ttl)         
	aplicarEstiloTablaConfirmacionFacturasPrevio();    
}



function escanearFacturaCreditoEncargado(factura) 
{  
	factura = factura.toLowerCase()
	alerta()
	var validate = validarFacturaCreditoEncargado(factura);
	validate = (validate != 'true') ? validarFacturaCreditoEncargado(factura.toUpperCase()) : validate;    
	
	if (validate == 'true')  
	{
		factura = validarFacturaCreditoEncargado(factura.toUpperCase()) == 'true' ? factura.toUpperCase() : factura;
		document.getElementById('cargando').style.display = 'block';       
		var obj = new Object() 
		obj.proceso = "181";
		obj.query = "2";  
		obj.tipo = "select";
		obj.estatus = "2"; 
		obj.operacion = "validaExistenciaFactura"; 
		obj.factura = ""+factura+""; 
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
			if (rsp.length > 0)
			{
				var msj = obtenerMensajeCreditoEncargado(rsp)
				 if (msj == 'true') 
				 {
					 
					 	var obj = new Object() 
						obj.proceso = "181";
						obj.query = "19";      
						obj.estatus = "6"; 
						obj.operacion = "InsertarFactura";      
						obj.accion = "insertarFacturaAlmacen";
						obj.tipo = "insert";
						obj.usuario = $("#usr").val();
						obj.usuariocubre = $("#usrCredito").val();  
						obj.factura = ""+factura+"";
						 	$.ajax({
							url : "ConfirmacionFacturas",
							data : "accion=insertarFacturaAlmacen&valores="+JSON.stringify(obj),    
							type : 'POST',
					//		async: false,
							dataType : 'json', 
							success : function(json) 
							{
								rsp = JSON.parse(json.replace(/=/g,":"))
								document.getElementById('cargando').style.display = 'none';
								 if (rsp.length > 0)
								 {       
									 consultarFacturasEscaneadasCreditoEncargado();
									 alertMsj('true',"Factura escaneada correctamente")
									$("#txtFacturaCreditoEncargado").val(""); 
				 document.getElementById("txtFacturaCreditoEncargado").focus();	 
								 }
								 else  
								 {
									alertMsj('false',"No se pudo insertar la factura: "+factura+".")
									$("#txtFacturaCreditoEncargado").val(""); 
				 document.getElementById("txtFacturaCreditoEncargado").focus(); 
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
					 alertMsj('warning',"No se pudo insertar la factura: "+factura+".")
					 $("#txtFacturaCreditoEncargado").val(""); 
					 document.getElementById("txtFacturaCreditoEncargado").focus();   
				 }
			}
			else
			{
				alertMsj('warning',"No se encontraron facturas en estatus pendiente")   
				$("#txtFacturaCreditoEncargado").val(""); 
				 document.getElementById("txtFacturaCreditoEncargado").focus();
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
		$("#txtFacturaCreditoEncargado").val(""); 
		 document.getElementById("txtFacturaCreditoEncargado").focus();  
	}
}

 
function obtenerMensajeCreditoEncargado(json) 
{
	var msj = "";  
	switch (json[0].estatus) 
	{
	case "0":
		msj = "Factura "+json[0].factura+"  no se ha escaneado por el area de Almacen" 
		break;
	case "1":
//		msj = "true"         
			msj = "Factura "+json[0].factura+"  se encuentra en area de Credito"	
		break;
	case "2":
//		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente";
		msj = "true"
			break;
	case "3": 
//		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por encargada de credito-agente"
		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente";  
		break;
	case "4":
		msj = "Factura "+json[0].factura+"  se encuentra en area de Almacen"
		break;
	case "5":
//		msj = "true" 
			msj = "Factura "+json[0].factura+"  se encuentra en area de Credito"
		break;
	case "6":
//		msj = "Factura "+json[0].factura+" se encuentra en proceso de encargada de credito-agente"
			msj = "true"
		break;   	
	case "7":   
		msj = "Factura "+json[0].factura+"  se encuentra en area de Almacen"
		break; 
	case "8":   
//		msj = "true"
			msj = "Factura "+json[0].factura+"  se encuentra en area de Credito"
		break;   	
	case "9":
//		msj = "Factura "+json[0].factura+" se encuentra en proceso de encargada de credito-agente"
			msj = "true"
		break;   	
	default:
		msj = "Factura "+json[0].factura+"  no se ha escaneado por el area de Almacen"    
		break;
	}
	
	return msj; 
}

function validarEncargado() 
{
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty();
	jsonCreditoEncargado= null;  
	jsonCreditoCobranza= null;  
	toggleButtons('hideECC')     
	alertaUsr()      
	toggleButtons('hideCortePen')      
	toggleButtons('hideCobranzaECC') 
	alertaUsr()
	$("#usrCredito").val($("#usr").val()) 
	$("#passCredito").val("");
	$("#facurasCreditoEncargado").hide()
	$("#tblUsr").show()
	$("#tblUsrValidacion").hide()
	$("#tblEncargado").hide()
	$("#lblCredito").text("SELECCIONE COMO DESEA CONSULTAR LAS FACTURAS")
	$("#footerUsr").hide()	
	$("#mdlUsrCredito").modal("toggle");
}


function diferenteEncargado() 
{
	alertaUsr()
	$("#tblEncargado").hide()
	$("#passCredito").val("");
	  
	$("#lblCredito").text("AUTORIZACION JEFE CREDITO")  
	$("#tblUsr").hide()
	$("#tblUsrValidacion").show()   
	$("#footerUsr").show()
	document.getElementById("passCredito").focus();    
}

function regresarEncargado() 
{
	alertaUsr()
	$("#tblEncargado").hide()
	$("#passCredito").val("");
	$("#lblCredito").text("SELECCIONE COMO DESEA CONSULTAR LAS FACTURAS")
	$("#tblUsr").show()  
	$("#tblUsrValidacion").hide() 
	$("#footerUsr").hide()	
}
 
async function validarPass() 
{
	alertaUsr()
	let pass = $("#passCredito").val();
	if (pass != '') 
	{
		$("#esperaValidaProcSurt").show()
		var obj = new Object()       
		obj.proceso = "181";        
//		obj.estatus = "1,4";
		obj.pass = pass;
		obj.query = "24";            
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
		const n = await prb('Execution', 'execute',JSON.stringify(obj)); 
		if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
		{   
			$("#esperaValidaProcSurt").hide() 
			let json = JSON.parse(n.replace(/=/g,":"))
			if (json[0].validacion == 'accesar') 
			{
				var obj = new Object()       
				obj.proceso = "181";          
				obj.usuario = $("#usr").val(); 
				obj.query = "25";            
				obj.tipo = "select";        
				obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
				const nn = await prb('Execution', 'execute',JSON.stringify(obj)); 
				if (nn.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(nn.replace(/=/g,":"))) : false)         
				{
					let json2 = JSON.parse(nn.replace(/=/g,":"))  
					$("#tblUsrValidacion").hide()
					$("#tblEncargado").show()
					$("#lblCredito").text("SELECCIONE ENCARGADO")
					const selectElement = document.getElementById("slcEncargado");
					while (selectElement.firstChild) {selectElement.removeChild(selectElement.firstChild);} 
					json2.forEach(item => {
					    const option = document.createElement("option");
					    option.value = item.cve_usu;
					    option.text = item.cve_usu +"-" + item.nombre;   
					    selectElement.appendChild(option);
					});
				}
				else 
				{
					alertMsjUsr('warning',"No se encontraron encargados")
				}
			}
			else
			{
				alertMsjUsr('warning',"Contraseña incorrecta,intente nuevamente")
				$("#passCredito").val("");
				document.getElementById("passCredito").focus();  	 
			}
		}
		else
		{
			$("#esperaValidaProcSurt").hide() 
			alertMsjUsr('warning',"Intente nuevamente, no se pudo conectar con el servidor")
		}
	}
	else
	{
		alertMsjUsr('warning',"Debe ingresar una contraseña")   
	}
}

function continuarEncargado() 
{
	let slc = document.getElementById("slcEncargado").value;
	if (slc != '') 
	{
		$("#usrCredito").val(slc) 
		consultarFacturasEscaneadasCreditoEncargado()
	}
	else
	{
		alertMsjUsr('warning',"Debe seleccionar un encargado")
	}

}


function consultarFacturasEscaneadasCreditoEncargado() 
{
//	alert("sss"   )
	$("#mdlUsrCredito").modal("hide"); 
	console.log("ss"); 
	jsonCreditoEncargado= null;
	alerta()
	$('#divTableFacturasEncargado').empty();
	$('#divTableFacturasCreditoEncargado').empty();
	$("#tituloBuscadoCreditoECC").text("")
	$("#tituloBuscadoCreditoECC").text("FOLIO DE CREDITO: "+$("#txtCreditoCorteECC").val())   
	$('#divTableFacturasEncargadoEncargado').empty();  
	document.getElementById('cargando').style.display = 'block';  	        
	var obj = new Object()      
	obj.proceso = "181";      
	obj.query = $("#nivel").val() == 0  ?"15" : "14" ;    
	obj.estatus = "2,9";     
	obj.tipo = "select";
	obj.folio =  $("#txtCreditoCorteECC").val();  
	obj.operacion = "consultaFactura s";
	obj.usuario = ($("#usr").val() == $("#usrCredito").val() ? $("#usr").val() :  $("#usrCredito").val());  
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
				jsonCreditoEncargado = rsp;
				$("#facurasCreditoEncargado").show()   
				$("#titleCreditoEncargado").show()
				$("#lblCreditoEncargado").show()
				$("#lblCreditoEncargados").show() 
				 
				llenarTablaPedidosDisponiblesCreditoEncargado(rsp);
				document.getElementById("txtFacturaCreditoEncargado").focus();
				toggleButtonsss('hideCobranzaECC')      
				enableButtonsss()         
			}	
			else
			{   
				enableButtonsss()   
				toggleButtonsss('hideEscaneoECC')          
				enableButtonsSelectors('hideCobranzaECC')    
				$("#facurasCreditoEncargado").hide()   
				$("#titleCreditoEncargado").hide()
				$("#lblCreditoEncargado").hide() 
				$("#lblCreditoEncargados").hide() 
				clearDiv() 
				document.getElementById('cargando').style.display = 'none';
				$("#facurasCreditoEncargado").show()              
			alertMsj('warning',"No se encontraron facturas en estatus pendiente") 
			$("#txtFacturaCreditoEncargado").val("");  
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


function llenarTablaPedidosDisponiblesCreditoEncargado(json) 
{
	$('#divTableFacturasCreditoEncargado').empty();
	$('#customBodyCreditoEncargado').empty();
	$('#divFilterCreditoEncargado').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalleCreditoEncargado' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CDO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>USUARIO CREDITO</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA CREDITO</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	var aux = 0; 
	for(let i=0; i < json.length ; i++)
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
		  
		 contenido += "" +
		 	 "<td id='td_articulosDetalle0' align='center'  style= 'padding-bottom: 4px;padding-top: 4px; '  class = 'AltoTD bordesTd'> "+json[i].uname_br+" </td>" +
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folio+" </div></td>" +        
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>"+json[i].pedido+" </div></td>" + 
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].factura+" </div></td>" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;cursor: pointer;'  class = 'AltoTD bordesTd' title = '"+json[i].clienteNombre+"'><div style='width: max-content'>  "+json[i].cliente+" </div></td>" +        
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;cursor: pointer;'  class = 'AltoTD bordesTd' title='"+json[i].nombre_agente+"'><div style='width: max-content'> "+(json[i].agente)+" </div></td>" +   
		 	"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;cursor: pointer;'  class = 'AltoTD bordesTd' title='"+json[i].nombreEncargado+"'> <div style='width: max-content'> "+json[i].cve_usu_credito+" </div></td>" +       
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_credito+" "+json[i].hora_credito+" </div></td>" +  
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+(json[i].id_estatus == 9 ?  'Confirmada Credito' : json[i].descripcion)+" </div></td>" +                  
		"</tr>" ;
		 if (json[i].id_estatus == 6)  
		 {
			 aux++;
		 }
	}
	$("#facturasCorrectas").val(aux)
	contenido +="</tbody>" +
	"</table>";
	$("#divTableFacturasCreditoEncargado").append(contenido);
	$("#facurasCreditoEncargado").show()  
	aplicarEstiloTablaConfirmacionFacturasCreditoEncargado();
} 



function consultaCobranzaFactura(factura) 
{
	$("#txtCreditoCobranza").val(""); 
	$("#warningCreditoCobranzaLb").text("")      
	$("#warningCreditoCobranza").hide() 
	
	if(factura == '') 
	{
		$("#warningCreditoCobranzaLb").text("Debe ingresar un folio de corte")        
		$("#warningCreditoCobranza").show()
		$("#txtCreditoCobranza").val("");
		document.getElementById("txtCreditoCobranza").focus();
		return true;
	}
	if (validarValorJSON(jsonCreditoCobranza, factura))   
	{
		let fls = $("#flsCobranza").text().trim();  
		if ( fls.split(',').includes(factura))
		{
			$("#warningCreditoCobranzaLb").text("Factura ya mostrada")
			$("#warningCreditoCobranza").show()
			$("#txtCreditoCobranza").val("");
			document.getElementById("txtCreditoCobranza").focus();
			return true;
		}
		$("#divFoliosCorbanza").show()    
		if ($("#flsCobranza").text().trim() != '')          
		{
			$("#flsCobranza").text($("#flsCobranza").text()+","+factura);
		}
		else
		{
			$("#flsCobranza").text(factura);  
		}  
		
	}  
	else
	{
		$("#warningCreditoCobranzaLb").text("Factura "+factura+" no esta confirmada")        
		$("#warningCreditoCobranza").show()
		$("#txtCreditoCobranza").val("");
		document.getElementById("txtCreditoCobranza").focus();
		return true;
	}
	
	
	
}

async  function enviarFacturaCreditoEncargado()
{
	alerta()                
	$("#flsECC").text("");  
	$("#txtCreditoCorteFinalECC").val(""); 
	$("#warningCreditoCorteLbFinalECC").text("")      
	$("#warningCreditoCorteFinalECC").hide()
	$("#divFoliosECC").hide()      
	$("#mdlCreditoCorteFinalesECC").modal('hide');   
	consultaCorteAenviarECC($("#txtCreditoCorteECC").val())             
} 
 function sendFacturasCobranzaAnterior()     
{
	 
	 if ($("#flsCobranza").text().trim() == '')
	 {
		 $("#warningCreditoCobranzaLb").text("Debe escanear una factura al menos")     
			$("#warningCreditoCobranza").show()
			$("#txtCreditoCobranza").val("");
			document.getElementById("txtCreditoCobranza").focus();
			return true;
	 }
	 
	$("#esperaValidaCreditoCobranza").show() 
	var obj = new Object()   
	obj.proceso = "181";
	obj.query = "6";
	obj.operacion = "UpdateFacturas";
	obj.estatus_nuevo = "3";       
	obj.estatus = "6";
	obj.facturas = $("#flsCobranza").text().split(',').map(e => `"${e}"`).join(','); 
	obj.accion = "updateFacturas";
	obj.tipo = "insert";    
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
			$("#esperaValidaCreditoCobranza").hide()
			 if (rsp.length > 0)
			 {
				 
				 $("#odes").val()      
				 console.log("si")
				var obj = new Object()       
				obj.proceso = "181";        
//				obj.pass = pass;  
				obj.query = "26";            
				obj.tipo = "select";
				obj.usuario = $("#usrCredito").val();  
				obj.facturas =  $("#flsCobranza").text().split(',').map(e => `"${e}"`).join(',');       
				obj.accion = "generarRelacion";  
				obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
				$.ajax({
					url : "ConfirmacionFacturas",
					data : "accion=generarRelacion&valores="+JSON.stringify(obj),    
					type : 'POST',
					dataType : 'json', 
					success : function(json) 
					{
//						console.log("aqi")
//						rsp = JSON.parse(json.replace(/=/g,":"))
//						console.log("sss")
//						console.log(rsp)   
					},
					error : function(xhr, status, error)  
					{
						$("#esperaValidaProcSurtFac").hide() 
						$("#mdlCreditoCobranza").modal("hide");
						if (xhr.status === 200) 
						{
							alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
							window.location.href = '/ConfirmacionFacturas/';
						} else
							alert('Error en el proceso.')
							window.location.href = '/ConfirmacionFacturas/';
					}
				});  
				 
				 $("#mdlCreditoCobranza").modal("hide"); 
				 consultarFacturasEscaneadasCreditoEncargado();
				 alert("Se confirmaron las facturas y la relacion de cobranza se realizo correctamente")     
//				 alertMsj('true',"Facturas confirmadas correctamente") 
				$("#txtFacturaCreditoEncargado").val(""); 
				document.getElementById("txtFacturaCreditoEncargado").focus();	 
			 }
			 else  
			 {
				alertMsj('warning',"No se pudieron confirmar las facturas, intente nuevamente.")
				$("#txtFacturaCreditoEncargado").val(""); 
				document.getElementById("txtFacturaCreditoEncargado").focus(); 
			 }      
		},
		error : function(xhr, status, error) 
		{
			$("#esperaValidaCreditoCobranza").hide() 
			$("#mdlEnviar").modal("hide");
			$("#mdlCreditoCobranza").modal("hide");
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

 function sendFacturasEncargadoECC()
 {
 $("#dangerDetalleCreditoECC").hide()
	$("#warningDetalleCreditoECC").hide()   
	
	if ($("#txtCreditoCorteECC").val() == '') return alert("Debe consultar un folio de corte")        
	let text = "CONFIRME PARA MANDAR FACTURAS A RELACION DE COBRANZA";    
	if (confirm(text) == true) 
	{
		
		$("#lblTotalEnviarCreditoECC").show(); 
		$("#btnSendCreditoECC").hide();
		$("#btnRegresarFolioCreditoECC").hide();   
		$("#ContSegundoECC").hide();
		    	$("#lblTotalEnviarCreditoECC").hide();
		    	$("#btnSendCreditoECC").hide()
				$("#esperaValidaDetalleCreditoECC").show()
				var obj = new Object()   
				obj.proceso = "181";
				obj.query = "67"; 
				obj.operacion = "UpdateFacturas";
				obj.estatus_nuevo = "3"; 
				obj.estatus = "5";         
				obj.folio_corte= $("#txtCreditoCorteECC").val();     
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
						$("#esperaValidaDetalleCreditoECC").hide()
						 if (rsp.length > 0)
						 {       
							 	$('#divTableDetalleCreditoECC').empty();     
								$("#warningDetalleCreditoECC").show()
								$("#warningDetalleCreditoLbECC").text("SE ENVIARON CORRECTAMENTE LAS FACTURAS")
								$("#segundoECC").html("5");        
								$("#ContSegundoECC").show()
								var segundo = 5;     
								var intervalId = setInterval(function() {
								    $("#segundoECC").html(segundo);  
								    segundo--;
								    if (segundo < 0) 
								    {
								    	clearInterval(intervalId);
								    	$("#ContSegundoECC").hide();
										$("#esperaValidaDetalleCreditoECC").hide()  
										$("#warningDetalleCreditoECC").hide() 
										$("#dangerDetalleCreditoECC").hide()
										$("#mdlRegresarFolioCreditoECC").modal('hide')           
										validarEncargado()                           
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
	}

function cancelarFacturaCreditoEncargado(factura) 
{
	alerta()
		if (factura == '') return alert("Debe ingresar una factura") 
		document.getElementById('cargando').style.display = 'block';     
		var obj = new Object() 
		obj.proceso = "181";
		obj.query = "2";  
		obj.tipo = "select";
		obj.operacion = "validaExistenciaFactura"; 
		obj.factura = ""+factura+""; 
//		var rsp = execution("Execution", "execute", JSON.stringify(obj));
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
			if (rsp.length > 0)
			{
				var msj = obtenerMensajeCancelarCreditoEncargado(rsp)
				 if (msj == 'true') 
				 {
					 
					 var obj = new Object()   
						obj.proceso = "181"; 
						obj.query = "63";  
						obj.operacion = "UpdateFacturas";
						obj.estatus_nuevo = "9"; 
						obj.estatus = "6";     
						obj.folio = $("#txtCreditoCorteECC").val();
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
									 consultarFacturasEscaneadasCreditoEncargado();
									 alertMsj('true',"Facturas cancelada correctamente")   
									$("#txtFacturaCreditoEncargado").val(""); 
									$("#txtFacturaCancelarCreditoEncargado").val(""); 
									document.getElementById("txtFacturaCreditoEncargado").focus();	 
								 }
								 else  
								 {
									alertMsj('warning',"No se pudo cancelar la factura, intente nuevamente.") 
									$("#txtFacturaCreditoEncargado").val("");
									$("#txtFacturaCancelarCreditoEncargado").val("");
									document.getElementById("txtFacturaCreditoEncargado").focus(); 
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
					 $("#txtFacturaCancelarCreditoEncargado").val(""); 
						document.getElementById("txtFacturaCancelarCreditoEncargado").focus();      
				 }
			}      
			else
			{
				
				alertMsj('warning',"No se encontraron facturas escaneadas previamente")   
				$("#txtFacturaCreditoEncargado").val("");     
				$("#txtFacturaCancelarCreditoEncargado").val("");      
				 document.getElementById("txtFacturaCancelarCreditoEncargado").focus();
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
		
//	}
//	else
//	{
//		document.getElementById('cargando').style.display = 'block';  
//		alertMsj('warning',validate)
//		$("#txtFacturaCancelarCreditoEncargado").val(""); 
//		 document.getElementById("txtFacturaCancelarCreditoEncargado").focus();  
//	}
}    


function obtenerMensajeCancelarCreditoEncargado(json)  
{
	var msj = "";
	switch (json[0].estatus) 
	{
	case "0":
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero";
		break;
	case "1":
		msj = "Factura "+json[0].factura+" se encuentra en el area de credito"
		break;
	case "2":
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero"; 
		break;
	case "3":
		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente"
		break;
	case "4":
		msj = "Factura "+json[0].factura+" se encuentra en el area de almacen"
		break;
	case "5":
		msj = "Factura "+json[0].factura+" se encuentra en el area de credito"
		break;
	case "6":
		msj = "true"
		break;
	case "7":
		msj = "Factura "+json[0].factura+" se encuentra en el area de almacen"  
		break;
	case "8":
		msj = "Factura "+json[0].factura+" se encuentra en el area de credito"
		break;   	
	case "9":
		msj = "Factura "+json[0].factura+" no se puede cancelar, debe escanearse primero";   
		break;   	
	default:
		break;
	}
	
	return msj; 
}


async function procesarInfoCancelacionECC()   
{
	$("#divTableDetalleCreditoECC").empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "62";         
	obj.folio= $("#txtCreditoCorteECC").val();     
	obj.tipo = "select";           
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n2.replace(/=/g,":"))
		llenarTablaDetalleCreditoECC(rsp); 
		$("#esperaValidaDetalleCreditoECC").hide()   
		$("#btnSendCreditoECC").hide();        
		$("#btnRegresarFolioCreditoECC").show();  
		$("#mdlRegresarFolioCreditoLbECC").text("DETALLE DE FACTURAS QUE SE CANCELARAN. FOLIO DE CREDITO: "+$("#txtCreditoCorteECC").val())      
	}
	else      
	{
		$("#esperaValidaDetalleCreditoECC").hide()  
	}
}

async function consultarCortesPendientesECC() 
{
	$("#esperaValidaCreditoCorteECC").show()  
	$('#divTableCortesPendientesECC').empty();  
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "64";     
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";
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
		$("#divTableCortesPendientesECC").append(contenido);
		$("#divTableCortesPendientesECC").show() 
		$("#esperaValidaCreditoCorteECC").hide() 
		enableButtonsSelector('hideCortePenECC')             
		$('#mdlCreditoCorteECC').on('shown.bs.modal', function () { $("#txtCreditoCorteECC").focus(); });
		$("#txtCreditoCorteECC").focus();     
		    
	}
	else
	{
		$("#esperaValidaCreditoCorteECC").hide() 
		$("#warningCreditoCorteECC").show();
		$("#warningCreditoCorteLbECC").text("No se encontraron folios de credito pendientes");
		$("#focoECC").focus();      
		             
	}
	
}
async function  pintarDetalleECC()   
{
	alerta() 
	$('#divTableDetalleCreditoECC').empty();
	$("#esperaValidaDetalleCreditoECC").show()
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "62";          
	obj.folio= $("#txtCreditoCorteECC").val();     
	obj.tipo = "select";           
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n2.replace(/=/g,":"))        
		$("#lblTotalEnviarCreditoECC").text("VALIDE QUE ENTREGUE "+rsp.length+" FACTURAS A LOS ECC")     
		llenarTablaDetalleCreditoECC(rsp); 
		$("#esperaValidaDetalleCreditoECC").hide()   
		$("#btnSendCreditoECC").show();
		$("#btnRegresarFolioCreditoECC").hide();  
		$("#mdlRegresarFolioCreditoLbECC").text("SE CONFIRMARAN FACTURAS Y ESTARAN DISPONIBLES PARA RELACION DE COBRANZA")     
		$("#folioConfirmacionECC").val(json2[0].folio)   
		
	}
	else   
	{
		$("#esperaValidaDetalleCreditoECC").hide() 
	}
}

async function consultaCorteAenviarECC(folio)          
{
	$("#divTableDetalleCreditoECC").empty();
	$("#warningCreditoCorteLbFinalECC").text("")  
	$("#warningCreditoCorteFinalECC").hide()
	$("#warningCreditoCorteFinalECC").hide()     
	$("#btnSendCreditoECC").hide();
	$("#btnRegresarFolioCreditoECC").hide();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "61";      
	obj.folio= folio;   
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";
	document.getElementById('cargando').style.display = 'block'; 
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
			let json = JSON.parse(n2.replace(/=/g,":"));
			document.getElementById('cargando').style.display = 'none';
			$("#esperaValidaCreditoCorteFinalECC").hide()
			let msj = procesarJSONDelete(json);   
			console.log(msj) 
			if (msj != 'true') 
			{
				alertMsj('warning', "No se puede enviar a ECC. "+msj)
				
			}
			else
			{
				if(json.length>0)   
				{ 
					$("#mdlCreditoCorteFinalesECC").modal('hide');                        
					$("#txtCreditoCorteFinalECC").val("");      
					$("#mdlRegresarFolioCreditoECC").modal('toggle')             
					pintarDetalleECC();  
				}	
				else
				{   
					$("#warningCreditoCorteLbFinalECC").text("No existe el folio de corte "+folio)
					$("#warningCreditoCorteFinalECC").show()   
				}    
				
			}
			    
		}else
		{   
				$("#warningCreditoCorteLbFinalECC").text("No existe el folio de corte "+folio)
			$("#warningCreditoCorteFinalECC").show()   
		}
	}


async function consultaCorteACancelarECC(folio)         
{
	$("#divTableDetalleCreditoECC").empty();
	$("#warningCreditoCorteLbFinalECC").text("")  
	$("#warningCreditoCorteFinalECC").hide()     
	$("#btnSendCreditoECC").hide();
	$("#btnRegresarFolioCreditoECC").hide();
	$("#esperaValidaDetalleCreditoECC").show()    
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "66";     
	obj.folio= folio;   
	obj.tipo = "select";
	obj.operacion = "consultaFacturas";
	document.getElementById('cargando').style.display = 'block'; 
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	document.getElementById('cargando').style.display = 'none';
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
			let json = JSON.parse(n2.replace(/=/g,":"));
			$("#esperaValidaCreditoCorteFinalECC").hide()
			if(json.length>0)   
			{ 
				$("#mdlCreditoCorteFinalesECC").modal('hide');                        
				$("#txtCreditoCorteFinalECC").val("");      
				$("#mdlRegresarFolioCreditoECC").modal('toggle')             
				procesarInfoCancelacionECC();  
			}	
			else
			{    
				$("#warningCreditoCorteLbFinalECC").text("No existe el folio de corte "+folio)
				$("#warningCreditoCorteFinalECC").show()   
			}    
	}
	else
	{   
			$("#warningCreditoCorteLbFinalECC").text("No existe el folio de corte "+folio)
			$("#warningCreditoCorteFinalECC").show()   
	}
}

async function confirmaRegresarAlmacenECC() 
{
	if ($("#txtCreditoCorteECC").val() == '') return alert("No se puede procesar la informacion, intente nuevamente");
	$("#esperaValidaDetalleCreditoECC").show();  
	$("#warningDetalleCreditoECC").hide()
	$("#dangerDetalleCreditoECC").hide()
	$("#btnRegresarFolioCreditoECC").hide()
	var obj = new Object()      
	obj.proceso = "181";
	obj.query = "65";   
	obj.folio =  $("#txtCreditoCorteECC").val();  
	obj.operacion = "UpdateFacturas";
	obj.accion = "updateFacturas";
	obj.tipo = "select";       
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	$("#esperaValidaDetalleCreditoECC").hide();        
	$("#segundoECC").html("5");   
	$("#ContSegundoECC").show();
	$("#warningDetalleCreditoECC").show()   
	$("#warningDetalleCreditoLbECC").text("SE REGRESO CORRECTAMENTE AL AUX DE CREDITO EL FOLIO DE CREDITO "+$("#txtCreditoCorteECC").val());         
	$('#divTableDetalleCreditoECC').empty();  
		var segundo = 5;     
		var intervalId = setInterval(function() {   
		    $("#segundoECC").html(segundo);  
		    segundo--;
		    if (segundo < 0) 
		    {
		    	clearInterval(intervalId);
		    	$("#ContSegundoECC").hide();
				$("#esperaValidaDetalleCreditoECC").hide()  
				$("#warningDetalleCreditoECC").hide()
				$("#dangerDetalleCreditoECC").hide()
				$("#mdlRegresarFolioCreditoECC").modal('hide')           
				validarEncargado();        
		    }
		}, 1000);   
}

function llenarTablaDetalleCreditoECC(json)   
{
	$("#divTableDetalleCreditoECC").empty();
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
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 0px;padding-top: 0px;    vertical-align: middle'  class = 'AltoTD bordesTd'><div style='width: max-content;    padding-left: 5px;padding-right: 5px;"+(json[i].estatus == 'Escaneado ECC' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"'> "+json[i].estatus+" </div></td>" +               
				"</tr>" ;
//			} 
		}  
		contenido +="</tbody>" +
		"</table> </div>";    
//	}  
	
	
	$("#divTableDetalleCreditoECC").append(contenido); 
	$("#divTableDetalleCreditoECC").show()
	const divTableDetalleCredito = document.getElementById("divTableDetalleCreditoECC");
	const distanciaDesdeElInicio = divTableDetalleCredito.getBoundingClientRect().top;
	const alturaDeseada = window.innerHeight - document.getElementById("divTableDetalleCreditoECC").getBoundingClientRect().top;
	document.getElementById("divTableDetalleCreditoECC").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio) + "px ";  
	
} 



function enableButtonsss() 
{
	$("#tituloBuscadoCreditoECC").show()   
    var toggleButtons = document.querySelectorAll('.hideECC');
    toggleButtons.forEach(function(button) {
        button.classList.remove('hideBtn');
    }); 
}
function toggleButtonsss(selector)    
{   
	$("#tituloBuscadoCreditoECC").hide()  
	var toggleButtons = document.querySelectorAll('.'+selector);
	 toggleButtons.forEach(function(button) {
         button.classList.add('hideBtn');  
     });    
}  
function enableButtonsSelectors(cls)     
{
    var toggleButtons = document.querySelectorAll('.'+cls);
    toggleButtons.forEach(function(button) {
        button.classList.remove('hideBtn');  
    }); 
}  