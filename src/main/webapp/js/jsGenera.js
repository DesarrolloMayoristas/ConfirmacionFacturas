let jsonCreditoGenera;
function validarGenera()   
{
	$("#facurasCreditoGenera").hide()      
	$("#titleCreditoGenera").hide()
	$("#lblCreditoGenera").hide()
	$("#lblCreditoGenera").hide()
	$("#divTableFacturasCreditoConfirma").empty();
	$("#customBodyCreditoConfirma").empty();
	$("#divFilterCreditoConfirma").empty();
	$("#divTableFacturasCreditoGenera").empty();
	$("#customBodyCreditoGenera").empty();
	$("#divFilterCreditoGenera").empty();
	
}    

function armarWhere(av,cte,fini,ffin,tipo) 
{
	let where = ' '; 
	if (cte != ''){ where = ' and hp.num_cli in ('+cte+') ' }
	if (av != ''){ where += ' and hp.num_agente in ('+av+') ' }  
	if (fini != '' && ffin != '' && tipo == 1){  where = ((where == '') ? '' : where); where +=  " and f.fecha_factura BETWEEN '"+formatFecha(fini)+"' AND '"+formatFecha(ffin)+"' GROUP BY cd.num_fac " }       
	if (fini != '' && ffin != '' && tipo == 0){ where = ((where == '') ? '' : where); where += " GROUP BY cd.num_fac HAVING dias <= 7 and dias > 0 " }  
	
	return where.replace('where and', 'where ');  
}

function formatFecha(fechas) 
{
    let fecha = fechas;
    if (fechas.includes("/")) {
        let arrayFecha = fechas.split("/");
        fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
    }
    return fecha;
}

async function consultaGenera() 
{
	alerta() 
	jsonCreditoGenera = null; 
	let ecc = $("#txtEccF").val(), av = $("#txtAvF").val(), cte = $("#txtClienteF").val(), fini = $("#txtFechaIniF").val(), ffin = $("#txtFechaFinF").val(), tipo = $("input[name='exampleRadiosF']:checked").val();
	if (ecc == '') {  ecc =$("#usr").val();  $("#txtEccF").val(ecc) } 
	if(cte != '') $("#txtAvF").val("");
	if(av != '') $("#txtClienteF").val("");  
	document.getElementById('cargando').style.display = 'block';       
	var obj = new Object()      
	obj.proceso = "181";      
	obj.query = "68";    
	obj.tipo = "select";
	obj.where =  armarWhere(av,cte,fini,ffin,tipo);   
	obj.operacion = "consultaFacturas";
	obj.usr = ecc;      
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	document.getElementById('cargando').style.display = 'none';   
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n2.replace(/=/g,":"))
		console.log("sss") 
		console.log(rsp) 
		jsonCreditoGenera = null;  
					if(rsp.length>0)
			{ 
				jsonCreditoGenera = rsp;
				$("#facurasCreditoGenera").show()   
				$("#titleCreditoGenera").show()
				$("#lblCreditoGenera").show()
				$("#lblCreditoGenera").show() 
				 
				llenarTablaPedidosDisponiblesCreditoGenera(rsp);
				document.getElementById("txtFacturaCreditoGenera").focus();
//				toggleButtonsss('hideCobranzaECC')      
//				enableButtonsss()         
			}	
			else
			{   
//				enableButtonsss()   
//				toggleButtonsss('hideEscaneoECC')          
//				enableButtonsSelectors('hideCobranzaECC')    
				$("#divTableFacturasCreditoGenera").empty();
				$("#facurasCreditoGenera").hide()   
				$("#titleCreditoGenera").hide()
				$("#lblCreditoGenera").hide() 
				$("#lblCreditoGenera").hide() 
//				clearDiv() 
				$("#facurasCreditoGenera").show()              
			alertMsj('warning',"No se encontraron facturas en estatus pendiente") 
			validarGenera() 
			$("#txtFacturaCreditoGenera").val("");  
			}
	}
	else
	{
		$("#divTableFacturasCreditoGenera").empty();
		$("#customBodyCreditoGenera").empty();
		$("#divFilterCreditoGenera").empty(); 
		$("#facurasCreditoGenera").hide()   
		$("#titleCreditoGenera").hide()
		$("#lblCreditoGenera").hide() 
		$("#lblCreditoGenera").hide() 
		$("#facurasCreditoGenera").hide()  
//		clearDiv() 
		$("#facurasCreditoGenera").show()                     
		validarGenera()  
	alertMsj('warning',"No se encontraron facturas en estatus pendiente")    
	$("#txtFacturaCreditoGenera").val("");    
	}
}

function llenarTablaPedidosDisponiblesCreditoGenera(json) 
{
	$('#divTableFacturasCreditoGenera').empty();  
	$('#customBodyCreditoEncargado').empty();
	$('#divFilterCreditoEncargado').empty();
	$('#customBodyCreditoGenera').empty();
	$('#divFilterCreditoGenera').empty();
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalleCreditoGenera' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>SALDO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA FACTURA</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA VENCIMIENTO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>DIAS RESTANTES</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>OBSERVACIONES</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FOLIO ANTERIOR</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
							"</tr>"+ 
						"</thead>"+
						"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	var aux = 0; 
	for(let i=0; i < json.length ; i++)
	{
	 
	if (json[i].marca != "*")  
	{
		contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;'>"; 		 
		contenido += "" + 
		"<td id='td_articulosDetalle0' align='center'  style= 'padding-bottom: 4px;padding-top: 4px; '  class = 'AltoTD bordesTd'> "+json[i].av+" </td>" +
		"<td id='td_articulosDetalle4' align='left'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+(json[i].cte + " "+ (json[i].clienteNombre.substring(0,28)) )+" </div></td>" +       
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].factura+" </div></td>" +
		"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
		"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].saldo)+" </div></td>" +
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_factura+" </div></td>" +
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_vencim+" </div></td>" +
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].dias+" </div></td>" + 
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].observaciones+" </div></td>" + 
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folioAnterior+" </div></td>" +  
		"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+(json[i].estatus)+" </div></td>" + 
		"</tr>" ;
		
	}
	}
	$("#facturasCorrectasGenera").val(aux)
	contenido +="</tbody>" +
	"</table>";
	$("#divTableFacturasCreditoGenera").append(contenido);
	$("#facurasCreditoGenera").show()  
	aplicarEstiloTablaConfirmacionFacturasCreditoGenera();
} 

 async function escanearFacturaCreditoGenera(factura)
{
	factura = factura.toLowerCase()
	alerta()
	var validate = validarFacturaCreditoGenera(factura);
	validate = (validate != 'true') ? validarFacturaCreditoGenera(factura.toUpperCase()) : validate;    
	
	if (validate == 'true')  
	{
		factura = validarFacturaCreditoGenera(factura.toUpperCase()) == 'true' ? factura.toUpperCase() : factura;
		actualizarMarca(jsonCreditoGenera, factura)
		
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "74"; 
		obj.id = obtenerValorJSON(jsonCreditoGenera, factura,"id");
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		$("#esperaValidaAlmacenKey").show()
		document.getElementById('cargando').style.display = 'block';
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
		document.getElementById('cargando').style.display = 'none'; 
		llenarTablaPedidosDisponiblesCreditoGenera(jsonCreditoGenera) 
		alertMsj('true',"Factura escaneada correctamente")
		$("#txtFacturaCreditoGenera").val(""); 
		document.getElementById("txtFacturaCreditoGenera").focus(); 	 
	}
	else
	{
		alertMsj('warning',validate)
		$("#txtFacturaCreditoGenera").val(""); 
		 document.getElementById("txtFacturaCreditoGenera").focus();  
	}
}
function validarMarca(json, facturaABuscar) 
{
	  const factura = json.find(item => item.factura === facturaABuscar);
	  return factura ? (factura.marca === "*" ? "true" : "Debe escanear primero la factura") : "Factura no encontrada";
}

async function cancelarFacturaCreditoGenera(factura)
{
	alerta() 
	let vld = validarMarca(jsonCreditoGenera,factura);   
	if (vld == 'true') 
	{
		jsonCreditoGenera.forEach(item => {
		    if (item.factura === factura) item.marca = "";
		    if (item.factura === factura) item.estatus = "Confirmado Encargado Credito Agente";
		  }); 
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "75"; 
		obj.id = obtenerValorJSON(jsonCreditoGenera, factura,"id");
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		$("#esperaValidaAlmacenKey").show()
		document.getElementById('cargando').style.display = 'block';
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
		document.getElementById('cargando').style.display = 'none'; 
		llenarTablaPedidosDisponiblesCreditoGenera(jsonCreditoGenera);
		alertMsj('true',"Factura escaneada correctamente")   
		$("#txtFacturaCreditoGenera").val("");
		$("#txtFacturaCancelarCreditoGenera").val(""); 
		document.getElementById("txtFacturaCancelarCreditoGenera").focus();  	  
	}
	else
	{
		alertMsj('warning',vld)
		$("#txtFacturaCancelarCreditoGenera").val("");   
		document.getElementById("txtFacturaCancelarCreditoGenera").focus();   
	}
}

function detalleEscaneoCreditoGenera() 
{
	alerta() 
	llenarMdlGenera(jsonCreditoGenera)  
}

function pintarDetalleGenera()
{
	$("#dangerDetalleCreditoGenera").hide()
	$("#dangerDetalleCreditoLbGenera").text("") 
	alerta()    
	$("#warningDetalleCreditoGenera").hide()
	$("#txtFechaIniGenera").val("");  
	$("#btnRegresarFolioCreditoGenera").show()   
	$("#mdlRegresarFolioCreditoGenera").modal('toggle')
	$("#mdlRegresarFolioCreditoLbGenera").text("SE REALIZARA RELACION DE COBRANZA DE LAS SIGUIENTES FACTURAS: ");
	llenarTablaDetalleCreditoGenera(jsonCreditoGenera)   
	
}


async function validarPassGenera()
{
	$("#dangerDetalleCreditoGenera").hide()
	$("#dangerDetalleCreditoLbGenera").text("")
	let pass = $("#passCreditoGenera").val();
	if (pass != '') 
	{
		$("#esperaValidaDetalleCreditoGenera").show()
		var obj = new Object()       
		obj.proceso = "181";        
//		obj.estatus = "1,4";
		obj.pass = pass;
		obj.query = "73";            
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito encargado";
		const n = await prb('Execution', 'execute',JSON.stringify(obj)); 
		if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)        
		{
			$("#esperaValidaDetalleCreditoGenera").hide()
			let json = JSON.parse(n.replace(/=/g,":"))
			if (json[0].validacion == 'accesar')   
			{
				$("#autenticacionGenera").hide();
				$("#btnRegresarFolioCreditoGenera").show();   
			}
			else
			{
				$("#dangerDetalleCreditoGenera").show()
				$("#dangerDetalleCreditoLbGenera").text("Contraseña incorrecta, intente nuevamente")  
				$("#passCreditoGenera").val("");
				document.getElementById("passCreditoGenera").focus();  	 
			}
		}
	}
	else
	{
		alertMsjUsr('warning',"Debe ingresar una contraseña")   
	}
	    
}

function llenarTablaDetalleCreditoGenera(json)   
{
	$("#passCreditoGenera").val("");
	$("#dangerDetalleCreditoGenera").hide()
	$("#autenticacionGenera").hide() 
	$("#btnRegresarFolioCreditoGenera").hide();
	$("#divTableDetalleCreditoGenera").empty();
	let contenido = 
		"<table id='tb_articulosDetallePrevio' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+
		"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
		"<tr id='tr_articulosDetalle' class='f33liberados'>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
		"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TIPO</label></div></th>"+  
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
		
		"</tr>"+ 
		"</thead>"+
		"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
	aux = 0;  
	for(let i=0; i < json.length ; i++) 
	{
		contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;display:none' name = '"+json[i].av+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;display:none' name = '"+json[i].av+"[]'>";     		 
			ttl++;            
			contenido += "" +
			"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
			"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].av+" </div></td>" +                           
			"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_factura+" </div></td>" +
			"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
			"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+(json[i].ca == '*' ? 'CONTRARECIBO' : '')+" </div></td>" +
			"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content; " +
			" padding-left: 5px;padding-right: 5px;"+(json[i].marca == '*' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"  " +
			"'> "+(json[i].marca == '*' ? 'ESCANEADA' : 'NO ESCANEADA')+" </div></td>" +      
			"</tr>" ;
			aux++;   
			if (json[i].av != (i == (json.length-1) ? 'as': json[i+1].av))
			{
				contenido += "<tr id = 'tr_articulosDetalle' style='background: black;color:white' onclick=ocultarTDa('"+json[i].av+"')>";   		 
				contenido += "" +
//		 	 "<td id='td_articulosDetalle2' align='right' colspan='4'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>TOTAL FACTURAS AGENTE "+json[i].agente+" </div></td>" +
				"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> <button type='button' id='btn' class='btn btn-info' style ='    padding-top: 0px;padding-bottom: 0px;padding-right: 4px;font-size: 12px;padding-left: 4px;'>Detalle</button> </div></td>" +
				"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" +
				"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" + 
				"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" +
				"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'>AGENTE "+json[i].av+"</div></td>" +  
				"<td id='td_articulosDetalle2' align='center' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> FACTURAS: "+aux+" </div></td>" +            
				"</tr>" ;
				aux = 0; 
			}    
	}  
	contenido +="</tbody>" +    
	"</table>";
//	autenticacionGenera  
	$("#autenticacionGenera").hide()
	$("#btnRegresarFolioCreditoGenera").show();
	if (jsonCreditoGenera.some(item => item.marca != "*"))  
	{
//		$("#btnRegresarFolioCreditoGenera").hide();
		
//		$("#autenticacionGenera").show()
	} 
	else
	{
		$("#btnRegresarFolioCreditoGenera").show();
		$("#autenticacionGenera").hide() 
	}
	$("#divTableDetalleCreditoGenera").append(contenido); 
	$("#divTableDetalleCreditoGenera").show()
	const divTableDetalleCredito = document.getElementById("divTableDetalleCreditoGenera");
	const distanciaDesdeElInicio = divTableDetalleCredito.getBoundingClientRect().top;
	const alturaDeseada = window.innerHeight - document.getElementById("divTableDetalleCreditoGenera").getBoundingClientRect().top;
	document.getElementById("divTableDetalleCreditoGenera").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio) + "px ";
	document.getElementById("passCreditoGenera").focus();  	  
} 




async function sendGenerCobranza() 
{
	$("#msjFirm").hide(); 
	if (jsonCreditoGenera.some(item => item.marca != "*"))  
	{
		
			$("#mdlRegresarFolioCreditoGenera").modal("hide")
			$("#mdlFirma").modal("show")
	} 
	else
	{
		$("#esperaValidaDetalleCreditoGenera").show() 
		let resultado = agruparPorAV(jsonCreditoGenera);  
		for (var i = 0; i < resultado.length; i++) 
		{   
			var obj = new Object()      
			obj.proceso = "181";  
			obj.query = "69";        	
			obj.tipo = "select";        
			obj.usr = $("#usr").val();;       
			obj.id = resultado[i].id;  
			obj.operacion = "consulta previo almacen";
			const n = await prb('Execution', 'execute',JSON.stringify(obj)); 
		}	   
		$("#esperaValidaDetalleCreditoGenera").hide()
		$("#mdlRegresarFolioCreditoGenera").modal('hide') 
		alert("Se genero relacion de cobranza correctamente")
		$("#txtFacturaCancelarCreditoGenera").val("");   
		document.getElementById("txtFacturaCancelarCreditoGenera").focus();
		jsonCreditoGenera = null;
		$("#divTableFacturasCreditoGenera").empty();
		$("#mdlRegresarFolioCreditoGenera").modal('hide') 
		validarGenera() 
	}
	
	
		 
}

function validaPsws(psw) 
{
	if(psw.value != null && psw.value != '')
		sha1s(psw);
	else
	{
//		alert('Ingresar una contraseña.'); 
		return false;
	}
}

/********** FUNCION PARA ENCRIPTAR CONTRASEÑA EN FORMATO SHA1 **********/
function sha1s(psw) 
{	
	psw.value = rstr2hex(rstr_sha1(psw.value));
	console.log(psw.value) 
}
 
async function validarFirma()
{
	$("#msjFirm").hide(); 
	let usuario = $("#firmaUsuario").val(), pass = $("#firmaContrasena").val() ;
	if (usuario == '') 
	{
		$("#msjFirm").show()
		$("#msjFirmLb").text(" DEBE INGRESAR UN USUARIO") 
		
		return false;
	}
	if (pass == '') 
	{
		$("#msjFirm").show()
		$("#msjFirmLb").text("DEBE INGRESAR UNA CONTRASEÑA")  
		return false;
	}
	var obj = new Object()      
	obj.proceso = "181";  
	obj.query = "81"; 
	obj.usuario = usuario;
	obj.pass = pass;
	obj.tipo = "select";         
	obj.operacion = "consulta facturas confirmadas para enviar a credito";
	$("#esperaFirm").show()
	const n = await prb('Execution', 'execute',JSON.stringify(obj));
	$("#esperaFirm").hide()  
	if (n.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n.replace(/=/g,":"))
		console.log(rsp)
		if(rsp[0].msj == 'correcto')
		{
			$("#mdlFirma").modal("hide")
			$("#mdlRegresarFolioCreditoGenera").modal("show") 
			
			
			$("#esperaValidaDetalleCreditoGenera").show() 
			let resultado = agruparPorAV(jsonCreditoGenera);  
			for (var i = 0; i < resultado.length; i++) 
			{   
				var obj = new Object()      
				obj.proceso = "181";  
				obj.query = "69";        	
				obj.tipo = "select";        
				obj.usr = $("#usr").val();;       
				obj.id = resultado[i].id;  
				obj.operacion = "consulta previo almacen";
				const nn = await prb('Execution', 'execute',JSON.stringify(obj)); 
			}	   
			$("#esperaValidaDetalleCreditoGenera").hide()
			$("#mdlRegresarFolioCreditoGenera").modal('hide') 
			alert("Se genero relacion de cobranza correctamente")
			$("#txtFacturaCancelarCreditoGenera").val("");   
			document.getElementById("txtFacturaCancelarCreditoGenera").focus();
			jsonCreditoGenera = null;
			$("#divTableFacturasCreditoGenera").empty();
			$("#mdlRegresarFolioCreditoGenera").modal('hide') 
			validarGenera() 
		}
		else
		{
			$("#msjFirm").show()
			$("#msjFirmLb").text("ATENCION! " +rsp[0].msj)
		}
	}
	else
	{
		$("#msjFirm").show()
		$("#msjFirmLb").text("ATENCION! Datos ingresados incorrectos") 
		$("#firmaUsuario").val("");
		$("#firmaContrasena").val(""); 
	}
}   


function agruparPorAV(json) {
	  const avIdMap = {};
	  
	  json.forEach(item => {
	    const { av, id } = item;
	    if (!avIdMap[av]) avIdMap[av] = { av, id: id.toString() };
	    else avIdMap[av].id += `,${id}`;
	  });

	  return Object.values(avIdMap);
	}

  
	


function llenarMdlGenera(json)
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
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>SALDO</label></div></th>"+
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
			"</tr>"+ 
			"</thead>"+
			"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
		aux = 0; 
		
		for(let i=0; i < json.length ; i++) 
		{
				contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;display:none' name = '"+json[i].av+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;display:none' name = '"+json[i].av+"[]'>";   		 
				ttl++;  
				contenido += "" +
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].av+" </div></td>" +                           
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_factura+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].saldo)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content; " +
				" padding-left: 5px;padding-right: 5px;"+(json[i].marca == '*' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"  " +
				"'> "+(json[i].marca == '*' ? 'ESCANEADA' : 'NO ESCANEADA')+" </div></td>" +    
				"</tr>" ;
				aux++;  
				if (json[i].av != (i == (json.length-1) ? 'as': json[i+1].av))
				{
					contenido += "<tr id = 'tr_articulosDetalle' style='background: black;color:white' onclick=ocultarTDa('"+json[i].av+"')>";   		 
					contenido += "" +
//			 	 "<td id='td_articulosDetalle2' align='right' colspan='4'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>TOTAL FACTURAS AGENTE "+json[i].agente+" </div></td>" +
					"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> <button type='button' id='btn' class='btn btn-info' style ='    padding-top: 0px;padding-bottom: 0px;padding-right: 4px;font-size: 12px;padding-left: 4px;'>Detalle</button> </div></td>" +
					"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" +
					"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" +
					"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" +
					"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'>AGENTE "+json[i].av+"</div></td>" +  
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



function actualizarMarca(json, facturaABuscar) {
	  json.forEach(item => {
	    if (item.factura === facturaABuscar) item.marca = "*";
	  });
	}
function validarValorJSON(json, factura) {
	  return json.some(item => item.factura === factura && item.marca != '*');  
	}
  
function validarFacturaCreditoGenera(factura)
{  
	if (validarValorJSON(jsonCreditoGenera, factura)) {        
		  return 'true'
		} else { 
			return 'La factura '+factura+' no esta mostrada en la tabla';  
		}
}