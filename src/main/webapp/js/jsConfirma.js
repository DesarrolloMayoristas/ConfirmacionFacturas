let jsonCreditoConfirma; 
function validarConfirma()           
{
	jsonCreditoConfirma = null; 
	$("#facurasCreditoConfirma").hide()      
	$("#titleCreditoConfirma").hide()   
	$("#lblCreditoConfirma").hide()
	$("#lblCreditoConfirma").hide()
	$("#txtFolioConfirma").val("") 
	$("#divTableFacturasCreditoConfirma").empty();
		$("#customBodyCreditoConfirma").empty();
		$("#divFilterCreditoConfirma").empty(); 
		$("#divTableFacturasCreditoConfirma").empty();
		$("#customBodyCreditoConfirma").empty();
		$("#divFilterCreditoConfirma").empty();
		$("#divTableFacturasCreditoGenera").empty();
		$("#customBodyCreditoGenera").empty();
		$("#divFilterCreditoGenera").empty();
	document.getElementById("txtFolioConfirma").focus();      
	
}  
   
function detalleEscaneoCreditoConfirma() 
{
	alerta() 
	llenarMdlConfirma(jsonCreditoConfirma)  
}


async function consultaConfirma(folio) 
{
	jsonCreditoConfirma = null;
	alerta() 
	console.log(folio) 
	if (folio == '') {alertMsj('warning',"Debe ingresar un folio de cobranza");document.getElementById("txtFolioConfirma").focus(); return false} 
	document.getElementById('cargando').style.display = 'block';       
	var obj = new Object()      
	obj.proceso = "181";      
	obj.query = "70";    
	obj.tipo = "select";
	obj.folio = folio;
	obj.operacion = "consultaFacturas";
	const n2 = await prb('Execution', 'execute',JSON.stringify(obj));
	document.getElementById('cargando').style.display = 'none';   
	if (n2.length > 5 ?((str => { try { JSON.parse(str); return true; } catch { return false; } })(n2.replace(/=/g,":"))) : false)
	{
		rsp = JSON.parse(n2.replace(/=/g,":"))
		jsonCreditoConfirma = rsp;
		$("#facurasCreditoConfirma").show()   
		$("#titleCreditoConfirma").show()
		$("#lblCreditoConfirma").show()
		$("#lblCreditoConfirma").show()
		llenarTablaPedidosDisponiblesCreditoConfirma(rsp);	
		$("#txtFacturaCreditoConfirma").val("") 
		document.getElementById("txtFacturaCreditoConfirma").focus();   
	}
	else 
	{
		$("#divTableFacturasCreditoConfirma").empty();
		$("#customBodyCreditoConfirma").empty();
		$("#divFilterCreditoConfirma").empty(); 
		$("#facurasCreditoConfirma").hide()   
		$("#titleCreditoConfirma").hide()
		$("#lblCreditoConfirma").hide() 
		$("#lblCreditoConfirma").hide() 
		$("#facurasCreditoConfirma").hide()  
		alertMsj('warning',"No se encontro el folio de cobranza "+folio+ " con facturas disponibles") 
		$("#txtFolioConfirma").val("");      
	}
}
function actualizarMarcaConfirma(json, facturaABuscar)   
{   
	  json.forEach(item => {
	    if (item.factura === facturaABuscar) {
	      item.marca = "*";
	      const checkbox = document.getElementById('checkCR');
	      if (checkbox && checkbox.checked) {
	        item.ca = "*";
	      }
	    }
	  });     
	  console.log(jsonCreditoConfirma) 
}


async function escanearFacturaCreditoConfirma(factura)
{
	factura = factura.toLowerCase()
	alerta()
	var validate = validarFacturaCreditoConfirma(factura);
	validate = (validate != 'true') ? validarFacturaCreditoConfirma(factura.toUpperCase()) : validate;    
	
	if (validate == 'true')  
	{
		factura = validarFacturaCreditoConfirma(factura.toUpperCase()) == 'true' ? factura.toUpperCase() : factura;
		actualizarMarcaConfirma(jsonCreditoConfirma, factura)
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "76"; 
		obj.id = obtenerValorJSON(jsonCreditoConfirma, factura,"id");
		obj.marca = (obtenerValorJSON(jsonCreditoConfirma, factura,"ca") == '*' ? 'CA' : '*'); 
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		$("#esperaValidaAlmacenKey").show()
		document.getElementById('cargando').style.display = 'block';
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
		document.getElementById('cargando').style.display = 'none'; 
		llenarTablaPedidosDisponiblesCreditoConfirma(jsonCreditoConfirma) 
		alertMsj('true',"Factura escaneada correctamente")
		$("#txtFacturaCreditoConfirma").val(""); 
		document.getElementById("txtFacturaCreditoConfirma").focus(); 	 
	}  
	else
	{
		alertMsj('warning',validate)   
		$("#txtFacturaCreditoConfirma").val(""); 
		 document.getElementById("txtFacturaCreditoConfirma").focus();  
	}
}
 

function validarFacturaCreditoConfirma(factura)
{  
	if (validarValorJSON(jsonCreditoConfirma, factura)) 
	{        
		  return 'true'
		} else { 
			return 'La factura '+factura+' no esta mostrada en la tabla';  
	}
}

function llenarMdlConfirma(json) 
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
			"<table id='tb_articulosDetallePrevio' class='table table-responsive table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;    background:white; margin-bottom: 0px;' >"+  
			"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
			"<tr id='tr_articulosDetalle' class='f33liberados'>"+
			"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
			"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>SALDO</label></div></th>"+ 
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TIPO</label></div></th>"+ 
			"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+ 
			"</tr>"+ 
			"</thead>"+
			"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
		aux = 0; 
		
		for(let i=0; i < json.length ; i++) 
		{
				contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;' name = '"+json[i].av+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;' name = '"+json[i].av+"[]'>";     		 
				ttl++;            
				contenido += "" +
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].av+" </div></td>" +                           
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_factura+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].saldo)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+(json[i].ca == '*' ? 'CONTRARECIBO' : '')+" </div></td>" +
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content; " +
				" padding-left: 5px;padding-right: 5px;"+(json[i].marca == '*' ? '   background: #FFEB9C;     color: #9C5700;' : ' background: #C6EFCE;color: #006100;')+"  " + 
				"'> "+(json[i].marca == '*' ? 'NO COBRADO' : 'COBRADO')+" </div></td>" +      
				"</tr>" ;
				aux++;  
//				if (json[i].av != (i == (json.length-1) ? 'as': json[i+1].av))      
//				{
//					contenido += "<tr id = 'tr_articulosDetalle' style='background: black;color:white' onclick=ocultarTDa('"+json[i].av+"')>";   		 
//					contenido += "" +
////			 	 "<td id='td_articulosDetalle2' align='right' colspan='4'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'>TOTAL FACTURAS AGENTE "+json[i].agente+" </div></td>" +
//					"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> <button type='button' id='btn' class='btn btn-info' style ='    padding-top: 0px;padding-bottom: 0px;padding-right: 4px;font-size: 12px;padding-left: 4px;'>Detalle</button> </div></td>" +  
//					"<td id='td_articulosDetalle2' align='left' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> </div></td>" + 
//					"<td id='td_articulosDetalle2' align='right' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px; '  class = 'AltoTD bordesTd'> <div style='width: max-content'>AGENTE "+json[i].av+"</div></td>" +  
//					"<td id='td_articulosDetalle2' align='center' colspan=''  style= 'padding-bottom: 4px;padding-top: 4px;border: none;padding-left: 0px;padding-right: 0px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> FACTURAS: "+aux+" </div></td>" +            
//					"</tr>" ;
//					aux = 0; 
//				}  
		}  
		contenido +="</tbody>" +    
		"</table>";
		$("#divPrevio").append(contenido);    
		$("#titlePrevio").text("TOTAL DE FACTURAS: "+ttl)         
		aplicarEstiloTablaConfirmacionFacturasPrevio();    
		const divTableDetalleCredito = document.getElementById("tb_articulosDetallePrevio");
		const distanciaDesdeElInicio = divTableDetalleCredito.getBoundingClientRect().top;
		const alturaDeseada = window.innerHeight - document.getElementById("tb_articulosDetallePrevio").getBoundingClientRect().top;
		document.getElementById("tb_articulosDetallePrevio").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio - 350) + "px ";    
}

function pintarDetalleConfirma()
{
	alerta()    
	$("#warningDetalleCreditoConfirma").hide()
	$("#txtFechaIniConfirma").val("");  
	$("#btnRegresarFolioCreditoConfirma").show()   
	$("#mdlRegresarFolioCreditoConfirma").modal('toggle')
	$("#mdlRegresarFolioCreditoLbConfirma").text("SE ACTUALIZARAN LAS SIGUIENTES FACTURAS: ");
	console.log(jsonCreditoConfirma) 
	llenarTablaDetalleCreditoConfirma(jsonCreditoConfirma) 
	
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
const buscarRegistro = (json, campo, valor, campoRegresa) => {
	  const resultado = (json.find(item => item[campo] === valor) || {})[campoRegresa] || '';
	  return resultado.substring(0, 23);
	};  
function llenarTablaDetalleCreditoConfirma(json)   
{
	$("#dangerDetalleCreditoConfirma").hide()
	$("#btnRegresarFolioCreditoConfirma").hide();
	$("#divTableDetalleCreditoConfirma").empty();
	$("#newFechaVencimiento").hide()  
	const cteUnicosArray = [...new Set(json.map(item => item.cte))];
	let contenido = '';
	for (var j = 0; j < cteUnicosArray.length; j++) 
	{
		contenido +=	"" +
		" <div style = 'width:99%;max-height: 100%;!important;margin-bottom: 20px;' align='left' class='mv'>" +    
		"<p style ='     display: inline;   margin-bottom: 0px;'>" +
		"<label style='font-weight: bold;    margin-bottom: 0px;'>"+cteUnicosArray[j]+" - "+ buscarRegistro(json, "cte", cteUnicosArray[j] , "clienteNombre")  +"</label> FACTURAS: <label style= '    font-weight: bold;    margin-bottom: 0px;' >"+json.filter(item => item.cte === cteUnicosArray[j]).length+"</label>" +  
		"</p> <p id='d"+cteUnicosArray[j]+"' style ='margin-bottom: 0px;display: inline;background: black;color: white;padding-right: 10px;padding-left: 10px;padding-top: 2px;padding-bottom: 3px;'> FECHA VENCIMIENTO: " +  
//		"<input type='text' id='txtFechaIniConfirma"+cteUnicosArray[j]+"' class='form-control hasDatepicker' placeholder='Seleccione fecha...'  readonly='' style ='" + 
//		"    text-align: center;     width: max-content;     height: 20px;     display: inline;     padding-top: 2px;  text-align: center;    padding-bottom: 2px;  padding-right: 4px;     padding-left: 4px;" +    
//		"'>" +
		"<input type='text' id='a"+cteUnicosArray[j]+"' placeholder='Selecciona una fecha' readonly='readonly' style = ' text-align: center;width: 169px; '>" +                
		"</p>  " +     
		"<table id='tb_articulosDetallePrevio' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;   margin-bottom: 25px; background:white; ' >"+    
		"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
		"<tr id='tr_articulosDetalle' class='f33liberados'>"+
		"<th id='th_articulosDetalle0'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class='cdo'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
		"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>SALDO</label></div></th>"+
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>TIPO</label></div></th>"+  
		"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>ESTATUS</label></div></th>"+
		"</tr>"+ 
		"</thead>"+
		"<tbody id='tbd_articulosDetalle' class='f33liberados'>" ;
		aux = 0;  
		for(let i=0; i < json.length ; i++)       
		{
			if(json[i].cte == cteUnicosArray[j])
			{
				
				contenido += (i% 2 == 0)  ? "<tr id='tr_articulosDetalle' style='background: #d9d5d5 ;' name = '"+json[i].av+"[]'>" : "<tr id = 'tr_articulosDetalle' style='background: #ffffff;' name = '"+json[i].av+"[]'>";     		 
				ttl++;            
				contenido += "" +
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+json[i].factura+" </div></td>" +     
				"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'>  "+json[i].av+" </div></td>" +                           
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].fecha_factura+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].importe)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+"$"+FormatearTotalesDeGrid(json[i].saldo)+" </div></td>" +
				"<td id='td_articulosDetalle4' align='right'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+(json[i].ca == '*' ? 'CONTRARECIBO' : '')+" </div></td>" +
				"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content; " +
				" padding-left: 5px;padding-right: 5px;"+(json[i].marca == '*' ? 'background: #FFEB9C;     color: #9C5700;' : 'background: #C6EFCE;color: #006100;')+"  " +                     
				"'> "+(json[i].marca == '*' ? 'NO COBRADO' : 'COBRADO')+" </div></td>" +           
				"</tr>" ;
				aux++;  
			}
		}  
		contenido +="</tbody>" +    
		"</table>"; 
	}
	 
	$("#divTableDetalleCreditoConfirma").append(contenido);
	
//	$("#txtFechaIniConfirma97060").datepicker();       
//	$('#txtFechaIniConfirma97060').val(ObtenerFechaActualss());       
   
	$("#divTableDetalleCreditoConfirma").show()
	const divTableDetalleCredito = document.getElementById("divTableDetalleCreditoConfirma");
	const distanciaDesdeElInicio = divTableDetalleCredito.getBoundingClientRect().top;
	const alturaDeseada = window.innerHeight - document.getElementById("divTableDetalleCreditoConfirma").getBoundingClientRect().top;
	document.getElementById("divTableDetalleCreditoConfirma").style.maxHeight = (alturaDeseada -distanciaDesdeElInicio-350) + "px "; 
	
	$("#newFechaVencimiento").hide()
	$('#mdlRegresarFolioCreditoConfirma').on('shown.bs.modal', function () {  
		let array = ''
		for (var i = 0; i < cteUnicosArray.length; i++) 
		{
			if(buscarCteConMarca(json, cteUnicosArray[i]))
			{	
			flatpickr("#a"+cteUnicosArray[i]+"", {        
		        dateFormat: "d/m/Y",
		        enableTime: false,  
		        minDate: formattedDate,      
		        defaultDate: formattedDate,  
		        locale: "es"
		    });
			}
			else
			{  
				$("#d"+cteUnicosArray[i]).hide()  
			}
		}  
	}); 
	$("#btnRegresarFolioCreditoConfirma").show();
	
	 	
} 
function buscarCteConMarca(jsonData, valor) {
    return jsonData.some(item => item.cte === valor && item.marca === "*");
}  
var stoday = new Date();
var stomorrow = new Date(today);
stomorrow.setDate(stoday.getDate() + 1);

//Calcular la fecha del día siguiente
var today = new Date();
var tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// Formatear la fecha en el formato "04/11/2023" (día/mes/año)
var formattedDate = (tomorrow.getDate() < 10 ? '0' : '') + tomorrow.getDate() + '/' +
                   ((tomorrow.getMonth() + 1) < 10 ? '0' : '') + (tomorrow.getMonth() + 1) + '/' +
                   tomorrow.getFullYear();   
function prs() 
{
	  flatpickr("#"+cteUnicosArray[j]+"", {   
	        dateFormat: "Y-m-d", // Formato de fecha (puedes cambiarlo según tus necesidades)
	        enableTime: false,   // Si deseas habilitar la selección de hora
	        // Otros parámetros y opciones que desees configurar
	    });
}   


function ObtenerFechaActualss() {
	  var fecha = new Date();
	  let dia = String(fecha.getDate()).padStart(2, '0');
	  let mes = String(fecha.getMonth() + 1).padStart(2, '0');
	  let year = fecha.getFullYear();
	  fecha = dia + '/' + mes + '/' + year;
	  return fecha;
	}        
	
	
async function sendConfirma() 
{
	
	jsonCreditoConfirma.forEach(function(item) {
	    if (item.marca === "*") {
	        var cte = item.cte;
	        var newValue = $("#a" + cte).val();
	        item.newVencimiento = newValue;
	    }
	});
	  

	const outputJson = jsonCreditoConfirma
	  .filter(item => item.marca === "*") // Filtra los elementos donde 'marca' es igual a '*'
	  .reduce((result, item) => {
	    const existingItem = result.find(i => i.cliente === item.cte);

	    if (existingItem) {  
	      existingItem.iden += `, ${item.id}`;
	    } else {
	      result.push({
	        iden: item.id,
	        fec: item.newVencimiento,
	        cliente: item.cte,
	      });
	    }

	    return result;
	  }, []);
//	if(outputJson.length > 0) 
//	let idsCM = jsonCreditoConfirma
//	  .filter(item => item.marca === "*")
//	  .map(item => item.id)
//	  .join(',');
	let idsSM = jsonCreditoConfirma
	.filter(item => item.marca === "") 
	.map(item => item.id)
	.join(',');
	
//
//	let resultCM = idsCM || ''; 
	let resultSM = idsSM || ''; 
//	
	$("#btnRegresarFolioCreditoConfirma").hide() 
	$("#newFechaVencimiento").hide()   
	$("#warningDetalleCreditoConfirma").hide() 
	$("#esperaValidaDetalleCreditoConfirma").show() 
	$('#divTableDetalleCreditoConfirma').empty();     
	$("#warningDetalleCreditoConfirma").show()  
	$("#warningDetalleCreditoLbConfirma").text("SE CONFIRMARON CORRECTAMENTE LAS FACTURAS") 
	if(outputJson.length > 0)  
	{
		for (var i = 0; i < outputJson.length; i++) 
		{
			var obj = new Object()      
			obj.proceso = "181";  
			obj.query = "71";        	
			obj.tipo = "select";        
			obj.usr = $("#usr").val(); 
			obj.folio = jsonCreditoConfirma[0].folioAnterior; 
			obj.vencimiento = formatFecha(outputJson[i].fec);   
			obj.id = outputJson[i].iden;  
			obj.operacion = "consulta previo almacen";
			const n = await prb('Execution', 'execute',JSON.stringify(obj));
		}
	}
	
	if (resultSM != '') 
	{
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "72";        	
		obj.tipo = "select";        
		obj.usr = $("#usr").val();        
		obj.id = resultSM;    
		obj.folio = jsonCreditoConfirma[0].folioAnterior;
		obj.operacion = "consulta previo almacen";
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
	}  
	
	$("#esperaValidaDetalleCreditoConfirma").hide()  
	$("#segundoConfirma").html("5");        
	$("#ContSegundoConfirma").show()
	segundo = 5;     
	intervalId = setInterval(function() {
	    $("#segundoConfirma").html(segundo);    
	    segundo--;  
	    if (segundo < 0) 
	    {
	    	clearInterval(intervalId);
	    	$("#ContSegundoConfirma").hide();
			$("#esperaValidaDetalleCreditoConfirma").hide()  
			$("#warningDetalleCreditoConfimra").hide()
			$("#dangerDetalleCreditoConfirma").hide()
			$("#mdlRegresarFolioCreditoConfirma").modal('hide')           
			validarConfirma();                            
	    }    
	}, 1000);     
	
	
	


	     
	
	
////		document.getElementById('cargando').style.display = 'block';   
//		let json = jsonCreditoGenera.filter(item => item.marca === "*");
//		json = json.sort((a, b) => b.av - a.av);
//		console.log(json)  
//		let resultado = agruparPorAV(json);  
//		for (var i = 0; i < resultado.length; i++) 
//		{
//			var obj = new Object()      
//			obj.proceso = "181";  
//			obj.query = "69";        	
//			obj.tipo = "select";        
//			obj.usr = $("#usr").val();;       
//			obj.id = resultado[i].id;  
//			obj.operacion = "consulta previo almacen";
//			document.getElementById('cargando').style.display = 'block';
//			const n = await prb('Execution', 'execute',JSON.stringify(obj));
//		}	   
////		document.getElementById('cargando').style.display = 'none';
//		alert("Se genero relacion de cobranza correctamente")
//		$("#txtFacturaCancelarCreditoGenera").val("");   
//		document.getElementById("txtFacturaCancelarCreditoGenera").focus();
//		jsonCreditoGenera = null;
//		$("#divTableFacturasCreditoGenera").empty();  
}
function validarMarcaConfirma(json, facturaABuscar) 
{
	  const factura = json.find(item => item.factura === facturaABuscar);
	  return factura ? (factura.marca === "*" ? "true" : "Debe escanear primero la factura") : "Factura no encontrada";
}   

async function cancelarFacturaCreditoConfirma(factura) 
{
	alerta() 
	let vld = validarMarcaConfirma(jsonCreditoConfirma,factura);   
	if (vld == 'true') 
	{
		jsonCreditoConfirma.forEach(item => {
		    if (item.factura === factura) item.marca = "";
		    if (item.factura === factura) item.ca = ""; 
		    if (item.factura === factura) item.estatus = "Relacion Cobranza";
		  });
		
		var obj = new Object()      
		obj.proceso = "181";  
		obj.query = "80"; 
		obj.id = obtenerValorJSON(jsonCreditoConfirma, factura,"id");
		obj.tipo = "select";        
		obj.operacion = "consulta facturas confirmadas para enviar a credito";
		document.getElementById('cargando').style.display = 'block';
		const n = await prb('Execution', 'execute',JSON.stringify(obj));
		document.getElementById('cargando').style.display = 'none'; 
		
		llenarTablaPedidosDisponiblesCreditoConfirma(jsonCreditoConfirma);   
		alertMsj('true',"Factura escaneada correctamente")   
		$("#txtFacturaCreditoConfirma").val("");
		$("#txtFacturaCancelarCreditoConfirma").val(""); 
		document.getElementById("txtFacturaCancelarCreditoConfirma").focus();  	  
	}
	else
	{
		alertMsj('warning',vld)     
		$("#txtFacturaCancelarCreditoConfirma").val("");   
		document.getElementById("txtFacturaCancelarCreditoConfirma").focus();   
	}
} 

function llenarTablaPedidosDisponiblesCreditoConfirma(json) 
{
	$('#divTableFacturasCreditoGenera').empty();  
	$('#divTableFacturasCreditoConfirma').empty();  
	$('#customBodyCreditoEncargado').empty();
	$('#divFilterCreditoEncargado').empty();
	$('#customBodyCreditoGenera').empty();
	$('#divFilterCreditoGenera').empty();
	$('#customBodyCreditoConfirma').empty();
	$('#divFilterCreditoConfirma').empty();    
	$('#divFilterMonitor').empty();     
	$('#divTableMonitorg').empty();
	$('#customBodyMonitor').empty();   
	$('#customBodyMonitorg').empty();
	let contenido = 
		 "<table id='tb_articulosDetalleCreditoConfirma' class='table  table-striped table-hover table-bordered' align='center' cellpadding=0px; cellspacing=0px; style='width:100%;  height: 100%;  background:white; margin-bottom: 0px;' >"+  
						"<thead  id='thd_articulosDetalle' style='background-color:#0054A2; color:white' >" +
							"<tr id='tr_articulosDetalle' class='f33liberados'>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>AGENTE</label></div></th>"+  
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>CLIENTE</label></div></th>"+
							"<th id='th_articulosDetalle1'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' factura'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FACTURA</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>IMPORTE</label></div></th>"+
							"<th id='th_articulosDetalle4'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' estatus'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>SALDO</label></div></th>"+
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' cve'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA FACTURA</label></div></th>"+ 
							"<th id='th_articulosDetalle3'  align='center' style=' text-align: -webkit-center;  padding:2px;position: sticky;   border-bottom-width: 0px;'  class=' fecha'><div style='width: max-content'><label  style='font-weight: bold;margin-bottom: 0px;margin-left: 8px;margin-right: 8px;'>FECHA VENCIMIENTO</label></div></th>"+
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
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content; " +
		" padding-left: 5px;padding-right: 5px;"+(json[i].observaciones == 'si cobro' ? 'background: #C6EFCE;color: #006100;' : '    background: #FFEB9C;     color: #9C5700;')+"  " +
		"'> "+json[i].observaciones+" </div></td>" +    
		"<td id='td_articulosDetalle4' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'><div style='width: max-content'> "+json[i].folioAnterior+" </div></td>" +  
		"<td id='td_articulosDetalle2' align='center'  style= 'padding-bottom: 4px;padding-top: 4px;'  class = 'AltoTD bordesTd'> <div style='width: max-content'> "+(json[i].estatus)+" </div></td>" + 
		"</tr>" ;
		   
	}
	}
	$("#facturasCorrectasConfirma").val(aux)
	contenido +="</tbody>" +
	"</table>";
	$("#divTableFacturasCreditoConfirma").append(contenido);
	$("#facurasCreditoConfirma").show()  
	aplicarEstiloTablaConfirmacionFacturasCreditoConfirma();
} 
