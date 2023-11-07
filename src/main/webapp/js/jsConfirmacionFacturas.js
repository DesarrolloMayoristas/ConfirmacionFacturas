let jsonAlmacen;
  
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


function clearDiv()
{
	alerta()
	$("#facturasCorrectas").val("0");
	$('#divTableFacturasCredito').empty();
	$('#customBodyCredito').empty();
	$('#divFilterCredito').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	$('#divTableFacturasCreditoEncargado').empty();
	$('#customBodyCreditoEncargado').empty();
	$('#divFilterCreditoEncargado').empty();    
	$('#divTableFacturas').empty();
	$('#customBody').empty();
	$('#divFilter').empty();  
}

function opcionMostrar()
{
	alerta()
	var nivel = $("#nivel").val()
	$("#nav-home-tab").hide() 
	$("#nav-profile-tab").hide()
	$("#nav-contact-tab").hide()
	
	switch(nivel)
{
		case "1":
			$("#nav-home-tab").show()    
			$("#nav-home-tab").click()
			break;
		case "2":
			$("#nav-profile-tab").show()
			$("#nav-profile-tab").click()
			break;
		case "3":
			$("#nav-contact-tab").show()
			$("#nav-contact-tab").click()
			break;
		case "4":
			$("#nav-monitor-tab").show()
			$("#nav-monitor-tab").click()
			break;
		case "0":  
			$("#nav-home-tab").show() 
			$("#nav-home-tab").click();
			$("#nav-profile-tab").show()
			$("#nav-contact-tab").show()
			$("#nav-monitor-tab").show() 
			break;
		case "5":
			$("#nav-monitor-tab").hide()
			$("#nav-relacion-tab").hide()    
			$("#nav-monitorg-tab").show()
			$("#nav-monitorg-tab").click()        
			break;
		case "6":
			$("#nav-monitor-tab").hide()
			$("#nav-relacion-tab").hide()
			$("#nav-contact-tab").show() 
			$("#nav-genera-tab").show()
			$("#nav-genera-tab").click()        
			break;
		case "7":
			$("#nav-monitor-tab").hide()
			$("#nav-relacion-tab").hide()
			$("#nav-contact-tab").show() 
			$("#nav-genera-tab").show()
			$("#nav-cobranza-tab").show()  
			$("#nav-cobranza-tab").click()
			document.getElementById("txtFolioConfirma").focus();     
			break;
		default:
			break;
	}
	
}

function toggleButtons(selector) 
{ 
	$("#tituloBuscadoAlmacen").hide() 
	var toggleButtons = document.querySelectorAll('.'+selector);
	 toggleButtons.forEach(function(button) {
         button.classList.add('hideBtn');  
     });   
}
function toggleButtonsAlternar() {
	var toggleButtons = document.querySelectorAll('.hideAlmacen');
	toggleButtons.forEach(function(button) {
		button.classList.toggle('hideBtn');
	});  
}
function enableButtonss() {
	console.log("d"  )
	$("#tituloBuscadoAlmacen").show()   
    var toggleButtons = document.querySelectorAll('.hideAlmacen');
    toggleButtons.forEach(function(button) {
        button.classList.remove('hideBtn');
    }); 
}


function execution(servlet, accion, valores)
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


function validarAlmacen() 
{
	
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty();
	alertaUsr()
	$("#esperaValidaAlmacen").hide() 
	toggleButtons('hideAlmacen') 
	$("#facurasAlmacen").show()   
	$("#titleAlmacen").hide()
	$("input[name='exampleRadios']:checked").prop("checked", false);
    $("#txtFolio").val("")  
	clearDiv()
	$('#divTableDetalleChofer').empty(); 
	$("#tituloBuscadoAlmacen").text("") 
	$("#tituloBuscadoAlmacen").hide()  
	$("#warningUsrAlm").hide();  
	$("#mdlAlmacenFolio").modal("toggle");  
    $('#mdlAlmacenFolio').on('shown.bs.modal', function () { $("#txtFolio").focus(); });  

}

function createWhere(folio, radio) 
{
	$("#esperaValidaAlmacen").show()   
	let where = '';
	where = folio != '' ? ' and c.id_trayecto = '+folio+' ' : radio != 100 ?  ' and e.transporte = '+radio+'  ' : ' ';  
	return where;   
}


function escanearFactura(factura) 
{  
	
//	factura = factura.toLowerCase()    
	alerta()
	
	var validate = validarFactura(factura);
	if (validate == 'true') 
	{ 
		document.getElementById('cargando').style.display = 'block';
		var obj = new Object()  
		obj.proceso = "181";
		obj.query = "9";
		obj.ode = obtenerValorJSON(jsonAlmacen, factura,"ode");
		obj.pedido = obtenerValorJSON(jsonAlmacen, factura,"pedido");     
		obj.operacion = "InsertarFactura";
		obj.estatus = "4"; 
		obj.estatus_tc = "5"; 
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
					consultarFacturasEscaneadas();   
					alertMsj('true', "Factura escaneada correctamente")  
					$("#txtFactura").val(""); 
					document.getElementById("txtFactura").focus();	 
				}
				else  
				{
					alertMsj('false', "No se pudo insertar la factura: "+factura+".") 
					$("#txtFactura").val(""); 
					document.getElementById("txtFactura").focus(); 
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
		alert(validate)
		$("#txtFactura").val(""); 
		 document.getElementById("txtFactura").focus();  
	}
}

function validarFactura(factura)
{
	console.log(jsonAlmacen)
	console.log(factura)
	if (validarValorJSON(jsonAlmacen, factura)) {    
	  return 'true'
	} else { 
		return 'La factura '+factura+' no esta disponible, escanee alguna de las mostradas en la tabla';  
	}
}

function validarValorJSON(json, factura) {
	  return json.some(item => item.factura.toUpperCase() === factura.toUpperCase());   
	}

 
function obtenerValorJSON(json, factura,valor) 
{
	  let itemEncontrado = json.find(item => item.factura === factura);   
	  return itemEncontrado ? itemEncontrado[valor] : null;    
}

function insertarFactura(factura)  
{
	alerta()
	var obj = new Object() 
	obj.proceso = "181";
	obj.query = "3";
	obj.estatus = "1";
	obj.operacion = "InsertarFactura";
	obj.accion = "insertarFacturaAlmacen";
	obj.tipo = "insert";    
	obj.factura = ""+factura+"";
	var rsp = execution("ConfirmacionFacturas", "insertarFacturaAlmacen", JSON.stringify(obj));    
	return rsp;   
}

function obtenerMensaje(json) 
{
	var msj = "";
	switch (json[0].estatus) 
	{
	case "1":
		msj = "Factura "+json[0].factura+" ya ha sido confirmada previamente";
		break;
	case "4":
		msj = "true"
		break;
	case "7":
		msj = "true"
		break;
	case "0":
		msj = "true"
		break;
	case "2":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por credito"
		break;
	case "3":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por encargada de credito-agente"
		break;
	case "5":
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;
	case "6":
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;
	case "8":   
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;   	
	case "9":
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;   	
	default:
		break;
	}
	
	return msj; 
}

function obtenerMensajeCancelar(json) 
{
	var msj = "";
	switch (json[0].estatus) 
	{
	case "1":
		msj = "Factura "+json[0].factura+" no se puede regresar, ya ha sido confirmada";
		break;
	case "4":
		msj = "true"
		break;
	case "7":
		msj = "Factura "+json[0].factura+" no se puede regresar, debe escanearse primero";
		break;
	case "0":
		msj = "Factura "+json[0].factura+" no se puede regresar, debe escanearse primero";
		break;
	case "2":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por credito" 
		break;
	case "3":
		msj = "Factura "+json[0].factura+" ya se encuentra confirmada por encargada de credito-agente"
		break;
	case "5":  
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;
	case "6":
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;
	case "8":   
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;   	
	case "9":
		msj = "Factura "+json[0].factura+" ya se encuentra en el area de credito"
		break;   	
	default:
		break;
	}
	
	return msj; 
}



function consultarFacturasEscaneadas() 
{
	$('#divTableDetalleChofer').empty(); 
	$("#tituloBuscadoAlmacen").text("") 
	var valorSeleccionado = $("input[name='exampleRadios']:checked").val();  
	if (valorSeleccionado === undefined && !$("#txtFolio").val()) return alert("Debe seleccionar un transporte o ingresar un folio de ruta");
	$("#tituloBuscadoAlmacen").show()          
	if (valorSeleccionado === undefined || $("#txtFolio").val() != '')     
	{
		$("#tituloBuscadoAlmacen").text("FOLIO DE RUTA: "+$("#txtFolio").val()) 
	}
	else
	{
		switch (valorSeleccionado) 
		{
		case "1":
			$("#tituloBuscadoAlmacen").text("Transporte Cliente Recoge")
			break;
		case "2":
			$("#tituloBuscadoAlmacen").text("Transporte Expres Moto")
			break;
		case "3":
			$("#tituloBuscadoAlmacen").text("Transporte Agente")
			break;
		case "50":
			$("#tituloBuscadoAlmacen").text("Transporte Expres 60 Minutos")
			break;
		case "100":
			$("#tituloBuscadoAlmacen").text("Todos los transportes")
			break;
			
		default:
			break;
		}
	}
	jsonAlmacen = null;  
	alerta()
	$('#divTableFacturas, #divTableFacturasCredito, #divTableFacturasEncargado').empty();
	  const obj = {
		        proceso: "181",
		        estatus: "1,4",
		        query: "8",
		        where: createWhere($("#txtFolio").val(), valorSeleccionado !== undefined ? valorSeleccionado : 0 ),
		        tipo: "select",
		        operacion: "consultaFacturas",
		    }; 
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
				console.log("s");  
				enableButtonss();  
				$("#esperaValidaAlmacen").hide()
				$("#mdlAlmacenFolio").modal("hide");  
//				$("input[name='exampleRadios']:checked").prop("checked", false);
//				$("#txtFolio").val("")   
				jsonAlmacen = rsp;
				$("#facurasAlmacen, #titleAlmacen").show(); 
				llenarTablaPedidosDisponibles(rsp);
				document.getElementById("txtFactura").focus();  
			}	
			else
			{ 
				console.log("n");
				enableButtonss();    
				clearDiv()       
				toggleButtons('hideEscaneoAlmacen')   
				alertMsj('warning', "No se encontraron facturas en estatus pendiente")       
				$("#esperaValidaAlmacen").hide()  
				$("#facurasAlmacen").show()   
				$("#titleAlmacen").hide()
//				document.getElementById("txtFactura").focus();  
				$("#mdlAlmacenFolio").modal("hide");
				$("#tituloBuscadoAlmacen").show() 
			}
			    
		},
		error : function(xhr, status, error) 
		{
			  const mensaje = xhr.status === 200 ? 'Tu sesión actual ha expirado, para continuar vuelve a iniciar sesión.' : 'Error en el proceso.';
	            alert(mensaje);
	            window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
}



function validarFolio() 
{
	$('#divTableDetalleChofer').empty(); 
	$("#tituloBuscadoAlmacen").text("") 
	$("#tituloBuscadoAlmacen").hide()  
	$("#warningUsrAlm").hide();
	var valorSeleccionado = $("input[name='exampleRadios']:checked").val();  
	if (valorSeleccionado === undefined && !$("#txtFolio").val()) return alert("Debe seleccionar un transporte o ingresar un folio de ruta");
	if (valorSeleccionado === undefined || $("#txtFolio").val() != '')     
	{
		$("#tituloBuscadoAlmacen").text("FOLIO DE RUTA: "+$("#txtFolio").val()) 
	}
	else
	{
		switch (valorSeleccionado) 
		{
		case "1":
			$("#tituloBuscadoAlmacen").text("Transporte Cliente Recoge")
			break;
		case "2":
			$("#tituloBuscadoAlmacen").text("Transporte Expres Moto")
			break;
		case "3":
			$("#tituloBuscadoAlmacen").text("Transporte Agente")
			break;
		case "50":
			$("#tituloBuscadoAlmacen").text("Transporte Expres 60 Minutos")
			break;
		case "100":
			$("#tituloBuscadoAlmacen").text("Todos los transportes")
			break;
			
		default:
			break;
		}
	}
	jsonAlmacen = null;  
	alerta()
	$('#divTableFacturas, #divTableFacturasCredito, #divTableFacturasEncargado').empty();
	  const obj = {
		        proceso: "181",
		        query: "55", 
		        where: createWhere($("#txtFolio").val(), valorSeleccionado !== undefined ? valorSeleccionado : 0 ),
		        tipo: "select",
		        operacion: "consultaFacturas",
		    }; 
	$.ajax({     
		url : "Execution",    
		data : "accion=execute&valores="+JSON.stringify(obj), 
		type : 'POST',   
		dataType : 'json',
		success : function(json) 
		{
			document.getElementById('cargando').style.display = 'none'; 
			rsp = JSON.parse(json.replace(/=/g,":"))
			if(rsp.length>0) 
			{
				$("#esperaValidaAlmacen").hide()
				if ((rsp.some(item => item.estatusMsj === 'disponible')))    
				{
					consultarFacturasEscaneadas();
				}  
				else
				{
					clearDiv()       
					$("#warningUsrAlm").show()
					$("#warningUsrAlmLb").text(
							$("#txtFolio").val() != '' ?
							"El folio "+$("#txtFolio").val()+" "+rsp[0].estatusMsj
							: "No se encotraron folios disponibles con " +$("#tituloBuscadoAlmacen").text() 
					)   
					$("#esperaValidaAlmacen").hide()  
					$("#titleAlmacen").hide()
					$("#tituloBuscadoAlmacen").text("")  
					$("#tituloBuscadoAlmacen").hide()     
					$("#txtFolio").val("")
					$("#txtFolio").focus() 
				}
			}	
			else
			{   
				clearDiv()       
				$("#warningUsrAlm").show()
				$("#warningUsrAlmLb").text(
						$("#txtFolio").val() != '' ? "El folio de ruta "+$("#txtFolio").val()+" no existe"
						: "No se encotraron folios disponibles con "+$("#tituloBuscadoAlmacen").text()   
						)
				$("#esperaValidaAlmacen").hide()  
				$("#titleAlmacen").hide()
				$("#tituloBuscadoAlmacen").text("")  
				$("#tituloBuscadoAlmacen").hide()     
				$("#txtFolio").val("")
				$("#txtFolio").focus()
			}
			    
		},
		error : function(xhr, status, error) 
		{
			  const mensaje = xhr.status === 200 ? 'Tu sesión actual ha expirado, para continuar vuelve a iniciar sesión.' : 'Error en el proceso.';
	            alert(mensaje);
	            window.location.href = '/ConfirmacionFacturas/';
		} 
	});       
}


async function regresarFolioChofer(key) 
{
	$("#btnRegresarFolio").hide()
	$("#btnRegresarFolio").val("")
	$("#warningDetalleChofer").hide()
	$('#divTableDetalleChofer').empty();  
	$('#divTableDetalleChofer').hide();  
	$("#btnRegresarFolio").show()  
	$("#enviarAlmacenBtn").hide()
	if (key == '') 
	{
		$("#esperaValidaAlmacenKey").hide()
		$("#warningUsrAlmKey").show();  
		$("#warningUsrAlmLblKey").text("Debe ingresar la clave para continuar")
		$("#txtKey").val("")
		return false; 
	}
	var obj = new Object()      
	obj.proceso = "181";   
	obj.query = "52"; 
	obj.password = ""+key+"";
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	$("#esperaValidaAlmacenKey").show()
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{
		$("#esperaValidaAlmacenKey").hide()
		$("#warningUsrAlmKey").hide();
		$("#mdlAlmacenFolioKey").modal('hide')          
		$("#mdlRegresarFolioChofer").modal('toggle')
		$("#esperaValidaDetalleChofer").show()
		var valorSeleccionado = $("input[name='exampleRadios']:checked").val();    
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "53";  
		obj.where= createWhere($("#txtFolio").val(), valorSeleccionado !== undefined ? valorSeleccionado : 0 );     
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
		if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
		{
			$("#mdlRegresarFolioChoferLb").text("DETALLE DE FOLIOS QUE SE REGRESARAN")
			rsp = JSON.parse(n2.replace(/=/g,":"))
			$("#btnRegresarFolio").show()
			llenarTablaDetalleChofer(rsp);
			$("#esperaValidaDetalleChofer").hide()
			
		}    
		else
		{
			$("#esperaValidaDetalleChofer").hide() 
			alert("No se encontraron facturas")
			$("#mdlAlmacenFolioKey").modal('toggle')       
			$("#mdlRegresarFolioChofer").modal('hide')
		}   
		$("#txtKey").val("")  
	}	  
	else
	{
		$("#esperaValidaAlmacenKey").hide()
		$("#warningUsrAlmKey").show();
		$("#warningUsrAlmLblKey").text("Clave incorrecta, intente nuevamente")
		$("#txtKey").val("")
	}
}

async function confirmaRegresaChofer() 
{
	if ($("#btnRegresarFolio").val() == '') return alert("No se puede procesar la informacion, intente nuevamente");
	$('#divTableDetalleChofer').hide();   
	$("#esperaValidaDetalleChofer").show();
	$("#warningDetalleChofer").hide()
	var valorSeleccionado = $("input[name='exampleRadios']:checked").val();    
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "54";
	obj.folio = $("#btnRegresarFolio").val();       
	obj.tipo = "select";              
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	$('#divTableDetalleChofer').empty();     
	$("#warningDetalleChofer").show()
	$("#warningDetalleChoferLb").text("Los folios se regresaron a chofer correctamente");
	$("#btnRegresarFolio").hide()   
	setTimeout(() => 
	{
		$("#esperaValidaDetalleChofer").hide();  
		$("#mdlRegresarFolioChofer").modal('hide')    
		validarAlmacen(); clearDiv()  
	}, 5000); 
	
}
function cancelarFactura(factura)
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
			console.log(json)  
				document.getElementById('cargando').style.display = 'none'; 
			rsp = JSON.parse(json.replace(/=/g,":"))
			if (rsp.length > 0)
			{
				var msj = obtenerMensajeCancelar(rsp)
				 if (msj == 'true') 
				 {
					 
					 var obj = new Object()   
						obj.proceso = "181";
						obj.query = "30";
						obj.operacion = "UpdateFacturas";  
						obj.estatus_nuevo = "7";
						obj.estatus_nuevo_tc = "2";
						obj.ode = rsp[0].ode;
						obj.folio = rsp[0].folio;
						obj.pedido = rsp[0].pedido;
						obj.estatus = "4";     
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
									 consultarFacturasEscaneadas();
									alertMsj('true', "Se regreso la factura correctamente")
									$("#txtFactura").val(""); 
									$("#txtFacturaCancelar").val(""); 
									document.getElementById("txtFactura").focus();	 
								 }
								 else  
								 {
									alertMsj('false', "No se pudo regresar la factura, intente nuevamente") 
									$("#txtFactura").val("");
									$("#txtFacturaCancelar").val("");
									document.getElementById("txtFactura").focus(); 
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
					 $("#txtFacturaCancelar").val(""); 
						document.getElementById("txtFacturaCancelar").focus();      
				 }
			}
			else
			{
				alertMsj('warning',"No se encontraron facturas escaneadas previamente")
				$("#txtFacturaCancelar").val(""); 
				 document.getElementById("txtFacturaCancelar").focus();
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
function fechaActual()
{
	var fecha = new Date();
	let dia = String(fecha.getDate()).padStart(2, '0');
	let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
	let year = fecha.getFullYear();

	fecha = dia + '/' + mes + '/' + year;
	return fecha;
}
function aplicaFormato(fechas) {
    let fecha = fechas;
    if (fechas.includes("/")) {
        let arrayFecha = fechas.split("/");
        fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
    }
    return fecha;
}

async function enviarFactura()
{
	$("#folioConfirmacion").val('')  
	$("#enviarAlmacenBtn").val("")    
	$("#btnRegresarFolio").hide()
	$("#enviarAlmacenBtn").hide()
	alerta()
	$("#enviarAlmacen").hide()
	$("#enviarCredito").hide()
	$("#titleEnvio").empty()
	$("#enviarEncargado").hide()  
	var table = $("#facturasCorrectas").val()   
	var obj = new Object()      
		obj.proceso = "181";  
//		obj.estatus = "1,4";  
		obj.query = "21";
		var valorSeleccionado = $("input[name='exampleRadios']:checked").val();
		obj.where= createWhere($("#txtFolio").val(), valorSeleccionado !== undefined ? valorSeleccionado : 0 );  
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
	document.getElementById('cargando').style.display = 'block';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{
		let fl = [...new Set(JSON.parse(n.replace(/=/g,":")).map(item => item.folio))].join(", ");
		var obj = new Object()      
			obj.proceso = "181";  
			obj.query = "31";      
			obj.folios = [...new Set(JSON.parse(n.replace(/=/g,":")).map(item => item.folio))].join(", ");        
			obj.tipo = "select";        
			obj.operacion = "consulta facturas confirmadas para enviar a credito";
		document.getElementById('cargando').style.display = 'block';
		const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
		       
		if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)             
		{
			  
			document.getElementById('cargando').style.display = 'none';    
			$("#mdlEnviar").modal("toggle");   
			
			$("#titleEnvio").html("No se puede enviar a credito, hay facturas pendientes de los siguientes folios:<br>"+                
					Object.entries(JSON.parse(n2.replace(/=/g,":")).reduce((res, item) => (res[item.folio] = (res[item.folio] || 0) + 1, res), {}))  
					.sort((a, b) => b[1] - a[1])  
					.map(([folio, total]) => `Folio: ${folio} - Facturas pendientes:  ${total}`)       
				    .join("<br>"));   
			
	//		$("#lblFacturas").text(json.map(item => item.factura).join(", "));  
//			$("#enviarAlmacen").hide() 
		}
		else
		{
			var obj = new Object()      
			obj.proceso = "181";  
			obj.query = "56";
			obj.tipo = "select";        
			obj.operacion = "consulta facturas confirmadas para enviar a credito";
			const n3 = await prb('Execution', 'execute',JSON.stringify(obj));
			if (n3.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n3.replace(/=/g,":"))) : false)             
			{	  
				document.getElementById('cargando').style.display = 'none'; 
				$("#esperaValidaDetalleChofer").show() 	
				$("#mdlRegresarFolioChofer").modal('toggle')
				var valorSeleccionado = $("input[name='exampleRadios']:checked").val();    
				var obj = new Object()      
				obj.proceso = "181";  
				obj.query = "57";       
				obj.where= fl;     
				obj.tipo = "select";           
				obj.operacion = "consulta facturas confirmadas para enviar a credito";
				const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
				if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
				{
					let json2 = JSON.parse(n3.replace(/=/g,":"))  
					let json = JSON.parse(n.replace(/=/g,":"))  
					rsp = JSON.parse(n2.replace(/=/g,":")) 
					$("#btnRegresarFolio").hide()
					$("#enviarAlmacenBtn").val(fl)    
					$("#enviarAlmacenBtn").show()  
					llenarTablaDetalleChofer(rsp);
					$("#esperaValidaDetalleChofer").hide()
					$("#mdlRegresarFolioChoferLb").text("SE ENVIARAN "+json.length+" FACTURAS AL AREA DE CREDITO. SE GENERARA EL FOLIO DE CREDITO: "+json2[0].folio)
					$("#folioConfirmacion").val(json2[0].folio)   
					
				}
				else
				{
					$("#esperaValidaDetalleChofer").hide() 
					alert("No se encontraron facturas")
					$("#mdlAlmacenFolioKey").modal('toggle')       
					$("#mdlRegresarFolioChofer").modal('hide')
				}   
				
//				let json2 = JSON.parse(n3.replace(/=/g,":"))
//				let json = JSON.parse(n.replace(/=/g,":"))  
//				document.getElementById('cargando').style.display = 'none';     
//				$("#mdlEnviar").modal("toggle");   
//				$("#titleEnvio").text("SE ENVIARAN "+json.length+" FACTURAS AL AREA DE CREDITO. SE GENERARA EL FOLIO DE CREDITO: "+json2[0].folio);    
//				$("#enviarAlmacen").show()
			}
		}
	}	
	else
	{
		document.getElementById('cargando').style.display = 'none';   
		alertMsj('warning',"No hay facturas confirmadas para enviar a credito")
	}
 	
 	  
} 

function FormatearTotalesDeGrid(importe)
{
	let importeTotalGrid = parseFloat(importe).toFixed(2);
	importeTotalGrid = agregarCommas(importeTotalGrid);
	return importeTotalGrid;
}
function agregarCommas(importe) {
	importe += '';
    x = importe.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


async function detalleEscaneoAlmacen()     
{
	$('#divPrevio').empty();
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "21";      
	obj.tipo = "select";        
	obj.operacion = "consulta previo almacen";
	var valorSeleccionado = $("input[name='exampleRadios']:checked").val();  
	obj.where= createWhere($("#txtFolio").val(), valorSeleccionado !== undefined ? valorSeleccionado : 0 );
	document.getElementById('cargando').style.display = 'block';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)             
	{ 
		let json = JSON.parse(n.replace(/=/g,":"))
		llenarMdl(json);   
	}
	else
	{
		document.getElementById('cargando').style.display = 'none';   
		alertMsj('warning',"No se encontraron facturas escaneadas")
	}
}  
function sendFacturasCredito() 
{
	if ($("#folioConfirmacion").val() == '') return alert('Detalle al obtener folio, intente nuevamente'); 
	let text = "CONFIRME PARA MANDAR FACTURAS A CREDITO";    
	if (confirm(text) == true) 
	{
		$('#divTableDetalleChofer').hide();   
		$("#esperaValidaDetalleChofer").show();
		$("#warningDetalleChofer").hide()
		$("#esperaValidaProcSurtFac").show()
		var obj = new Object()    
		obj.proceso = "1";
		obj.query = "10";     
		obj.operacion = "UpdateFacturas";
		obj.estatus_nuevo = "1"; 
		obj.estatus = "4";     
		obj.folios = ""+$("#enviarAlmacenBtn").val()+"";       
		obj.estatus_tc = "5";
		obj.folioconfirmacion = $("#folioConfirmacion").val();
		obj.fechacorte = aplicaFormato(fechaActual());     
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
				$("#esperaValidaDetalleChofer").hide()  
				 if (rsp.length > 0)
				 {       
					 	$('#divTableDetalleChofer').empty();     
						$("#warningDetalleChofer").show()
						$("#warningDetalleChoferLb").text("SE ENVIARON CORRECTAMENTE LAS FACTURAS");
						$("#enviarAlmacenBtn").hide()   
						setTimeout(() => 
						{
							$("#warningDetalleChofer").hide()
							$("#esperaValidaDetalleChofer").hide();   
							$("#mdlRegresarFolioChofer").modal('hide')      
							validarAlmacen(); clearDiv()  
						}, 5000);   	 
				 }     
				 else  
				 {
					$("#warningDetalleChofer").show()
					$("#warningDetalleChoferLb").text("No se pudieron enviar las facturas, intente nuevamente");
				 }      
			},
			error : function(xhr, status, error) 
			{
				$("#esperaValidaProcSurtFac").hide()
				$("#enviarAlmacen").show() 
				$("#mdlEnviar").modal("hide"); 
				document.getElementById('cargando').style.display = 'none';
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
let totalPrevioEnc = 0;
function llenarMdl(json)
{
	totalPrevioEnc = 0;
	document.getElementById('cargando').style.display = 'none';    
	$("#mdlPrevio").modal("toggle");      
	$("#lblPrevio").text("PREVIO FACTURAS ESCANEADAS");
	let contenido = 
		"<table id='tb_articulosDetallePrevio' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+
		"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
		"<tr id='tr_articulosDetalle' class='f33liberados'>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO</label></div></th>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
		"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
		"</tr>"+ 
	"</thead>"+
	"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	
	for(let i=0; i < json.length ; i++) 
	{
		totalPrevioEnc++;
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
		  
		 contenido += "" +
		 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].folio+" </div></td>" +     
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+(json[i].cliente.substring(0,5))+" </div></td>" +                                 
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
		"</tr>" ;
	}   
	contenido +="</tbody>" +
	"</table>";
	$("#divPrevio").append(contenido);
	$("#titlePrevio").text("TOTAL DE FACTURAS: "+totalPrevioEnc)
	aplicarEstiloTablaConfirmacionFacturasPrevio();   
}

function llenarTablaPedidosDisponibles(json) 
{
	$('#divTableFacturas').empty();
	$('#customBody').empty();
	$('#divFilter').empty();
	$('#customBody').empty();
	$('#divFilter').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalle' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ODE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TIPO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TRANSPORTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CHOFER</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMP. COBRADO</label></div></th>"+ 
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CP</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>RUTA</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	for(let i=0; i < json.length ; i++)
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
		  
		 contenido += "" +
		 	 "<td id='td_articulosDetalle0' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> "+json[i].folio+" </td>" +     
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" +   
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ode+" </div></td>" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].tipo+" </div></td>" +
		 	"<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].trans.substring(0,20)+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].chofer.substring(0,20)+" </div></td>" +  
			 "<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].cliente.substring(0,20)+" </div></td>" +       
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe_cobrado)+" </div></td>" +    
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].condicion+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ruta+" </div></td>" +   
			 
			    
		"</tr>" ;
	}  
	contenido +="</tbody>" +
	"</table>";
	$("#divTableFacturas").append(contenido);
	aplicarEstiloTablaConfirmacionFacturas();
} 





function llenarTablaDetalleChofer(json) 
{
	$('#divTableDetalleChofer').empty();

	const foliosUnicosArray = [...new Set(json.map(item => item.folio))];    
	$("#btnRegresarFolio").val(foliosUnicosArray)
	let contenido = '';
	for (var j = 0; j < foliosUnicosArray.length; j++) 
	{
		contenido += 
			" <div style = 'width:99%;max-height: 100%;!important;margin-bottom: 20px;' align='left' class='mv'>" +    
			"<p style ='    margin-bottom: 0px;     background: black;     color: white; '>FOLIO DE RUTA: <label style='font-weight: bold;    margin-bottom: 0px;'>"+foliosUnicosArray[j]+"</label> FACTURAS: <label style= '    font-weight: bold;    margin-bottom: 0px;' >"+json.filter(item => item.folio === foliosUnicosArray[j]).length+"</label>" +
					" CHOFER: <label style='    font-weight: bold;    margin-bottom: 0px;' >"+obtenerValueJson(json,foliosUnicosArray[j],"folio",'chofer').substring(0,20)+"</label> TIPO: <label style='    font-weight: bold;    margin-bottom: 0px;' >"+obtenerValueJson(json,foliosUnicosArray[j],"folio",'tipo')+"</label></p> " +                                          
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
			if(json[i].folio == foliosUnicosArray[j])
			{
				contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
				contenido += "" +
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" +    
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ode+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe_cobrado)+" </div></td>" +    
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].condicion+" </div></td>" +
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 0px;padding-top: 0px;    vertical-align: middle'  class = 'AltoTD bordesTd'><div style='width: max-content;    padding-left: 5px;padding-right: 5px;"+(json[i].estatus == 'Escaneado Almacen' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"'> "+json[i].estatus+" </div></td>" +             
				"</tr>" ;
			} 
		}  
		contenido +="</tbody>" +
		"</table> </div>";    
	}
	
	
	$("#divTableDetalleChofer").append(contenido);
	$("#divTableDetalleChofer").show()
	const divTableDetalleChofer = document.getElementById("divTableDetalleChofer");
	const distanciaDesdeElInicio = divTableDetalleChofer.getBoundingClientRect().top;
	const alturaDeseada = window.innerHeight - document.getElementById("divTableDetalleChofer").getBoundingClientRect().top;
	document.getElementById("divTableDetalleChofer").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio) + "px ";
	
} 

function obtenerValueJson(json, valor, campo,get) 
{   
	  let elemento = json.find(item => item[campo] === valor);
	  return elemento ? elemento[get] : null;   
	}


