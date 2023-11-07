package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import cdo.Datos.Egresos;
import cdo.Datos.FacturasReaparticionEgreso;
import cdo.Datos.Ingresos;
import cdo.Datos.ListaInformacionDeEgresos;
import cdo.Datos.ListaInformacionDeIngresos;
import cdo.Datos.Querys;
import cdo.Datos.SemaforoIngresos;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorConfirmaEgresos;


public class ConfirmaEgresosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private static List<Querys> querys =null;
	private static GestorConfirmaEgresos gestorEgresos;
   
    public ConfirmaEgresosServlet() {
        super();
        gestorEgresos = new GestorConfirmaEgresos();
    }
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession session = request.getSession(false);
		if(session!=null)
		{
			this.querys = (List<Querys>) session.getAttribute("querys");
			VerificaPeticionOrigen(request, response,session );
		}  
		else
		{  
			if(session == null){
				System.out.println("Egresos: Session no valida ");
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		doGet(request, response);
	}
	
	private void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) 
	{
		String vista= String.valueOf(request.getParameter("vista"));	
		String operacion= String.valueOf(request.getParameter("operacion"));
		String pagina ="";
		Gson gson = new Gson();
		
		switch(vista)
		{
			case "Menu.html":
				pagina = String.valueOf(request.getParameter("pagina"));	
				RedireccionarVista(request, response,pagina);
			break;
			
			case "ConfirmaEgresos.jsp":
				switch(operacion)
				{
					case "InsertaEgreso":
						boolean insertoECapturadoBD = insertaEgresoBD(request,session);
						EviarRespuestaTextoJS(request, response, String.valueOf(insertoECapturadoBD));
						break;
						
					case "ConsultaEgreso":
						String resultados[] = validaPolizasDeDiasAnteriores(request,session).split("&");						
						boolean polizasGeneradas= Boolean.parseBoolean(resultados[0]); //validaPolizasDeDiasAnteriores(request,session);
						
						List<Egresos> listaEgresos = consultaEgresosEnBD(request,session);
						List<SemaforoIngresos> ListaSemaforo = consultaDatosDelSemaforo(request,session);
						ListaInformacionDeEgresos listaInforEgresos= new ListaInformacionDeEgresos();
						listaInforEgresos.setListaEgresos(listaEgresos);
						listaInforEgresos.setListaSemaforoIngresos(ListaSemaforo);
						listaInforEgresos.setPolAntGeneradas(polizasGeneradas);
						String listaJson = gson.toJson(listaInforEgresos);
						EviarRespuestaJsonJS(request,response, listaJson);
						break;
						
					case "CancelaEgreso":
						boolean cancelaECapturadoBD = cancelaEgresoBD(request,session);
						EviarRespuestaTextoJS(request, response, String.valueOf(cancelaECapturadoBD));
						break;
					
					case "ActualizaTransferenciaEgreso":
						boolean actualizaEgresoBD = actualizaEgresoBD(request,session);
						EviarRespuestaTextoJS(request, response, String.valueOf(actualizaEgresoBD));
						break;
						
					case "ValidarFirmaMancomunada":
						boolean firmaElectronicaCorrecta = validaFirmaMancomunadaParaEgresos(request,session);
						EviarRespuestaTextoJS(request, response, String.valueOf(firmaElectronicaCorrecta));
						break;
						
					case "ActualizaFechaPoliza":
						boolean respuesta = actualizaFechaPoliza(request,session);
						EviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
					break;
					case "ConsultaFacturasRembolso":
						List<FacturasReaparticionEgreso> lstFacturasRembolso = consultaFacturasRembolsoEgreso(request,session);
						String listaJsonRembolso = gson.toJson(lstFacturasRembolso);
						EviarRespuestaJsonJS(request,response, listaJsonRembolso);
					break;
				}
			break;
		}		
	}	
		
	
	private List<FacturasReaparticionEgreso> consultaFacturasRembolsoEgreso(HttpServletRequest request,HttpSession session) 
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<FacturasReaparticionEgreso> lstFacturasRembolso = gestorEgresos.consultaFacturasRembolsoEgreso(infoUsu,request.getParameter("folio"),this.querys);
		return lstFacturasRembolso;
	}

	private String  validaPolizasDeDiasAnteriores(HttpServletRequest request, HttpSession session)
	{
		String polizasGeneradasCorrectamente = "";
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		
		if(infoUsu.getUname().equals(infoUsu.getUname_br()))
		 {
			polizasGeneradasCorrectamente="true&CDO_MACRO";
		 }
		 else
		 {
			 polizasGeneradasCorrectamente = gestorEgresos.validaSiSeGeneroPolizaDiaAnterior(infoUsu, this.querys);
			 
		 }
		return polizasGeneradasCorrectamente;
	}
	
	
	
	
	
	public List<Egresos> consultaEgresosEnBD(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Egresos ECapturado = new Egresos("", "", 
										Integer.parseInt(request.getParameter("tipoEgreso").toString()) ,  
										"", 0 , 0, "", 0, "", "", 0, "", 0, "", 0, "", "", "", 
										String.valueOf(request.getParameter("id_estatus")), 
										"", 0, 0, 0, 
										aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_ini"))), 
										aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_fin"))),"","","");		
		List<Egresos> listaEgresos = gestorEgresos.consultaEgresosPendientesBD(infoUsu, this.querys,ECapturado);
		return listaEgresos;
	}
	
	
	private boolean actualizaFechaPoliza(HttpServletRequest request, HttpSession session)
	{
		String[] Arrayfecha = String.valueOf(request.getParameter("fecha_poliza")).split("/");
		String fechaPoliza = Arrayfecha[2] + "-" + Arrayfecha[1] + "-" + Arrayfecha[0];
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");		
		 
		Egresos ECapturado = new Egresos(	"", "",  
											Integer.parseInt(request.getParameter("tipoPago").toString()) ,  
											"", 
											Integer.parseInt(request.getParameter("folio_caja").toString()) , 
											0, "", 0, "", "", 0, "", 0, "", 0, "", "", "","", "", 0, 0, 0, "", "","",
											fechaPoliza,"");
		boolean actualizoFechaNota_BD = gestorEgresos.actualizaFechaPolizaXID(infoUsu, this.querys, ECapturado);
		return actualizoFechaNota_BD;	
	}
	
	public List<SemaforoIngresos> consultaDatosDelSemaforo(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<SemaforoIngresos> listaSemaforo = gestorEgresos.consultaDatosDelSemaforo(infoUsu, this.querys);
		session.setAttribute("SemaforoimporteMin","Limite: $"+ listaSemaforo.get(0).getImporte_minimo());
		session.setAttribute("SemaforoimporteMax","Maximo: $"+ listaSemaforo.get(0).getImporte_maximo());
		session.setAttribute("SemaforoimporteAct", listaSemaforo.get(0).getImporte_actual());
		return listaSemaforo;
	}
			
	public String aplicaFormatoFecha(String textoFecha)
	{
		String[] arrayFecha = textoFecha.split("/");
		String fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
		return fecha;
	}

	public boolean insertaEgresoBD(HttpServletRequest request,HttpSession session)
	{		
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		boolean insertoECapturadoBD = false;
		Egresos ECapturado=new Egresos(infoUsu.getUname(), 
										infoUsu.getUname_br(), 
										Integer.parseInt(request.getParameter("tipo_pago").toString()), 
										"", 0, 
										Integer.parseInt(String.valueOf(request.getParameter("folio"))), 
										String.valueOf(request.getParameter("monto")), 
										0, "", 
										String.valueOf(request.getParameter("referencia")), 
										Integer.parseInt(request.getParameter("banco").toString()), 
										"", 
										Integer.parseInt(request.getParameter("bancoDeposito").toString()), 
										"", 0, "", "", 
										infoUsu.getCve_usuario(), 
										"1", "", 0, 0, 0, "", "",
										String.valueOf(request.getParameter("cve_usu_autoriza")),
										String.valueOf(request.getParameter("fechaPoliza")),
										String.valueOf(request.getParameter("coletiva")));				
		 
		insertoECapturadoBD = gestorEgresos.insertaEgresos(ECapturado, infoUsu, this.querys,session);
		return insertoECapturadoBD;
		
	}
	
	public boolean cancelaEgresoBD(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Egresos ECapturado=new Egresos(infoUsu.getUname(), 
										infoUsu.getUname_br(), 
										Integer.parseInt(request.getParameter("id_egreso").toString()), 
										"",  
										Integer.parseInt(String.valueOf(request.getParameter("folio"))), 
										0,"", 0, "", "", 0, "", 0, "", 0, "", "", 
										infoUsu.getCve_usuario(), 
										"0", "", 0, 0, 0, "", "","","","");
		boolean canceloECapturadoBD = gestorEgresos.cancelaEgresosXID (infoUsu, this.querys,ECapturado);
		return canceloECapturadoBD;
	}
			
	public boolean actualizaEgresoBD(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		Egresos ECapturado=new Egresos(infoUsu.getUname(), 
										infoUsu.getUname_br(), 
										Integer.parseInt(request.getParameter("id_egreso").toString()), 
										"",  
										Integer.parseInt(String.valueOf(request.getParameter("folio"))), 
										0,"", 0, "", "", 0, "", 0, "",
										Integer.parseInt(String.valueOf(request.getParameter("bancoTransferencia"))),
										"",
										String.valueOf(request.getParameter("numeroTransferencia")), 
										infoUsu.getCve_usuario(), 
										"0", "", 0, 0, 0, "", "","","","");
		boolean actualizoECapturadoBD = gestorEgresos.actualizaEgresosXID(infoUsu, this.querys,ECapturado);
		return actualizoECapturadoBD;
	}
		
	public boolean validaFirmaMancomunadaParaEgresos(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String cve_usu = String.valueOf(request.getParameter("cve_usu"));
		String password = String.valueOf(request.getParameter("password"));
		
		boolean firmaElectronicaCorrecta = gestorEgresos.validaFirmaMancomunadaParaEgresos(infoUsu, this.querys, cve_usu, password);
		return firmaElectronicaCorrecta;
	}
	
	public void EviarRespuestaTextoJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
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
	
	public void EviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String listaJson)
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
		
	public void RedireccionarVista(HttpServletRequest request, HttpServletResponse response, String vista)
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
