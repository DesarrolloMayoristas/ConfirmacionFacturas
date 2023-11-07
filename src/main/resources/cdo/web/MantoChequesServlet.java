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

import cdo.Datos.Catalogo_Bancos;
import cdo.Datos.ChequeNominativo;
import cdo.Datos.ConsultaChequeNominativo;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorMantoCheques;
import cdo.util.Cls_Log;

public class MantoChequesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;       
	private static List<Querys>  querys = null;
	private static GestorMantoCheques gestorMantocheques;
	
    public MantoChequesServlet() {
        super();        
        gestorMantocheques = new GestorMantoCheques();
    }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession(false);
		if(session!=null)
		{ 
			this.querys  = (List<Querys>)session.getAttribute("querys");
			verificaPeticionOrigen(request,response, session);
		}  
		else
		{  
			if(session == null){
				System.out.println("Manto. Cheques: Session no valida ");
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
		try
		{
			String vista= String.valueOf(request.getParameter("vista"));	
			String operacion= String.valueOf(request.getParameter("operacion"));
			String datoIncorrecto ="";
			Gson gson = new Gson();		
			
			switch(vista)
			{
				case "Menu.html":
					String pagina = String.valueOf(request.getParameter("pagina"));	
					redireccionarVista(request, response,pagina);
				break;
				
				case "MantenimientoCheques.jsp":
					switch(operacion)
					{
						case "ConsultaCheques":
							ConsultaChequeNominativo consultaCheques=new ConsultaChequeNominativo();
							consultaCheques.setListaChequesNominativos(consultaChequesNominativos(request, session));
							consultaCheques.setListBancos((List<Catalogo_Bancos>)session.getAttribute("listaBancos"));
							String listaJsonCheques = gson.toJson(consultaCheques);
							enviarRespuestaJsonJS(request,response, listaJsonCheques);
							break;
							
						case "ActualizaChequeXID":
							boolean actualizoCheque= actualizarChequeNominativo(request, session);
							enviarRespuestaTextoJS(request,response, String.valueOf(actualizoCheque));
							break;
							
						case "AltaChequeNominativo":
							boolean insertaCheque= insertaChequeNominativo(request, session);
							enviarRespuestaTextoJS(request,response, String.valueOf(insertaCheque));
							break;
							
						case "cancelarChequeNominativo":
							boolean cancelarCheque= cancelarChequeNominativo(request, session);
							enviarRespuestaTextoJS(request,response, String.valueOf(cancelarCheque));
							break;
						
					}
				break;
			}
		}
		catch(Exception ex)
		{
			Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
			System.out.println("Error al validar la peticion. Detalle:" + ex.getMessage().toString());
			Cls_Log.insertaLog(infoUsu, "", "", "Error al validar la peticion. Detalle: [ " + ex.getMessage().toString()+ "] ");
		}
		
	}
		
	private List<ChequeNominativo> consultaChequesNominativos(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String fechaPoliza = request.getParameter("fecha_poliza");
		String estatus = request.getParameter("estatus");
		String des_estatus = request.getParameter("des_estatus");
		String cheque = (request.getParameter("numCheque").toString().equals("")) ? "0" : request.getParameter("numCheque").toString();
		List<ChequeNominativo> listachequesNominativos= gestorMantocheques.consultaChequesNominativos(infoUsu, this.querys, fechaPoliza, cheque, estatus,des_estatus);	
		return listachequesNominativos;
	}
	
	private boolean actualizarChequeNominativo(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		ChequeNominativo ChNominativo	= new ChequeNominativo("", 
																request.getParameter("referencia"), 
																Integer.parseInt(request.getParameter("folio_caja")), 
																Integer.parseInt(request.getParameter("tipoPago")), 
																"", 0, "",
																request.getParameter("importe"), 
																0, "", "", 
																Integer.parseInt(request.getParameter("cve_banco")), 
																"", 
																request.getParameter("ficha_deposito"), 
																Integer.parseInt(request.getParameter("cve_banco_deposito")), 
																"", 
																request.getParameter("fecha_poliza"),
																1, "", "", "");
		boolean actualizoCheque= gestorMantocheques.actualizaCheque(infoUsu, this.querys, ChNominativo);
		return actualizoCheque;
	}
	
	private boolean insertaChequeNominativo(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		ChequeNominativo ChNominativo	= new ChequeNominativo("", 
																request.getParameter("referencia"), 
																Integer.parseInt(request.getParameter("folio_caja")), 
																Integer.parseInt(request.getParameter("tipoPago")), 
																"", 
																Integer.parseInt(request.getParameter("cliente")),
																"", 
																request.getParameter("importe"), 
																0, "", "", 
																Integer.parseInt(request.getParameter("cve_banco")), 
																"", 
																"", 
																0, 
																"", 
																request.getParameter("fecha_poliza"),
																0, "", "", "");
		boolean actualizoCheque= gestorMantocheques.insertaCheque(infoUsu, this.querys, ChNominativo);
		return actualizoCheque;
	}
	
	private boolean cancelarChequeNominativo(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		ChequeNominativo ChNominativo	= new ChequeNominativo("", 
																request.getParameter("referencia"), 
																Integer.parseInt(request.getParameter("folio_caja")), 
																Integer.parseInt(request.getParameter("tipoPago")), 
																"",0,"", "", 0, "", "", 
																Integer.parseInt(request.getParameter("cve_banco")), 
																"", "", 0, "", "",9, "", "", "");
		boolean cancelarCheque= gestorMantocheques.cancelaCheque(infoUsu, this.querys, ChNominativo);
		return cancelarCheque;
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
	
	private void enviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
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
