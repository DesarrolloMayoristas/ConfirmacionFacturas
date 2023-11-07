package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.google.gson.Gson;

import cdo.Datos.DetalleFolioHojaRuta;
import cdo.Datos.DetalleIngresos;
import cdo.Datos.Impresoras;
import cdo.Datos.Ingresos;
import cdo.Datos.ListaInformacionDeIngresos;
import cdo.Datos.Querys;
import cdo.Datos.SemaforoIngresos;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorConfirmaIngresosACaja;
import cdo.util.Cls_Log;
import cdo.util.Cls_MetodosGlobales;
import cdo.util.ConexionBD;


public class ConfirmaIngresosACajaServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private static List<Querys>  querys = null;
	private static GestorConfirmaIngresosACaja gestorIngresos;

    public ConfirmaIngresosACajaServlet() {
        super(); 
        gestorIngresos = new GestorConfirmaIngresosACaja();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession session = request.getSession(false);
		if(session!=null)
		{  
			Cls_MetodosGlobales.removerParametrosDeSession(session, "ConfirmaIngresoACaja.jsp");
			this.querys  = (List<Querys>)session.getAttribute("querys");
			verificaPeticionOrigen(request,response, session);
			
	    }  
		else
		{  
			if(session == null)
			{
				System.out.println("Ingresos: Session no valida ");
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
	    }  
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public void verificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response,HttpSession session)
	{
		try
		{
			String vista= String.valueOf(request.getParameter("vista"));	
			String operacion= String.valueOf(request.getParameter("operacion"));
			
			session.setAttribute("msjRespuestaHojaRuta", "");
			boolean respuesta = false;
			Gson gson = new Gson();
			
			switch(vista)
			{
				case "Menu.html":
					String pagina = String.valueOf(request.getParameter("pagina"));	
					
					
					redireccionarVista(request, response,pagina);
				break;
				
				case "ConfirmaIngresosACaja.jsp":
					switch(operacion)
					{
						case "ConsultaInicialDeIngresos":
							
							
							String listaJson = "";
							try (Connection connBD = ConexionBD.AbrirConexionBD(session.getAttribute("CDOconnBD").toString());)
							{
								PreparedStatement pstm= null;
								ResultSet rs = null;
								String resultados[] = validaPolizasDeDiasAnteriores(request,session,rs,pstm,connBD).split("&");
								boolean polizasGeneradas= Boolean.parseBoolean(resultados[0]); //validaPolizasDeDiasAnteriores(request,session);
								String fechaUltimaPoliza = resultados[1].toString();
								List<Ingresos> ListIngresosCapturados = consultaIngresosXParametro(request,session,connBD,pstm,rs);
								List<SemaforoIngresos> ListaSemaforo = consultaDatosDelSemaforo(request,session,connBD,pstm,rs);
								ListaInformacionDeIngresos listaInforIngresos= new ListaInformacionDeIngresos();
								listaInforIngresos.setListaIngresos(ListIngresosCapturados);
								listaInforIngresos.setListaSemaforoIngresos(ListaSemaforo);
								listaInforIngresos.setPolAntGeneradas(polizasGeneradas);
								listaInforIngresos.setFechaUltimaPoliza(fechaUltimaPoliza);
								listaJson = gson.toJson(listaInforIngresos);
								
							} catch (SQLException e) 
							{
								System.out.println("Error en cierre de BD principal");
							}
					
							enviarRespuestaJsonJS(request,response, listaJson);
							break;
							
						case "ActualizaIngresoXID":
							respuesta = actualizarIngresoXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
							
						case "CancelaIngresoXID":
							respuesta = cancelarIngresoXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
							
						case "ConfirmaIngresoXID":
							respuesta = confirmaIngresoXID(request,session); 
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
							
						case "ActualizaImporteNotaXID":
							respuesta = actualizaImporteNotaXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
							
						case "CancelarImporteNotaXID":
							respuesta = cancelarImporteNotaXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
							
						case "reimprimirIngresoXID":
							respuesta = reimprimirIngresoXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
						case "HojaRuta":
							buscarHojaDeRutaXID(request,session);
							redireccionarVista(request, response,vista);
						break;
						
						case "ActualizaFechaPoliza":
							respuesta = actualizaFechaPoliza(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
						break;
						
						case "revertirIngresoXID":
							respuesta = revertirIngresoXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
							break;
						
						case "facturaCreditoManual":
							String str_respuesta = guardaFacturaCreditoManual(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(str_respuesta));
							break;
							
						case "ValidaContadoConFactura":
							boolean existeFactura = validaIngresoContadoConFacturaXID(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(existeFactura));
							break;
							
						case "ValidaNotasEnBD":
							boolean existeNotaBd = validaNotaEnBD(request,session);
							enviarRespuestaTextoJS(request, response, String.valueOf(existeNotaBd));
							break;
							
						case "ConsultaDetalleFolioHR":
							List<DetalleFolioHojaRuta> listaDetalleFolioHR = consultaDetalleFolioHojaruta(request,session);
							String listaJsonFHR = gson.toJson(listaDetalleFolioHR);
							enviarRespuestaJsonJS(request, response, listaJsonFHR);
							break;
						case "ConsultaDetalleIngresos":
							List<DetalleIngresos> listaDetalleIngresos = consultaDetalleIngresos(request,session);
							//String listaJsonDetalleIngresos = gson.toJson(listaDetalleIngresos);
							 JSONObject person = new JSONObject();
							  person.put("LISTA", listaDetalleIngresos);
							  Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
							  JSONObject JsoninfoUsu = new JSONObject(infoUsu);
							 // System.out.println("JsoninfoUsu: " + JsoninfoUsu );
							  person.put("USUARIO",  JsoninfoUsu);
							  
							  //System.out.println("jSON NUEVO:" + person);
							enviarRespuestaJsonJS(request, response, person.toString());
							break;
					}
				break;
			}
		}
		catch(Exception ex)
		{
			System.out.println("Error al validar la peticion origen..\nDetalle:" + ex.getMessage().toString());
		}
	}
	
	
	private List<DetalleIngresos> consultaDetalleIngresos(HttpServletRequest request, HttpSession session) throws SQLException {
		// TODO Auto-generated method stub
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<DetalleIngresos> listaDetalleIngresos = gestorIngresos.consultaDetalleIngreso2(infoUsu, this.querys);
		//System.out.println("Lista: " + listaDetalleIngresos);
		return listaDetalleIngresos;
	}

	private String  validaPolizasDeDiasAnteriores(HttpServletRequest request, HttpSession session, ResultSet rs, PreparedStatement pstm, Connection connBD)
	{
		String polizasGeneradasCorrectamente = "";
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		if(infoUsu.getUname().equals(infoUsu.getUname_br()))
		 {
			polizasGeneradasCorrectamente="true&CDO_MACRO";
		 }
		 else
		 {
			 polizasGeneradasCorrectamente=gestorIngresos.validaSiSeGeneroPolizaDiaAnterior(infoUsu, this.querys,rs,pstm,connBD);			 
		 } 
		return polizasGeneradasCorrectamente;
	}
			
	private List<Ingresos> consultaIngresosXParametro(HttpServletRequest request, HttpSession session, Connection connBD, PreparedStatement pstm, ResultSet rs)
	{ 
		List<Ingresos> ListIngresosCapturados = new ArrayList<>();
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		try
		{
			String fechaIni = (String.valueOf(request.getParameter("fecha_inicio")).equals("NA")) ? "NA": aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_inicio")));
			String fechaFin = (String.valueOf(request.getParameter("fechaFin")).equals("NA")) ? "NA": aplicaFormatoFecha(String.valueOf(request.getParameter("fechaFin")));
			String tipoFecha = String.valueOf(request.getParameter("tipoFecha"));
			String folioIngreso = (String.valueOf(request.getParameter("folioIngreso")).equals("")) ? "0": String.valueOf(request.getParameter("folioIngreso"));
			
			Ingresos ICapturado= new Ingresos(infoUsu.getUname(),
											 infoUsu.getUname_br(),
											 Integer.parseInt(request.getParameter("tipoPago")), 
											  "",folioIngreso, "", "",
											  fechaIni,fechaFin, 
											  Integer.parseInt(request.getParameter("estatus")), 
											  "",
											  null, null, null, null, null,null, null,null,null,0,"","","","","","","","","","","","0.00","","","","","");
			ListIngresosCapturados = gestorIngresos.consultaIngresosXParametro(infoUsu, this.querys, ICapturado, tipoFecha,connBD,pstm,rs);
			session.setAttribute("ListIngresosCapturados", ListIngresosCapturados);
		}
		catch(Exception ex)
		{
			System.out.println("Error al validar la consulta de ingresos por parametro. Detalle: "+ ex.getMessage().toString());
			Cls_Log.insertaLog(infoUsu, "", "", "Error al validar la consulta de ingresos por parametro. Detalle [" + ex.getMessage().toString()+ "]");
		}
		return ListIngresosCapturados;
	}
		
	private List<SemaforoIngresos> consultaDatosDelSemaforo(HttpServletRequest request, HttpSession session, Connection connBD, PreparedStatement pstm, ResultSet rs)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<SemaforoIngresos> listaSemaforo = gestorIngresos.consultaDatosDelSemaforo(infoUsu, this.querys,connBD,pstm,rs);
		session.setAttribute("SemaforoimporteMin","Limite: $"+ listaSemaforo.get(0).getImporte_minimo());
		session.setAttribute("SemaforoimporteMax","Maximo: $"+ listaSemaforo.get(0).getImporte_maximo());
		session.setAttribute("SemaforoimporteAct", listaSemaforo.get(0).getImporte_actual());
		return listaSemaforo;
	}
		
	private String aplicaFormatoFecha(String textoFecha)
	{
		String[] arrayFecha = textoFecha.split("/");
		String fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
		return fecha;
	}
			
	private boolean actualizarIngresoXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");		
		Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
				 							infoUsu.getUname_br(),
				 							Integer.parseInt(request.getParameter("tipoPago")),
				 							"", 
				 							String.valueOf(request.getParameter("folio_caja")), 
				 							"",  "", "", "", 0, "",
				 							String.valueOf(request.getParameter("importe")), 
				 							String.valueOf(request.getParameter("efectivo")), 
				 							String.valueOf(request.getParameter("cheque")), 
				 							String.valueOf(request.getParameter("tarjeta")), 
				 							String.valueOf(request.getParameter("debito")), 
				 							String.valueOf(request.getParameter("porfechado")), 
				 							String.valueOf(request.getParameter("transferencia")), 
				 							String.valueOf(request.getParameter("notaCredito")),
				 							String.valueOf(request.getParameter("notaDevolucion")),0,"","","","","","","","","","","","0.00","","","","",""); 	
		
		
	    boolean actualizoIngresoXID_BD = gestorIngresos.actualizaIngresoXID(infoUsu, this.querys, ICapturado, session);
	    if(actualizoIngresoXID_BD)
	    {
	    	if(ICapturado.getId_tipo_pago() == 3)
	    	{
	    		String idModificados= String.valueOf(session.getAttribute("IdsContadosModificados"));
	    		session.setAttribute("IdsContadosModificados", idModificados + ICapturado.getFolio_caja() + "/");
	    	}
	    }
	    return actualizoIngresoXID_BD;
	}
	
	private boolean cancelarIngresoXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
			Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
												infoUsu.getUname_br(),
												Integer.parseInt(request.getParameter("tipoPago")),
												"", 
												String.valueOf(request.getParameter("folio_caja")), 
											  	"",  "", "","",  9, "",null,null, null, null, null, null, null,null,null,
											  	Integer.parseInt(request.getParameter("motivo")),"","","","","","","","","","","","0.00","","","","","");
	
		boolean canceloIngresoXID_BD = gestorIngresos.cancelaIngresoXID(infoUsu, this.querys, ICapturado, session);
		return canceloIngresoXID_BD;
	}
		
	private boolean revertirIngresoXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
											infoUsu.getUname_br(),
											Integer.parseInt(request.getParameter("tipoPago")),
											"", 
											String.valueOf(request.getParameter("folio_caja")), 
										  	"",  "", "","",  0, "",null,null, null, null, null, null, null,null,null,
										  	0,"","","","","","","","","","","","0.00","","","","","");
		boolean revertirIngresoXID_BD = gestorIngresos.revertirIngresoXID(infoUsu, this.querys, ICapturado, session);
		return revertirIngresoXID_BD;
	}
	
	private boolean confirmaIngresoXID(HttpServletRequest request, HttpSession session)
	{
		boolean confirmoIBD = true;
		String[] Arrayfecha = String.valueOf(request.getParameter("fecha_poliza")).split("/");
		String fechaPoliza = Arrayfecha[2] + "-" + Arrayfecha[1] + "-" + Arrayfecha[0];
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(infoUsu.getUname(), 
										  infoUsu.getUname_br(), 
										  Integer.parseInt(request.getParameter("tipoPago")), 
										  "", 
										  String.valueOf(request.getParameter("folio_caja")), 
										  String.valueOf(request.getParameter("cve_usu")), 
										  String.valueOf(request.getParameter("usu_nombre")),
										  "",  "",  1,  "", 
										  String.valueOf(request.getParameter("importe").replace(",", "")), 
										  String.valueOf(request.getParameter("efectivo").replace(",", "")), 
										  String.valueOf(request.getParameter("cheque").replace(",", "")), 
										  String.valueOf(request.getParameter("tarjeta").replace(",", "")), 
										  String.valueOf(request.getParameter("debito").replace(",", "")), 
										  String.valueOf(request.getParameter("porfechado").replace(",", "")), 
										  String.valueOf(request.getParameter("transferencia").replace(",", "")), 
										  String.valueOf(request.getParameter("notaCredito").replace(",", "")), 
										  String.valueOf(request.getParameter("notaDevolucion").replace(",", "")), 
										  0, "", "", "", "", "", "", "", "", "",
										  fechaPoliza,"",
										  String.valueOf(request.getParameter("importe_Origen").replace(",", "")),"","","","","");
//		System.out.println("Efectivo: " + request.getParameter("efectivo").replace(",", ""));
//		System.out.println("Cheque: " + request.getParameter("cheque").replace(",", ""));
//		System.out.println("Tarjeta Credi: "+ request.getParameter("tarjeta").replace(",", ""));
//		System.out.println("Tarjeta Debito: " + request.getParameter("debito").replace(",", ""));
//		System.out.println("Porfechado: " + request.getParameter("porfechado").replace(",", ""));
//		System.out.println("Transferencia: "+ request.getParameter("transferencia").replace(",", ""));
		
		boolean aplicacomision= Boolean.parseBoolean(request.getParameter("aplicaComision"));
		int banco= Integer.parseInt(request.getParameter("banco_emisor"));
		int bancoDeposito= Integer.parseInt(request.getParameter("banco_deposito"));
		List<Impresoras> impresoras= (List<Impresoras>) session.getAttribute("listaImpresoras");
		ICapturado = gestorIngresos.confirmaIngresoXID(infoUsu, this.querys, ICapturado, session,aplicacomision,banco, bancoDeposito);
	
		if(ICapturado.getId_tipo_pago() == 1 && Double.parseDouble(ICapturado.getPorfechado()) > 0)
		{
			gestorIngresos.confirmaChequePorfechado(infoUsu, this.querys, ICapturado, session);
		}
		
		if(ICapturado.getId_tipo_pago() == 1 && Double.parseDouble(ICapturado.getCheque()) > 0)
		{
			gestorIngresos.confirmaChequeNominativo(infoUsu, this.querys, ICapturado, session);
		}
		
		//gestorIngresos.crearArchivoTxtDelTicket(infoUsu,ICapturado, 0, aplicacomision, impresoras.get(0).getImpresora(),session);
		
		
		return confirmoIBD;
	}
		
	private boolean validaIngresoContadoConFacturaXID(HttpServletRequest request, HttpSession session)
	{
		boolean existeFactura = false;
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
											infoUsu.getUname_br(),
											3,
											"", 
											String.valueOf(request.getParameter("folio_caja")), 
										  	"",  "", "","",  9, "",null,null, null, null, null, null, null,null,null,
										  	0,"","","","","","","","","","","","0.00","","","","","");
				

		existeFactura = gestorIngresos.validaFacturaEnIngresosContadoXID(infoUsu, this.querys, ICapturado, session);
		return existeFactura;
	}
		
	private boolean reimprimirIngresoXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(infoUsu.getUname(), 
										  infoUsu.getUname_br(), 
										  Integer.parseInt(request.getParameter("tipoPago")), 
										  "", 
										  String.valueOf(request.getParameter("folio_caja")), 
										  String.valueOf(request.getParameter("cve_usu")), 
										  String.valueOf(request.getParameter("usu_nombre")),
										  "",  "",  1,  "", 
										  String.valueOf(request.getParameter("importe")), 
										  String.valueOf(request.getParameter("efectivo")), 
										  String.valueOf(request.getParameter("cheque")), 
										  String.valueOf(request.getParameter("tarjeta")), 
										  String.valueOf(request.getParameter("debito")), 
										  String.valueOf(request.getParameter("porfechado")), 
										  String.valueOf(request.getParameter("transferencia")), 
										  String.valueOf(request.getParameter("notaCredito")), 
										  String.valueOf(request.getParameter("notaDevolucion")), 
										  0, "", "", "", "", "", "", "", "", "","","","0.00","","","","","");
		
		boolean aplicacomision =gestorIngresos.validaSiLaReimpresionaplicaComisionDeTarjeta(infoUsu, this.querys, ICapturado, session);
		List<Impresoras> impresoras= (List<Impresoras>) session.getAttribute("listaImpresoras");
		gestorIngresos.crearArchivoTxtDelTicket(infoUsu,ICapturado,1, aplicacomision,impresoras.get(0).getImpresora(), session);
		return true;
	}
	
	private boolean actualizaImporteNotaXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
											infoUsu.getUname_br(),				
										    Integer.parseInt(request.getParameter("tipoPago")),
										    "", 
										    String.valueOf(request.getParameter("folio_caja")), 
										    "",  "", "", "", 0, "", "0",  "0",  "0",  "0",   "0",  "0",  "0",
										    String.valueOf(request.getParameter("notaCredito")),
										    String.valueOf(request.getParameter("notaDevolucion")),0,"",
										    String.valueOf(request.getParameter("encargado")),
										    String.valueOf(request.getParameter("observaciones")),
										    String.valueOf(request.getParameter("documento_credito")),
										    String.valueOf(request.getParameter("documento_devolucion")),"","","","","","","0.00","","","","","");
		boolean actualizoImpNota_BD = gestorIngresos.actualizaImporteNotaXID(infoUsu, this.querys, ICapturado, session,String.valueOf(request.getParameter("tipoNota")));		
		return actualizoImpNota_BD;	
	}
	
	private boolean validaNotaEnBD(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");		
		boolean existeNotaEnBD = existeNotaEnBD = (String.valueOf(request.getParameter("tipoNota")).equals("Credito")) ? 
				 gestorIngresos.validaExistaNotaEnBD(infoUsu, this.querys, String.valueOf(request.getParameter("tipoNota")), String.valueOf(request.getParameter("documento_credito"))):
			     gestorIngresos.validaExistaNotaEnBD(infoUsu, this.querys, String.valueOf(request.getParameter("tipoNota")), String.valueOf(request.getParameter("documento_devolucion")));
				 
		return existeNotaEnBD;
	}
		
	private boolean cancelarImporteNotaXID(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");	
		String tipoNota = String.valueOf(request.getParameter("tipoNota"));
		Ingresos ICapturado= new Ingresos(infoUsu.getUname(),
										  infoUsu.getUname_br(),
										  Integer.parseInt(request.getParameter("tipoPago")),
										  "", 
										  String.valueOf(request.getParameter("folio_caja")), 
										  "",  "", "", "", 0, "", "0", "0", "0", "0",  "0", "0", "0","0","0",0,"","0","0","","","","","","","","","0.00","","","","",""); 
		boolean canceloImpNota_BD = gestorIngresos.cancelaImporteNotaXID(infoUsu, this.querys, ICapturado, session, tipoNota);	
		return canceloImpNota_BD;
	}
	
	private String guardaFacturaCreditoManual(HttpServletRequest request, HttpSession session)
	{
		String respuesta = "";
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");	
		String facturaLarga = String.valueOf(request.getParameter("facturaManual"));
		String formaPagoFac = String.valueOf(request.getParameter("formaPago"));
		boolean existeFacturaDia= false;
		if(!infoUsu.getUname().equals(infoUsu.getUname_br()))
		{
			existeFacturaDia = gestorIngresos.validaSiExisteFacturaCreditoEnElDia(infoUsu, this.querys, facturaLarga);
		}
		if(existeFacturaDia == false)
		{
			boolean existeFactura= gestorIngresos.validaSiLaFacturaEsValida(infoUsu, this.querys, facturaLarga, formaPagoFac);
			if(existeFactura)
			{
				respuesta ="FacturaValida" ;
			}
			else
			{
				respuesta ="FacturaNoValida" ;
			}
		}
		else
		{
			respuesta ="FacturaDuplicada" ;
		}
		
		return respuesta;
	}
		
	private void buscarHojaDeRutaXID(HttpServletRequest request, HttpSession session)
	{
		try
		{
			Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
			String folioHojaRuta = request.getParameter("folioHojaRuta");
			boolean existenciaFolioHojaRuta= gestorIngresos.existenciaFolioHojaRuta(infoUsu, this.querys,folioHojaRuta);
			if (existenciaFolioHojaRuta) 
			{
				boolean inserccionHojaRuta = gestorIngresos.insertarHojaDeRuTa(infoUsu, this.querys,folioHojaRuta);
				
				if (inserccionHojaRuta) 
					session.setAttribute("msjRespuestaHojaRuta", "");
				else
					session.setAttribute("msjRespuestaHojaRuta", "ERROR: AL AGREGAR LA HOJA DE RUTA.");
			}
			else 
				session.setAttribute("msjRespuestaHojaRuta", "ERROR: EL FOLIO  DE HORA DE RUTA NO EXISTE");
		}
		catch(Exception ex)
		{
			System.out.println("Error buscra la Hoja De Ruta." + ex.getMessage().toString());
		}
	}
		
	private boolean actualizaFechaPoliza(HttpServletRequest request, HttpSession session)
	{
		String[] Arrayfecha = String.valueOf(request.getParameter("fecha_poliza")).split("/");
		String fechaPoliza = Arrayfecha[2] + "-" + Arrayfecha[1] + "-" + Arrayfecha[0];
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");		
		Ingresos ICapturado= new Ingresos( infoUsu.getUname(),
										   infoUsu.getUname_br(),				
										   Integer.parseInt(request.getParameter("tipoPago")),
										   "",  String.valueOf(request.getParameter("folio_caja")), 
										   "",  "", "", "", 0, "","0", "0", "0",  "0",  "0", "0", "0","","",0,"","", "", "","","","","","",
										   fechaPoliza,"","0.00","","","","",""); 
		boolean actualizoFechaNota_BD = gestorIngresos.actualizaFechaPolizaXID(infoUsu, this.querys, ICapturado);
		return actualizoFechaNota_BD;	
	}
	
	
	private List<DetalleFolioHojaRuta> consultaDetalleFolioHojaruta(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Ingresos ICapturado= new Ingresos(	infoUsu.getUname(),
				infoUsu.getUname_br(),				
			    3,
			    "", 
			    String.valueOf(request.getParameter("folio_caja")), 
			    "",  "", "", "", 0, "", "0",  "0",  "0",  "0",   "0",  "0",  "0","", "",0,"","","", "","","","","","","","","0.00","","","","","");	
		List<DetalleFolioHojaRuta> listaDetalleFolioHR = gestorIngresos.consultaDetallefolioHojaRuta(infoUsu, this.querys, ICapturado);	
		return listaDetalleFolioHR;
	}
	
	private void enviarRespuestaTextoJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
	{
		try
		{
			PrintWriter out = response.getWriter();
		    out.write(respuesta);
		}
		catch(Exception ex)
		{
			System.out.println("Error al re-direccionar vista." + ex.getMessage().toString());
		}
	}
	
	private void enviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String listaJson)
	{
		try
		{
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			out.write(listaJson);	
		}
		catch(Exception ex)
		{
			System.out.println("Error al re-direccionar vista." + ex.getMessage().toString());
		}
	}
	
	private void redireccionarVista(HttpServletRequest request, HttpServletResponse response, String vista)
	{
		try
		{
			RequestDispatcher rdIndex = request.getRequestDispatcher("jsp/" + vista);			    	
		    rdIndex.forward(request, response);
		}
		catch(Exception ex)
		{
			System.out.println("Error al re-direccionar vista." + ex.getMessage().toString());
		}
	}

	
}
