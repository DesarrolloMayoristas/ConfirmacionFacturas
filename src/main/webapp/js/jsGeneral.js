



function alerta() 
{
	$("#lblSuccess").text("")
	$("#success").hide()
	$("#lblDanger").text("")
	$("#danger").hide()
	$("#lblWarning").text("")
	$("#warning").hide()
	$("#lblWarningg").text("")
	$("#warningg").hide()
}

function alertaUsr() 
{
	$("#lblWarningUsr").text("")
	$("#warningUsr").hide()
}

function alertMsjUsr(tipo,msj) 
{
	msj = msj.toUpperCase()  
	switch (tipo) 
	{
	case "warning":  
		$("#lblWarningUsr").text(msj)
		$("#warningUsr").show()
		break;
	default:
		break;
	}
	
}

function alertMsj(tipo,msj) 
{
	msj = msj.toUpperCase()  
	switch (tipo) 
	{
	case "true":
		$("#lblSuccess").text(msj)
		$("#success").show()	
		break;
	case "false":
		$("#lblDanger").text(msj)
		$("#danger").show()
		break;
	case "warning":  
		$("#lblWarning").text(msj)
		$("#warning").show()
		break;
	case "warningg":  
		$("#lblWarningg").text(msj)
		$("#warningg").show()
		break;
	default:
		break;
	}
	
}

function EsNumero(evt) {
	
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if(charCode ==  47)
    	  return false;
    if (charCode > 31 && (charCode <= 45 || charCode > 57)) {
        return false;
    }
    else
    	return true;
}

function OcultarDiv(div)
{
	var divOcultar ="#" + div;
	$(divOcultar).hide();
}

function MostrarDiv(div)
{
	var divMostrar ="#" + div;
	$(divMostrar).show();
}

function RegresarMenu(){
    window.location = 'ProcesosAlmacen/Menu.jsp';
}

function FormatearTotalesDeGrid(importe)
{
	let importeTotalGrid = parseFloat(importe).toFixed(0);
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
function hideKey(id) 
{
	var	yourInput = document.getElementById(id);
	yourInput.readOnly = true;
	yourInput.focus();  
	setTimeout(function(){document.getElementById(id).readOnly = false;}, 50); 
}  
function hideFoco(id) 
{
	var elemento = document.getElementById(id);    
	  elemento.blur();
}
function focoKey(id) 
{
	hideFoco(id)   
	hideKey(id) 
}


//var obj = new Object()
//obj.query = "9";
//obj.operacion = "consultarFaltantes";  
//ejecutarAjax("SurtirPedidos", "execute", JSON.stringify(obj));

//function execution(servlet, accion, valores)
//{
//	var rsp = "";
//	$.ajax({
//		url : servlet,
//		data : "accion="+accion+"&valores="+valores, 
//		type : 'POST',
//		async: false,
//		dataType : 'json',
//		success : function(json) 
//		{
//			rsp = JSON.parse(json.replace(/=/g,":"))
//		},
//		error : function(xhr, status, error) 
//		{
//			if (xhr.status === 200) 
//			{
//				alert('Tu sesion actual ha expirado, para continuar vuelve a iniciar sesion.')
//				window.location.href = '/ProcesosAlmacen/';
//			} else
//				alert('Error en el proceso.')
//				window.location.href = '/ProcesosAlmacen/';
//		}
//	});    
//	return rsp; 
//}
//module.exports = { 
//	    "execution": execution
//	}
