<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"></meta>
		<title>Confirmacion Facturas</title>   
		
		<!--  HOJAS DE ESTILOS -->
		<link rel="stylesheet" type="text/css" href="css3/bootstrap.min.css"></link>
		<link rel="stylesheet" type="text/css" href="css3/bootstrap.css"></link>
		<link rel="stylesheet" type="text/css" href="css/EstilosLogin.css"></link>
		<link rel="stylesheet" type="text/css" href="css/EstilosMenu.css"></link>	
		<link rel="stylesheet" type="text/css" href="css/EstilosGenerales.css"></link>
		
		<!--  FUNCIONES JS  -->
		<script  type="text/javascript" src="js/jsInicio.js"></script>   
		<script  type="text/javascript" src="js/sha1.js"></script>  
		
		
		<script type="text/javascript">
		  $(function () {
               $(document).keydown(function (e) {
                   return (e.which || e.keyCode) != 116;
               });
           });
		</script>
	</head>
	<body>
		<form action="ServidorUsuario" method="post">
		
			<!--  HEADER -->
	 		<header >
	 			<div class="EG_containerPrincipal" > 
		 			<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
	 					<div class="navbar-header"> 
							<table height="45px" >
							    <tr>
								    <td valign="middle"> <label class="EL_textosGrande">  &nbsp;&nbsp; Centro de Distribuci&oacute;n Oriente S.A de C.V </label></td>
							    </tr>
							</table>	
						</div> 
		 			</nav>
	 			</div>
	 		</header> 
	 		
	 		<!--  ESPACIO  -->
			<div style="height: 150px"></div>
	 		
			<!--  DIV DE LOGIN  -->
			<div class="col-sm-4"></div>
	 		<div id="DivLoguin" style="margin-top: 20px;" class="col-sm-4">
	 			<table width=70% align="center">
	 				<tr>
	 					<td>
	 						<div class="panel panel-primary" >
								<div class="panel-heading">
									 <div class="panel-title" align="left"> <label class="EG_lbTituloEncabezado">Sistema Confirmacion Facturas</label></div>
								</div>
								<div style="padding-top: 30px; background-color: white" class="panel-body" >   
									<table  align="center" width=100% >
										<tr>
											<td align="center" colspan="2">
												<div>
													<img src="images/logocdo.png" class="img-responsive navbar-brand-img" ></img>
												</div>
											</td>
										</tr>
										<tr>
											<td colspan="2" align="center">
												<div>
													<input type="hidden" name="vista" id="idIndex" value="Inicio.jsp" >
													<input type="hidden" name="proceso_web" id="idIndex" value="968" >
													<table align="center" width="80%">
														<tr>
															<td align="center">
																<div  class="EL_msjRespuesta">														
																	<c:if test="${mensaje_respuesta != ''}">
																		<div class="alert alert-danger alert-dismissable fade in">
																			${mensaje_respuesta}
																			<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
																		</div>
																	</c:if>
																</div>
															</td>
														</tr>
													</table>
													<br>										
													<div class="input-group" style="width:80%;">
														 <span class="input-group-addon"><span class="glyphicon glyphicon-home" ></span></span>
														 <select id="cmbCentros"  name="cdo_macro" class="form-control">
																<option value="cdf" selected="selected">CDMX</option>
																<option value="cd2">PUEBLA</option>
																<option value="cdL">LEON</option>
																<option value="cdM" >MONTERREY</option>
														 </select>
													</div>	
													<br>
													<div class="input-group" style="width:80%;">
														<span class="input-group-addon" ><span class="glyphicon glyphicon-user" ></span></span>
														<input  id="txtUsu" name="usuario" type="text" class="form-control" placeholder="Usuario" >
													</div>
													<br>
													<div class="input-group" style="width:80%;">
														<span class="input-group-addon" ><span class="glyphicon glyphicon-lock" ></span></span>
														<input id="txtPass"type="password"  name="password" onchange="validaPsw(this);" class="form-control" placeholder="Contrase&ntilde;a" >
													</div>
													<br>
													<table align="center" width="80%">
														<tr>
															<td align="center">
																<button class="btn btn-primary" type="submit"  style="marging:10px;width:100%"  >
																	<i class="glyphicon glyphicon-ok"></i>Aceptar
																</button>
															</td>
														</tr>
													</table>
													<br>
												</div>
											</td>
										</tr>
									</table>	
								</div>
							</div>
	 					</td>
	 				</tr>
	 			</table>
				
			</div>
			<div class="col-sm-4"></div>
		</form>
	</body>
</html>