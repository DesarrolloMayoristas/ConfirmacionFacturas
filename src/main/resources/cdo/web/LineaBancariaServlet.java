package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.google.gson.Gson;
import cdo.Datos.Linea_Bancaria_Azteca;
import cdo.Datos.Linea_Bancaria_BBVA;
import cdo.Datos.Linea_Bancaria_Banamex;
import cdo.Datos.Linea_Bancaria_Banorte;
import cdo.Datos.Linea_Bancaria_Concentrado;
import cdo.Datos.Linea_Bancaria_Detalle_Concentrado;
import cdo.Datos.Linea_Bancaria_HSBC;
import cdo.Datos.Linea_Bancaria_Layouts;
import cdo.Datos.Linea_Bancaria_Lista_Bancos;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorLineaBancaria;


public class LineaBancariaServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private static List<Querys> querys =null;
	private GestorLineaBancaria gestorLinea = null;
	
    public LineaBancariaServlet() {
        super();
        gestorLinea = new GestorLineaBancaria();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	
		HttpSession session = request.getSession(false);
		if(session!=null)
		{
			this.querys = (List<Querys>) session.getAttribute("querys");
			verificaPeticionOrigen(request, response,session);		
		}  
		else
		{  
			if(session == null){
				System.out.println("Linea bancaria: Session no valida ");
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
		}  
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private void verificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) 
	{
		String vista= String.valueOf(request.getParameter("vista"));	
		String operacion= String.valueOf(request.getParameter("operacion"));
		String pagina ="";
		Gson gson = new Gson();
		String listaJson="";
		
		switch(vista)
		{
			case "Menu.html":
				pagina = String.valueOf(request.getParameter("pagina"));
				consultaLayoutLineaBancarias(request, session);
				session.setAttribute("mensajeError", "");
				session.setAttribute("mensajeExito", "");
				redireccionarVista(request, response,"LineaBancaria.jsp");
				
			break;
			
			case "LineaBancaria.jsp":
				switch(operacion)
				{
					case "inicializaBanco":
						String bancoLineaBancaria = request.getParameter("bancoLineaBancaria"); 
						session.setAttribute("bancoLineaBancaria", bancoLineaBancaria);
						session.setAttribute("mensajeError", "");
						session.setAttribute("mensajeExito", "");
						enviarRespuestaTextoJS(request, response,"correcto");
					break;
					
					case "obtieneLBXEstatus":
						Linea_Bancaria_Lista_Bancos lista_lineasBancos = consultaLineasPendientesEnBD(request, session);
						session.setAttribute("lineasBancariasBancosPen", lista_lineasBancos);
						listaJson = gson.toJson(lista_lineasBancos);
						enviarRespuestaJsonJS(request, response,listaJson);
					break;
					
					case "obtieneConcentradoLBXEstatus":
						List<Linea_Bancaria_Concentrado> listaConcentrado_linea = consultaConcentradoDeLineasBancarias(request, session);
						listaJson = gson.toJson(listaConcentrado_linea);
						enviarRespuestaJsonJS(request, response,listaJson);
					break;
					
					case "obtieneDetalleConcentradoLBXEstatus":
						List<Linea_Bancaria_Detalle_Concentrado> listaDetalleConcentradoOneUser = consultaDetalleConcentradoDeLineasBancariasXCveUsu(request, session);
						listaJson = gson.toJson(listaDetalleConcentradoOneUser);
						enviarRespuestaJsonJS(request, response,listaJson);
					break;
					
					case "obtieneLineaBancariaBanamex":
						List<Linea_Bancaria_Banamex> listalineaBanamex = conusltaLineaBancariaBanamex(request, session);
						listaJson = gson.toJson(listalineaBanamex);
						enviarRespuestaJsonJS(request, response,listaJson);
						break;
					
					case "obtieneLineaBancariaHSBC":
						List<Linea_Bancaria_HSBC> listalineaHSBC = conusltaLineaBancariaHSBC(request, session);
						listaJson = gson.toJson(listalineaHSBC);
						enviarRespuestaJsonJS(request, response,listaJson);
						break;
						
					case "obtieneLineaBancariaBBVA":
						List<Linea_Bancaria_BBVA> listalineaBBVA = conusltaLineaBancariaBBVA(request, session);
						listaJson = gson.toJson(listalineaBBVA);
						enviarRespuestaJsonJS(request, response,listaJson);
						break;
						
				
					case "obtieneLineaBancariaBanorte":
						List<Linea_Bancaria_Banorte> listalineaBanorte = conusltaLineaBancariaBanorte(request, session);
						listaJson = gson.toJson(listalineaBanorte);
						enviarRespuestaJsonJS(request, response,listaJson);
						break;
						
					case "obtieneLineaBancariaAzteca":
						List<Linea_Bancaria_Azteca> listalineaAzteca = conusltaLineaBancariaAzteca(request, session);
						listaJson = gson.toJson(listalineaAzteca);
						enviarRespuestaJsonJS(request, response,listaJson);
						break;
						
					case "actualizaCteXBanco":
						boolean actualizoCteBD = actualizaCteDeLineaBancariaXBanco(request, session);
						enviarRespuestaTextoJS(request, response, String.valueOf(actualizoCteBD));
						break;
						
					case "actualizaCteMasivoXBanco":
						String actualizoCteMasivoBD = actualizaCteMasicoXBanco(request, session);
						enviarRespuestaTextoJS(request, response, actualizoCteMasivoBD);
						break;	
					
						
					case "modificaEncargadoLineaBancaria":
						String asignaECBD = modificaEncargadoLineaBancaria(request, session);
						enviarRespuestaTextoJS(request, response, String.valueOf(asignaECBD));
						break;
						
					case "asignaEncargadoLineaBancaria":
						boolean confirmaECBD = asignaEncargadosEnLneaBancaria(request, session);
						enviarRespuestaTextoJS(request, response, String.valueOf(confirmaECBD));
						break;
						
					case "aplicaRegresarPagoEnLineaBancaria":
						String aplicarRegresarLineaBD = aplicaRegresarPagoEnLineaBancaria(request, session);
						enviarRespuestaTextoJS(request, response, aplicarRegresarLineaBD);
						break;
						
					case "actualizaAgenteXBanco":
						String  actualizaAgte = actualizaAgteDeLineaBancaria(request, session);
						enviarRespuestaTextoJS(request, response, actualizaAgte);
						break;	
						
						
						
				}
				
			break;
		}
	}
	
	/** CONSULTA LINEA BANCARIA INICIAL PENDIENTE**/
	private Linea_Bancaria_Lista_Bancos consultaLineasPendientesEnBD(HttpServletRequest request, HttpSession session)
	{
		Linea_Bancaria_Lista_Bancos lista_lineasBancos= new Linea_Bancaria_Lista_Bancos();
		try 
		{
			Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
			lista_lineasBancos = gestorLinea.consultaLineasBancariasExistentesBD(infoUsu, this.querys,"0");
		}
		catch(Exception ex)
		{
			String sError = ex.getMessage().toString();
		}
		return lista_lineasBancos;
	}
	
	
	/** CONSULTA LINEA BANCARIA X BANCO**/
	private List<Linea_Bancaria_Azteca> conusltaLineaBancariaAzteca(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String idEstatus= request.getParameter("IdEstatus");
		String fechaIni= request.getParameter("fechaIni");
		String fechaFin= request.getParameter("fechaFin");
		List<Linea_Bancaria_Azteca> listalineaAzteca = gestorLinea.consultaLineaBancariaAzteca(infoUsu, this.querys, idEstatus,  fechaIni,  fechaFin);
		return listalineaAzteca;
	}
		
	private List<Linea_Bancaria_Banorte> conusltaLineaBancariaBanorte(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String idEstatus= request.getParameter("IdEstatus");
		String fechaIni= request.getParameter("fechaIni");
		String fechaFin= request.getParameter("fechaFin");
		List<Linea_Bancaria_Banorte> listalineaBanorte = gestorLinea.consultaLineaBancariaBanorte(infoUsu, this.querys, idEstatus,  fechaIni,  fechaFin);
		return listalineaBanorte;
	}
	
	private List<Linea_Bancaria_BBVA> conusltaLineaBancariaBBVA(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String idEstatus= request.getParameter("IdEstatus");
		String fechaIni= request.getParameter("fechaIni");
		String fechaFin= request.getParameter("fechaFin");
		List<Linea_Bancaria_BBVA> listalineaBBVA = gestorLinea.consultaLineaBancariaBBVA(infoUsu, this.querys, idEstatus,  fechaIni,  fechaFin);
		return listalineaBBVA;
	}
		
	private List<Linea_Bancaria_Banamex> conusltaLineaBancariaBanamex(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String idEstatus= request.getParameter("IdEstatus");
		String fechaIni= request.getParameter("fechaIni");
		String fechaFin= request.getParameter("fechaFin");
		List<Linea_Bancaria_Banamex> listalineaBanamex = gestorLinea.consultaLineaBancariaBanamex(infoUsu, this.querys, idEstatus,  fechaIni,  fechaFin);
		return listalineaBanamex;
	}
	
	private List<Linea_Bancaria_HSBC> conusltaLineaBancariaHSBC(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String idEstatus= request.getParameter("IdEstatus");
		String fechaIni= request.getParameter("fechaIni");
		String fechaFin= request.getParameter("fechaFin");
		List<Linea_Bancaria_HSBC> listalineaHSBC = gestorLinea.consultaLineaBancariaHSBC(infoUsu, this.querys, idEstatus,  fechaIni,  fechaFin);
		return listalineaHSBC;
	}
		
	/** ACTUALIZA CLIENTE DE LINEA BANCARIA  X BANCO**/
	private boolean  actualizaCteDeLineaBancariaXBanco(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String banco= request.getParameter("cve_banco");
		String cliente= request.getParameter("num_cliente");
		String id_linea_bancaria= request.getParameter("idLineaBancaria");	
		boolean actualizoCteBD = gestorLinea.actualizaCteDeLineaBancariaXBanco(infoUsu,this.querys,banco, cliente, id_linea_bancaria);
		return actualizoCteBD;
	}
	
	private String actualizaCteMasicoXBanco(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String banco= request.getParameter("cve_banco");
		String cliente= request.getParameter("num_cliente");
		String lineaBancaria = request.getParameter("lineaBancaria");
		
		boolean lineasSelecCorrectamente = gestorLinea.validaSiExistenLineasSeleccionadas(banco, lineaBancaria);
		if(lineasSelecCorrectamente)
		{
			boolean actualizoCteBD = gestorLinea.actualizaCteMasivoXBanco(infoUsu,this.querys,banco, cliente, lineaBancaria);
			return String.valueOf(actualizoCteBD);
		}
		else
			return "LineaNoSeleccionada";		
	}

	/** ACTUALIZA AGENTE  DE LINEA BANCARIA  X BANCO**/
	private String actualizaAgteDeLineaBancaria(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String banco= request.getParameter("cve_banco");
		String num_agente= request.getParameter("num_agente");
		String lineaBancaria = request.getParameter("lineaBancaria");
		String tipoLinea= request.getParameter("tipoLinea");
		
		boolean lineasSelecCorrectamente = gestorLinea.validaSiExistenLineasSeleccionadas(banco, lineaBancaria);
		if(lineasSelecCorrectamente)
		{		
			String actualizoAgteBD = gestorLinea.actualizaAgteMasivoXBanco(infoUsu,this.querys,banco, num_agente.trim(), lineaBancaria, tipoLinea);
			return actualizoAgteBD;
		}
		else
		{
			return "LineaNoSeleccionada";	
		}	
	}
	
	
	/** MODIFICAR ENCARGADO A LINEA BANCARIA X BANCO**/
	private String modificaEncargadoLineaBancaria(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String cve_banco= request.getParameter("cve_banco");
		String encargadoCR= request.getParameter("encargadoCR");
		String lineaBancaria = request.getParameter("lineaBancaria");
		
		boolean lineasSelecCorrectamente = gestorLinea.validaSiExistenLineasSeleccionadas(cve_banco, lineaBancaria);
		if(lineasSelecCorrectamente)
		{		
			String actualizoEncBD = gestorLinea.modificaEncargadoLineaBancaria(infoUsu, this.querys, cve_banco, encargadoCR, lineaBancaria);
			return actualizoEncBD;
		}
		else
		{
			return "LineaNoSeleccionada";	
		}	
	}
	
	/**** ASIGNA ENCARGADO A  BANCARIAS X ID BANCO  ****/	
	public boolean asignaEncargadosEnLneaBancaria(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		boolean actualizoEncBD = gestorLinea.asignaDeEncargadosEnLneaBancaria(infoUsu, this.querys);
		return actualizoEncBD;
	}
	
		
	/**** APLICAR/REGRESAR PAGO EN LINEA  BANCARIAS  ****/	
	public String aplicaRegresarPagoEnLineaBancaria(HttpServletRequest request, HttpSession session)
	{
		String aplicarRegresarLineaBD = "";		
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String accion= request.getParameter("accion");
		String cve_banco= request.getParameter("cve_banco");
		String area= request.getParameter("area");
		String tipoLinea= request.getParameter("tipoLinea");
		String folioPago=  request.getParameter("folioPago");
		String lineaBancaria = request.getParameter("lineaBancaria");
		
		boolean lineasSelecCorrectamente = gestorLinea.validaSiExistenLineasSeleccionadas(cve_banco, lineaBancaria);
		if(lineasSelecCorrectamente)
		{
			if(accion.equals("Aplicar_Pago"))
			{
				if(area.equals("CajaAdministrativa"))
				{
					aplicarRegresarLineaBD = gestorLinea.aplicaRegresarPagoEnLineaBancaria(infoUsu, this.querys, accion, cve_banco, lineaBancaria,area, tipoLinea,folioPago);
				}
				else
				{
					boolean aplicarRegresarBD = gestorLinea.validaSiLaLineaBancariaTieneCliente(cve_banco, lineaBancaria);
					if(aplicarRegresarBD)
					{
						aplicarRegresarLineaBD = gestorLinea.aplicaRegresarPagoEnLineaBancaria(infoUsu, this.querys, accion, cve_banco, lineaBancaria,area, tipoLinea, folioPago);
					}
					else
					{
						aplicarRegresarLineaBD ="SinCliente";
					}
				}
			}
			else
			{
				aplicarRegresarLineaBD = gestorLinea.aplicaRegresarPagoEnLineaBancaria(infoUsu, this.querys, accion, cve_banco, lineaBancaria, area, tipoLinea, folioPago);
			}
			
			return aplicarRegresarLineaBD;
		}
		else
		{
			return "LineaNoSeleccionada";	
		}
	}
			
	private void consultaLayoutLineaBancarias(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<Linea_Bancaria_Layouts>  layoutsLineasBancarias = gestorLinea.obtieneLayoutsDeLasLineasBancarias(infoUsu, this.querys);
		session.setAttribute("layoutsLineasBancarias",layoutsLineasBancarias);
	}
		
	private List<Linea_Bancaria_Concentrado> consultaConcentradoDeLineasBancarias(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
		String IdEstatus = request.getParameter("IdEstatus");
		String fechaIni = request.getParameter("FechaIni");
		String fechaFin = request.getParameter("FechaFin");
		List<Linea_Bancaria_Concentrado> listaConcentrado_linea = gestorLinea.consultaConcentradoDeLineasBancarias(infoUsu, this.querys,IdEstatus, fechaIni,fechaFin);
		List<Linea_Bancaria_Detalle_Concentrado> listaDetalleConcentrado_linea = gestorLinea.consultaDetalleConcentradoDeLineasBancarias(infoUsu, this.querys,IdEstatus);
		session.setAttribute("listaDetalleConcentrado_linea", listaDetalleConcentrado_linea);
		return listaConcentrado_linea;
	}
		
	private List<Linea_Bancaria_Detalle_Concentrado> consultaDetalleConcentradoDeLineasBancariasXCveUsu(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
		String CveUsuCr = request.getParameter("CveUsuCr");
		List<Linea_Bancaria_Detalle_Concentrado> listaDetalleConcentradoAllUsers= (List<Linea_Bancaria_Detalle_Concentrado>) session.getAttribute("listaDetalleConcentrado_linea");
		List<Linea_Bancaria_Detalle_Concentrado> listaDetalleConcentradoOneUser = gestorLinea.consultaDetalleConcentradoDeLineasBancariasXCveUsu(infoUsu, this.querys,CveUsuCr, listaDetalleConcentradoAllUsers);
		
		
		return listaDetalleConcentradoOneUser;
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
