package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
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

import cdo.Datos.CorteDeCaja;
import cdo.Datos.DetalleIngresos;
import cdo.Datos.PrevioCorteCaja;
import cdo.Datos.PrevioIngresosBancos;
import cdo.Datos.Querys;
import cdo.Datos.SemaforoIngresos;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorConfirmaEgresos;
import cdo.Persistencia.GestorCorteCaja;
import cdo.Persistencia.GestorCortePanamericano;


public class CorteDeCajaServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private static List<Querys> querys =null;
	private static GestorCorteCaja gestorCorte;
 
    public CorteDeCajaServlet() {
        super();
        gestorCorte= new GestorCorteCaja();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession(false);
		if(session!=null)
		{
			this.querys = (List<Querys>) session.getAttribute("querys");
			VerificaPeticionOrigen(request, response,session );		
		}  
		else
		{  
			if(session == null)
			{
				System.out.println("Corte de Caja: Session no valida ");
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
		}  
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) 
	{
		String vista= String.valueOf(request.getParameter("vista"));	
		String operacion= String.valueOf(request.getParameter("operacion"));
		String pagina ="";
		Gson gson = new Gson();
		session.setAttribute("mostrarAlertaDenominaciones", "NO");
		
		switch(vista)
		{
			case "Menu.html":
				consultaPrevioDeIngresosBD(request,session);
				inicializaVariablesDeSemaforo(request,session);
				pagina = String.valueOf(request.getParameter("pagina"));	
				redireccionarVista(request, response,pagina);
			break;
			
			case "CorteDeCaja.jsp":
				
				switch (operacion) 
				{
					case "GeneraCorteDeCaja":
						List<CorteDeCaja> listaDatosCorteCaja= insertaCorteDeCajaEnBD(request, session);
						String listaJson = gson.toJson(listaDatosCorteCaja);
						enviarRespuestaJsonJS(request,response, listaJson);
						break;
						
					case "redondearCorteCaja":
						boolean aplicoMovimientoRedondeo= aplicaRedondeoCorteCaja(request, session);
						session.setAttribute("mostrarAlertaDenominaciones", "SI");
						enviarRespuestaTextoJS(request,response, String.valueOf(aplicoMovimientoRedondeo));
						break;
						
					case "consultaRedondeoDeCorteCaja":
						boolean  exietenRedondeosDeCorteDeCaja = consultaRedondeosExistentesEnCorteDeCaja(request, session);
						enviarRespuestaTextoJS(request,response, String.valueOf(exietenRedondeosDeCorteDeCaja));
						break;
						
					case "eliminaRedondeoDeCorteCaja":
						boolean eliminaRedondeoPrevio = eliminaRedondeosExietentesEnCorteDeCaja(request, session);
						enviarRespuestaTextoJS(request,response, String.valueOf(eliminaRedondeoPrevio));
						break;
						
					case "refrescarCorteDeCaja":
						consultaPrevioDeIngresosBD(request,session);
						inicializaVariablesDeSemaforo(request,session);
						String importesActualizados= String.valueOf(session.getAttribute("importePrevioIEfectivo")) + "/" + String.valueOf(session.getAttribute("importePrevioE")) + "/" + String.valueOf(session.getAttribute("importePrevioTotalEfectivo"));
						enviarRespuestaTextoJS(request,response, importesActualizados);
						break;
					case "ConsultaDetalleXFolioCorteCaja":
						JSONObject person = new JSONObject();
						try {
						List<DetalleIngresos> listaDetalleIngresos = ConsultaDetalleXFolioCorteCaja(request,session);
						//String listaJsonDetalleIngresos = gson.toJson(listaDetalleIngresos);
						  
						  person.put("LISTA", listaDetalleIngresos);
						  Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
						  JSONObject JsoninfoUsu = new JSONObject(infoUsu);
						 // System.out.println("JsoninfoUsu: " + JsoninfoUsu );
						  person.put("USUARIO",  JsoninfoUsu);
						}catch(Exception e) {
							System.out.println("Error al ConsultaDetalleIngresosXFolioCorteCaja en el menu del Servlet ConsultasDeCortes: " + e.toString());
						}
						  //System.out.println("jSON NUEVO:" + person);
						enviarRespuestaTextoJS(request, response, person.toString());
						break;
				}
				break;
		}
	}
	
	private List<DetalleIngresos> ConsultaDetalleXFolioCorteCaja(HttpServletRequest request, HttpSession session) throws SQLException {
		// TODO Auto-generated method stub
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String folioCaja = request.getParameter("folioCajaBuscar");
		String unameBr = request.getParameter("unameBrBusc");
		
		List<DetalleIngresos> listaDetalleIngresos = gestorCorte.ConsultaDetalleXFolioCorteCaja(infoUsu, this.querys,folioCaja,unameBr);
		return listaDetalleIngresos;
	}
	
	/*****  CONSULTA PREVIO DE CORTE DE CAJA  ****/
	private void consultaPrevioDeIngresosBD(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");			
		PrevioCorteCaja previoCorteCaja = gestorCorte.ConsultaPrevioDeIngresosBD(infoUsu, this.querys);
		previoCorteCaja.setListaIngresosBancos(gestorCorte.obtienePrevioIngresosBancos(previoCorteCaja, infoUsu.getUname_br()));
		String importePrevioI = gestorCorte.calculaImportePrevioIngresos(previoCorteCaja.getListaPrevioXTP());
		String importePrevioE = gestorCorte.calculaImportePrevioEgresos(previoCorteCaja.getListaPrevioEgresos());
		String importePrevioEfectivo = gestorCorte.calculaImportePrevioIEfectivo(previoCorteCaja.getListaPrevioXFP());
		String importePrevioTotalEfectivo = gestorCorte.calculaImportePrevioTotalEfectivo(importePrevioEfectivo, importePrevioE );
		String importePrevioTotal = gestorCorte.calculaImportePrevioTotal(importePrevioI, importePrevioE);		
		inicializaVariablesDeSession(session, previoCorteCaja, importePrevioI, importePrevioE, importePrevioTotal, importePrevioEfectivo, importePrevioTotalEfectivo);
	}
	
	/*****  INICILAIZA SEMAFORO  ****/
	private void inicializaVariablesDeSemaforo(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<SemaforoIngresos> ListaSemaforo =gestorCorte.consultaDatosDelSemaforo(infoUsu, this.querys);
		session.setAttribute("SemaforoimporteMin","Limite: $"+ ListaSemaforo.get(0).getImporte_minimo());
		session.setAttribute("SemaforoimporteMax","Maximo: $"+ ListaSemaforo.get(0).getImporte_maximo());
		session.setAttribute("SemaforoimporteAct", ListaSemaforo.get(0).getImporte_actual());
	}
		
	/*****  INICIALIZA VARIABLES DE SESSION  ****/
	private void inicializaVariablesDeSession(HttpSession session, PrevioCorteCaja previoCorteCaja, String importePrevioI, String importePrevioE, String importePrevioTotal, String importePrevioEfectivo, String importePrevioTotalEfectivo)
	{
		session.setAttribute("ListPrevioIXTP", previoCorteCaja.getListaPrevioXTP());
		session.setAttribute("ListPrevioIXFP", previoCorteCaja.getListaPrevioXFP());
		session.setAttribute("ListPrevioE", previoCorteCaja.getListaPrevioEgresos());
		session.setAttribute("ListPrevioEXB", previoCorteCaja.getListaEgresosBancos());
		session.setAttribute("ListDenonimacionBillete", previoCorteCaja.getListaDenominacionesBilletes());
		session.setAttribute("ListDenonimacionMoneda", previoCorteCaja.getListaDenominacionesMonedas());	
		session.setAttribute("ListPrevioIXB", previoCorteCaja.getListaIngresosBancos());
		session.setAttribute("importePrevioIEfectivo", importePrevioEfectivo);
		session.setAttribute("importePrevioTotalEfectivo", importePrevioTotalEfectivo );
		session.setAttribute("importePrevioI", importePrevioI);
		session.setAttribute("importePrevioE", importePrevioE);
		session.setAttribute("importePrevioTotal", importePrevioTotal);
		if(importePrevioTotal.equals(".00") || importePrevioTotal.equals("0") )
			session.setAttribute("MostrarCierreCaja", "NO");
		else
			session.setAttribute("MostrarCierreCaja", "SI");
		crearVariableSessionParaFichaBancaria(session, importePrevioTotalEfectivo);
	}
		
	
	/*****  INSERTA TODO EL CORTE DE CAJA  ****/
	private List<CorteDeCaja> insertaCorteDeCajaEnBD(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String cveUsuAutorizaCorte = request.getParameter("cveUsuAutorizaCorte");
		List<CorteDeCaja> listaDatosCorteCaja = gestorCorte.insertaCorteDeCajaEnBD(infoUsu, this.querys, session, cveUsuAutorizaCorte);
		return  listaDatosCorteCaja;
	}
	
	
	/*****  APLICA REDONDEO A CORTE DE CAJA  ****/
	private boolean aplicaRedondeoCorteCaja(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");		
		String importeRedondeo= request.getParameter("importeRedondeo").replace("$", "").replace(" ", "");
		String tipoRedondeo = request.getParameter("tipoRedondeo");
		
		boolean aplicoMovimientoRedondeo = gestorCorte.generaMovimientoPorRedondeo(infoUsu, this.querys, tipoRedondeo, importeRedondeo);
		return aplicoMovimientoRedondeo;
	}
			
	private boolean consultaRedondeosExistentesEnCorteDeCaja(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");	
		boolean existeRedondeosPrevios = gestorCorte.cosultaRedondeosPreviosEnBD(infoUsu, this.querys);
		return existeRedondeosPrevios;
	}
	
	private boolean eliminaRedondeosExietentesEnCorteDeCaja(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");	
		boolean eliminaRedondeoPrevio = gestorCorte.eliminaRedondeosPreviosEnBD(infoUsu, this.querys);
		return eliminaRedondeoPrevio;
	}
	
	
	
	/*****  RESPUESTA DEL SERVLET  ****/
	public void crearVariableSessionParaFichaBancaria(HttpSession session, String importeECorte)
	{
		String listaImporteEfectivo = "";
		String importeEfectivo = importeECorte;
		importeEfectivo= importeEfectivo.replace("$", "").replace(" ", "");
		for(String numero : importeEfectivo.split(""))
		    listaImporteEfectivo += numero + "|" ;
		//Se inhabilita el registro de session, ya que este estara disponible en corte panamericano
		//session.setAttribute("listaImporteEfectivo", listaImporteEfectivo);
	}
	
	public void enviarRespuestaTextoJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
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
	
	public void enviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String listaJson)
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
	
	public void redireccionarVista(HttpServletRequest request, HttpServletResponse response, String vista)
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
