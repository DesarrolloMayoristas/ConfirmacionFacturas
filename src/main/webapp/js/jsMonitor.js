function consultaRelacion()
{
	 
}

function imprimirRelacion() 
{
	let fac = $("#txtFacturaR").val(); 
	if (fac != '') 
	{
		alert("Se reimprimio la cobranza en la que esta la factura "+$("#txtFacturaR").val())
		$("#txtFacturaR").text("");
		document.getElementById("txtFacturaR").focus();
	}
	else
	{
		alert("Debe ingresar una factura");  
		document.getElementById("txtFacturaR").focus();
	}
}

let jsonMonitor;
async function consultaMonitor() 
{
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty();
	$('#divTableMonitor').empty();
	$("#titleMonitor").hide() 
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();   
	$('#divFilterMonitorg').empty();       
	$("#titleMonitorg").hide() 
	var obj = new Object()      
	obj.proceso = "181";  
//	obj.estatus = "1,4";  
	obj.query = "18";
	obj.fechaIni = aplicaFormatoFecha($("#txt_fechaIni").val());
	obj.fechaFin = aplicaFormatoFecha($("#txt_fechaFin").val());
	obj.pedido = validarFiltro($("#txtPedido").val(),'pedido');
	obj.factura = validarFiltro($("#txtFacturaM").val(),'factura');
	obj.agente = validarFiltro($("#txtAgente").val(),'agente');
	obj.almacen = validarFiltro($("#txtUsuarioAlmacen").val(),'usuarioAlmacen');
	obj.credito = validarFiltro($("#txtUsuarioCredito").val(),'usuarioCredito');  
	obj.encargado = validarFiltro($("#txtUsuarioEncargado").val(),'usuarioEncargado');
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
	document.getElementById('divTableMonitorg').style.display = 'none';
	document.getElementById('cargandoV2').style.display = 'grid';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
	{
		document.getElementById('cargandoV2').style.display = 'none'; 
		rsp = JSON.parse(n.replace(/=/g,":")) 
		if(rsp.length>0)
		{
			$("#titleMonitor").show()      
			jsonMonitor = rsp;
//			$("#facurasAlmacen").show()        
			llenarTablaPedidosDisponiblesMonitor(rsp);
			document.getElementById('divTableMonitorg').style.display = 'block'; 
			document.getElementById("txtFacturaM").focus();  
		}	
		else
		{      
			$("#facurasAlmacen").show()   
			$("#titleMonitor").hide()     
			clearDiv() 
			alertMsj('warning', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaIni").val() + " - "+$("#txt_fechaFin").val()) 
			document.getElementById("txtFacturaM").focus();   
		}
	}
	else
	{
		document.getElementById('cargandoV2').style.display = 'none';    
		alertMsj('warning', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaIni").val() + " - "+$("#txt_fechaFin").val()) 
	}
}





let jsonMonitorg;  
async function consultaMonitorg() 
{
	clearDiv() 
	$("#txtPedidog").val("")
	$("#txtFacturag").val("")  
	$('#divTableMonitorg').empty();
	$("#titleMonitorg").hide() 
	$('#customBodyMonitorg').empty();   
	$('#divFilterMonitorg').empty();
clearDiv()
	
	$('#divTableMonitorg').empty();
	$('#customBodyMonitorg').empty();   
	$("#titleMonitorg").hide() 
	$('#divFilterMonitorg').empty();
clearDiv()
	
	$('#divTableMonitor').empty();
	$('#customBodyMonitor').empty();   
	$("#titleMonitor").hide() 
	$('#divFilterMonitor').empty();
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty(); 
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "46";
	obj.fechaIni = aplicaFormatoFecha($("#txt_fechaInig").val());
	obj.fechaFin = aplicaFormatoFecha($("#txt_fechaFing").val());
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
	document.getElementById('divTableMonitorg').style.display = 'none';
	document.getElementById('cargandoV2').style.display = 'grid'; 
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
	{
		document.getElementById('cargandoV2').style.display = 'none'; 
		rsp = JSON.parse(n.replace(/=/g,":"))  
		if(rsp.length>0)
		{
//			$("#divTableMonitorg").show()      
			$("#mpendienteFol").text(obtenerTotalPorCampo(rsp, "0", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "0", "id_estatus") > 0)$("#mpendienteD").css("background-color", "#ffc107");
			$("#mtransitoFol").text(obtenerTotalPorCampo(rsp, "1", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "1", "id_estatus") > 0)$("#mtransitoD").css("background-color", "#ffc107");
			$("#mentregadoFol").text(obtenerTotalPorCampo(rsp, "2", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "2", "id_estatus") > 0)$("#mentregadoD").css("background-color", "#ffc107"); 
			$("#mcanceladoFol").text(obtenerTotalPorCampo(rsp, "3", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "3", "id_estatus") > 0)$("#mcanceladoD").css("background-color", "#ffc107");
			$("#mreprogramadoFol").text(obtenerTotalPorCampo(rsp, "8", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "8", "id_estatus") > 0)$("#mreprogramadoD").css("background-color", "#ffc107");
			$("#mregionalFol").text(obtenerTotalPorCampo(rsp, "4", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "4", "id_estatus") > 0)$("#mregionalD").css("background-color", "#ffc107");
			$("#mdevolucionFol").text(obtenerTotalPorCampo(rsp, "9", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "9", "id_estatus") > 0)$("#mdevolucionD").css("background-color", "#ffc107");
			$("#menviosFol").text(obtenerTotalPorCampo(rsp, "5", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "5", "id_estatus") > 0)$("#menviosD").css("background-color", "#ffc107");
			$("#mcorteFol").text(obtenerTotalPorCampo(rsp, "7" ,"id_estatus"));
			if(obtenerTotalPorCampo(rsp, "7", "id_estatus") > 0)$("#mcorteD").css("background-color", "#ffc107");
			$("#mcreditoFol").text(obtenerTotalPorCampo(rsp, "6", "id_estatus"));
			if(obtenerTotalPorCampo(rsp, "6", "id_estatus") > 0)$("#mcreditoD").css("background-color", "#ffc107");
			$("#meccFol").text(obtenerTotalPorCampo(rsp, "13", "id_estatus") );    
			if(obtenerTotalPorCampo(rsp, "13", "id_estatus") > 0)$("#meccD").css("background-color", "#ffc107");
			$("#mrelacionFol").text(obtenerTotalPorCampo(rsp, "11", "id_estatus") );
			if(obtenerTotalPorCampo(rsp, "11", "id_estatus") > 0)$("#mrelacionD").css("background-color", "#ffc107");       
		}	
		else
		{      
			$("#divTableMonitorg").hide()       
			clearDiv() 
			alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val())    
		}
	}
	else
	{
		document.getElementById('cargandoV2').style.display = 'none';
		alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val()) 
	}
}

async function mldDetalle(factura,pedido,ode,folio) 
{
//	divTableMonitorgDetalle
//	$("#esperaValidaCreditoCorteFinalD").show() 
	$('#divTableMonitorgDetalle').empty();
	$("#mldDetalle").modal("toggle");
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "50";
	obj.factura= ""+factura+"";     
	obj.pedido = ""+pedido+"";
	obj.ode = ""+ode+"";     
	obj.folio = ""+folio+"";    
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
//	document.getElementById('cargando').style.display = 'block';
//	const n = await prb('Execution', 'execute',JSON.stringify(obj));
//	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
//	{
//		rsp = JSON.parse(n.replace(/=/g,":")) 
//		console.log(rsp)   
//		if(rsp.length>0)
//		{ 
////			llenarTablaPedidosDisponiblesMonitorgDetalle(rsp);
//		}
//		$("#esperaValidaCreditoCorteFinalD").hide()
//	}
//	else
//		{
//		$("#esperaValidaCreditoCorteFinalD").hide()
//		}
//	
	     	
}

//let jsonMonitorg; 
async function cosnultargfiltros()     
{
	clearDiv()
	$('#divTableMonitorg').empty();
	$('#customBodyMonitorg').empty();   
	$("#titleMonitorg").hide() 
	$('#divFilterMonitorg').empty();
	
	let pedido = "", factura = "", fecha = "";
	pedido= validarFiltrog($("#txtPedidog").val(),'pedido');
	factura= validarFiltrog($("#txtFacturag").val(),'factura');
	fecha = " where e.fecha_pedido between '"+aplicaFormatoFecha($("#txt_fechaInig").val())+"' and '"+(aplicaFormatoFecha($("#txt_fechaFing").val())) + "' ";                  
	let wh = "";
	if (pedido != '' && factura != '') 
	{  
		wh = " where "+pedido + " and " +factura;
	}
	else if(pedido != '' || factura !='')
	{
		wh = " where " +pedido+factura; 
	}
	else 
	{
		wh = fecha;
	}
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = ""+49+"";         
	obj.where = wh ;   
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
	document.getElementById('cargando').style.display = 'block';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
	{
		document.getElementById('cargando').style.display = 'none';
		$("#txtPedidog").val("")
		$("#txtFacturag").val("")
		rsp = JSON.parse(n.replace(/=/g,":")) 
		if(rsp.length>0)
		{
			$("#divTableMonitorg").show()      
			jsonMonitorg = rsp;
			llenarTablaPedidosDisponiblesMonitorg(rsp);
			document.getElementById("txtFacturaM").focus();  
		}	
		else
		{      
			$("#divTableMonitorg").hide()       
			clearDiv() 
			alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val())    
		}
	}
	else
	{
		$("#txtPedidog").val("")
		$("#txtFacturag").val("")
		document.getElementById('cargando').style.display = 'none';
		alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val()) 
	}
}
  



//let jsonMonitorg; 
async function consultarmonitorgDetalle(total,estatus,msj,query)     
{
	
	console.log("1")
	$('#divTableMonitorg').empty();
	$('#divTableMonitorgDetalle').empty(); 
	$('#customBodyMonitorg').empty();
	console.log("2")
	$("#titleMonitorg").hide() 
	$('#divFilterMonitorg').empty();
	console.log("3")
	clearDiv()  
	if(total == "0")    
	{ 
		$("#divTableMonitorg").hide()       
		alertMsj('warningg', "No se hay facturas en estatus de "+msj)
		$("#customBodyMonitorg").empty()
		$("#divFilterMonitorg").empty()
		return  false;  
	}
	console.log("4")
	$('#divTableMonitorg').empty();
	$('#customBodyMonitorg').empty();
	console.log("5")
	$("#titleMonitorg").hide() 
	$('#divFilterMonitorg').empty();
	console.log("6")
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = ""+query+"";         
	obj.estatus = estatus;  
	obj.fechaIni = aplicaFormatoFecha($("#txt_fechaInig").val());
	obj.fechaFin = aplicaFormatoFecha($("#txt_fechaFing").val());
	obj.tipo = "select";        
	obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
	document.getElementById('divTableMonitorg').style.display = 'none';
	document.getElementById('cargandoV2').style.display = 'grid';
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
	{
		document.getElementById('cargandoV2').style.display = 'none'; 
		rsp = JSON.parse(n.replace(/=/g,":"))
		console.log("7")
		if(rsp.length>0)
		{
			$("#divTableMonitorg").show()      
			jsonMonitorg = rsp;
			llenarTablaPedidosDisponiblesMonitorg(rsp);
			document.getElementById("txtFacturaM").focus();  
		}	
		else
		{      
			$("#divTableMonitorg").hide()       
			clearDiv() 
			alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val())    
		}
	}
	else 
	{   
		document.getElementById('cargandoV2').style.display = 'none';
		alertMsj('warningg', "No se encontraron facturas en rango de fecha: "+$("#txt_fechaInig").val() + " - "+$("#txt_fechaFing").val()) 
	}
}



function validarFiltrog(valor,campo) 
{
	switch (campo) {
	case 'pedido':
		valor = valor != '' ? '   e.pedido = '+valor+' ' : ''
		break;
	case 'factura':
		valor = valor != '' ? '   c.num_fac= "'+valor+'" ' : '' 
		break;
	
	default:
		break;
	}
	return valor; 
}


function validarFiltro(valor,campo) 
{
	switch (campo) {
	case 'pedido':
		valor = valor != '' ? ' and  e.pedido = '+valor+' ' : ''
		break;
	case 'factura':
		valor = valor != '' ? ' and  c.num_fac= "'+valor+'" ' : '' 
		break;
	case 'agente':
		valor = valor != '' ? ' and  e.num_agente = '+valor+' ' : ''
		break;
	case 'usuarioAlmacen':
		valor = valor != '' ? ' and  cd.cve_usu_almacen= "'+valor+'" ' : ''
		break;
	case 'usuarioCredito':
		valor = valor != '' ? ' and  cd.cve_usu_credito= "'+valor+'" ' : ''
		break;
	case 'usuarioEncargado':
		valor = valor != '' ? ' and  cd.cve_usu_encargado_credito= "'+valor+'" ' : ''
		break;
	default:
		break;
	}
	return valor; 
}
function obtenerTotalPorCampo(json, valor, campo) {
	  const elemento = json.find(item => item[campo] === valor);
	  return elemento ? elemento.total : 0; 
	}
function obtenerTotalPorCampoecc(json, valor, campo) {
	  const elemento = json.find(item => item[campo] === valor);
	  return elemento ? elemento.total : 0; 
	}
function obtenerValorJSONg(json, factura,valor) 
{
	  let itemEncontrado = json.find(item => item.estatus === "0");     
	  return itemEncontrado ? itemEncontrado[valor] : null;    
}

function llenarTablaPedidosDisponiblesMonitor(json)  
{
	$('#divTableMonitor').empty();
	$('#customBodyMonitor').empty();
	$('#divFilterMonitor').empty();
	console.log(json)  
	let contenido = 
		 "<table id='tb_articulosDetalle' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
//							"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ODE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+ 
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ALMACEN</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ALMACEN</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CREDITO</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CREDITO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ENCARGADO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ENCARGADO CUBRE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ENCARGADO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CORTE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>COBRANZA</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
//	var aux = 0;     
	for(let i=0; i < json.length ; i++)
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
		  
		 contenido += "" +
//		 	 "<td id='td_articulosDetalle0' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> "+json[i].folio+" </td>" +      
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" +   
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ode+" </div></td>" +
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].agente+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].cliente.substring(0,5)+" </div></td>" +       
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].cve_usu_almacen.substring(0,(json[i].cve_usu_almacen.length>0?6:0))+" </div></td>" +   
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].hora_almacen+" "+json[i].fecha_almacen+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].cve_usu_credito.substring(0,(json[i].cve_usu_credito.length>0?6:0))+" </div></td>" +                  
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].hora_credito+" "+json[i].fecha_credito+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].cve_usu_encargado.substring(0,(json[i].cve_usu_encargado.length>0?6:0))+" </div></td>" +    
			 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+(json[i].usu_encargado == json[i].usu_cubre ? '' : json[i].cve_usu_cubre.substring(0,(json[i].cve_usu_cubre.length>0?6:0)))+" </div></td>" +      
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].hora_encargado+" "+json[i].fecha_encargado+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folio_corte+" </div></td>" +  
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].cobranza+" </div></td>" + 
			 
			 
			    
		"</tr>" ;
//		 if (json[i].id_estatus == 4) 
//		 {
//			 aux++;
//		 }
	}  
//	$("#facturasCorrectas").val(aux)
	contenido +="</tbody>" +
	"</table>";
	console.log("xfgsd"  )
	$("#divTableMonitor").append(contenido);
	aplicarEstiloTablaConfirmacionFacturasMonitor();
} 



function llenarTablaPedidosDisponiblesMonitorg(json)  
{
	$('#divTableMonitorg').empty();
	$('#customBodyMonitorg').empty();
	$('#divFilterMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalle' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TRAYECTO</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>PEDIDO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ODE</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+ 
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA PEDIDO</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
//	var aux = 0;     
	for(let i=0; i < json.length ; i++)
	{
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;' onclick=mldDetalle('"+json[i].factura+"',"+json[i].pedido+","+json[i].ode+","+json[i].folio+") >" : "<tr id = 'tr_articulosDetalle'onclick=mldDetalle('"+json[i].factura+"',"+json[i].pedido+","+json[i].ode+","+json[i].folio+")  style='background: #ffffff;'>";         		 
		  
		 contenido += "" +
		 	"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].folio+" </div></td>" +  
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].pedido+" </div></td>" +   
		 	 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].ode+" </div></td>" +
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].agente+" </div></td>" +
			 "<td id='td_articulosDetalle2' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].cliente.substring(0,5)+" </div></td>" +       
			 "<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
			 "<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha+" </div></td>" + 
		"</tr>" ;
	}
	contenido +="</tbody>" +
	"</table>" +
	"<table style='width: 100%'>" +
	"<tr>" +
	"<td align='right' width='60%'>" +  
		"<div style='width: 100%' align='right'>" +   
		"<div id='customBodyMonitorg' align='center' style='width: max-content;'></div>" + 
		"</div>" +   
	"</td>" +
	"<td align='right' width='40'>" +     
		"<div id='divFilterMonitorg' align='right'></div>" +       
	"</td>" +
	"</tr>" +
	"</table>" +    
	"";
	
	
	$("#divTableMonitorg").append(contenido);   
	aplicarEstiloTablaConfirmacionFacturasMonitorg();
} 


function llenarTablaPedidosDisponiblesMonitorgDetalle(json)  
{
	let contenido = 
		 "<table id='tb_articulosDetalle' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>Confirma Almacen</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>Confirma Credito</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>Confirma ECC</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>Corte</label></div></th>"+ 
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>Cobranza</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
//	var aux = 0;     
	for(let i=0; i < json.length ; i++)
	{  
	 contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;' >" : "<tr id = 'tr_articulosDetalle'  style='background: #ffffff;'>";  		 
		  
		 contenido += "" +
		 	 "<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;    padding-right: 2px;     padding-left: 2px;' title='"+json[i].cve_usu_almacen+"'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+((json[i].fecha_almacen) != '' ? (json[i].fecha_almacen+" "+json[i].hora_almacen) : 'Sin confirmar') +" </div></td>" +     
		 	"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;    padding-right: 2px;     padding-left: 2px;' title='"+json[i].cve_usu_credito+"' class = 'AltoTD bordesTd'> <div style='width: max-content'> "+((json[i].fecha_credito) != '' ? (json[i].fecha_credito+" "+json[i].hora_credito) : 'Sin confirmar')+" </div></td>" +
		 	"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;    padding-right: 2px;     padding-left: 2px;' title='"+json[i].cve_usu_encargado+"' class = 'AltoTD bordesTd'> <div style='width: max-content'> "+((json[i].fecha_encargado) != '' ? (json[i].fecha_encargado+" "+json[i].hora_encargado) : 'Sin confirmar')+" </div></td>" +    
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;    padding-right: 2px;     padding-left: 2px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folio_corte+" </div></td>" +
		 	"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;    padding-right: 2px;     padding-left: 2px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].cobranza+" </div></td>" + 
		"</tr>" ;
	}
	contenido +="</tbody>" +
	"</table>";  
	$("#divTableMonitorgDetalle").append(contenido);
	$("#divTableMonitorgDetalle").show();
	
} 




function aplicaFormatoFecha(fechas) {
    let fecha = fechas;
    if (fechas.includes("/")) {
        let arrayFecha = fechas.split("/");
        fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
    }
    return fecha;
}

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
function soloNumeros(e) {
	   var key = window.Event ? e.which : e.keyCode;
	   return ((key >= 48 && key <= 57) ||(key==8))
	 }