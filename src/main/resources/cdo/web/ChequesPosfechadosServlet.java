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

import cdo.Datos.Catalogo_Estatus;
import cdo.Datos.Catalogo_Motivos_Cancelacion_Posfechados;
import cdo.Datos.ChequesPosfechados;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorChequesPosfechados;
/**
 * Servlet implementation class ChequesPosfechadosServlet
 */
public class ChequesPosfechadosServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	private static List<Querys> querys = null;
	static GestorChequesPosfechados gestorPosfechados = new GestorChequesPosfechados();
	
    public ChequesPosfechadosServlet() 
    {
        super();
    }
    
	@SuppressWarnings({ "static-access", "unchecked" })
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession session = request.getSession(false);
        if(session!=null)
        {
        	this.querys  = (List<Querys>)session.getAttribute("querys");
            VerificaPeticionOrigen(request,response, session);
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
	
	private void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ServletException, IOException 
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String vista= String.valueOf(request.getParameter("vista"));	
		String operacion= String.valueOf(request.getParameter("operacion"));
		Gson gson = new Gson();
		switch (vista)
		{ 
			case "ChequesPosfechados.jsp":
			switch (operacion) 
			{
				case "ConsultaInicialCheques":			
					consultarCheques(session,request,response,infoUsu,gson);
					break;
				case "ActualizarEstatusCheques":			
					actualizarChequesPosfechados(session,request,response,infoUsu,gson);
				break;
			}
			break;
			case "Menu.html":
				MotivosCancelacionCheques(request, session,infoUsu);
				EstatusPosfechados(session,request,response,infoUsu,querys);
				redireccionarVista(request, response);
				break;
		} 
	}
	
	private void MotivosCancelacionCheques(HttpServletRequest request, HttpSession session, Usuario infoUsu) 
	{
		List <Catalogo_Motivos_Cancelacion_Posfechados> LstMotivosCancelacionPosfechados = gestorPosfechados.obtenerMotivosCancelacion(querys,infoUsu);
		session.setAttribute("lstMotivosCancelacionPosfechados", LstMotivosCancelacionPosfechados);
	}
	
	private void EstatusPosfechados(HttpSession session, HttpServletRequest request, HttpServletResponse response, Usuario infoUsu, List<Querys> querys) 
	{
		List<Catalogo_Estatus> lstEstatus = new ArrayList<Catalogo_Estatus>();
		lstEstatus = gestorPosfechados.catalogoEstatusPosfechados(lstEstatus,infoUsu,querys);
		session.setAttribute("listaEstatusPosfechados", lstEstatus);
		String estatus = "";
		for (Catalogo_Estatus ce : lstEstatus) 
		{
			estatus = estatus + ce.getId_estatus()+"*"+ce.getNombre_estatus()+",";
		}
		session.setAttribute("lstEstatusPosfechados",estatus = estatus.substring(0,estatus.length()-1));
	}
	
	@SuppressWarnings("unchecked")
	private void actualizarChequesPosfechados(HttpSession session, HttpServletRequest request, HttpServletResponse response,Usuario infoUsu, Gson gson)
	{
		int folio_chequeNominativo = 0;
		if(String.valueOf(request.getParameter("estatus")).equals("transito"))
		{
			folio_chequeNominativo = gestorPosfechados.generaNuevoIngresosChequeNominativo(infoUsu, this.querys, 
																							String.valueOf(request.getParameter("noCheques")), 
																							(List<ChequesPosfechados>) session.getAttribute("lstChequesPosfechados"),
																							String.valueOf(request.getParameter("estatus")),
																							String.valueOf(request.getParameter("fichaDeposito")));
			eviarRespuestaJsonJS(request,response, "Los pofechados ["+ String.valueOf(request.getParameter("noCheques")) +"] cambiaron a estatus: EN TRANSITO A BANCO.");			
		}
		else
		{
			String rsp = gestorPosfechados.cambiarEstatusCheques(String.valueOf(request.getParameter("noCheques")),
																(List<ChequesPosfechados>) session.getAttribute("lstChequesPosfechados"),
																infoUsu,querys,
																String.valueOf(request.getParameter("estatus")),
																String.valueOf(request.getParameter("fichaDeposito")), folio_chequeNominativo);
																eviarRespuestaJsonJS(request,response, rsp);
																
			if(String.valueOf(request.getParameter("estatus")).equals("cancelar"))
			{
				gestorPosfechados.cancelaChequePosfechadoEnPagos(infoUsu, this.querys, 
																 String.valueOf(request.getParameter("noCheques")), 
																 (List<ChequesPosfechados>) session.getAttribute("lstChequesPosfechados"),
																 String.valueOf(request.getParameter("estatus")),
																 String.valueOf(request.getParameter("fichaDeposito")));
			}
		}		
	}
		
	public static void redireccionarVista(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException
	{
		RequestDispatcher rdIndexxx = request.getRequestDispatcher("jsp/" + "ChequesPosfechados.jsp");			    	
		rdIndexxx.forward(request, response);
	}
		
	private void consultarCheques(HttpSession session, HttpServletRequest request, HttpServletResponse response, Usuario infoUsu, Gson gson) 
	{
		List<ChequesPosfechados> lstChequesPosfechados = new ArrayList<ChequesPosfechados>(); 
		lstChequesPosfechados = gestorPosfechados.consultarChequesPosfechados(	querys, infoUsu,
																				aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_ini"))),
																				aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_fin"))), lstChequesPosfechados,
																				String.valueOf(request.getParameter("estatus")),
																				String.valueOf(request.getParameter("banco")),
																				String.valueOf(request.getParameter("usuario")),
																				String.valueOf(request.getParameter("cheque")),
																				String.valueOf(request.getParameter("tipoFecha")));
		String listaJson = gson.toJson(lstChequesPosfechados);
		session.setAttribute("lstChequesPosfechados", lstChequesPosfechados);
		eviarRespuestaJsonJS(request,response, listaJson);
	}
	
	public String aplicaFormatoFecha(String textoFecha)
	{
		String[] arrayFecha = textoFecha.split("/");
		String fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
		return fecha;
	}
	
	public void eviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
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

}
