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

import cdo.Persistencia.GestorChequesDevueltos;
import cdo.Datos.MotivosChequesDevueltos;
import cdo.Datos.ChequesDevueltos;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;

public class ChequesDevueltosServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static List<Querys> querys =null;
    static GestorChequesDevueltos gestorChequesDevueltos = new GestorChequesDevueltos();
    public ChequesDevueltosServlet() 
    {
        super();
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
		HttpSession session = request.getSession(true);
		this.querys = (List<Querys>) session.getAttribute("querys");
		session.setAttribute("chequeCancelados","");
		session.setAttribute("mostrarAlertaAgregar", "");
		VerificaPeticionOrigen(request,response, session);
	}


	private void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ServletException, IOException {
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		String accion = request.getParameter("accion");
		String vista= String.valueOf(request.getParameter("vista"));	
		String operacion= String.valueOf(request.getParameter("operacion"));
		Gson gson = new Gson();

		boolean respuesta=false;

	
			switch (vista) 
			{
			case "ChequesDevueltos.jsp":
				switch (operacion) 
				{
					case "ConsultaInicialCheques":			
						List<ChequesDevueltos> ListIngresosCapturados = gestorChequesDevueltos.consultarChequesRealizados(querys,infoUsu,aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_ini"))),aplicaFormatoFecha(String.valueOf(request.getParameter("fecha_fin"))),String.valueOf(request.getParameter("id_estatus")),String.valueOf(request.getParameter("folio")));
						String listaJson = gson.toJson(ListIngresosCapturados);
						EviarRespuestaJsonJS(request,response, listaJson);
						break;
					case "cancelarCheque":
						String noCheque=String.valueOf(request.getParameter("folio_documento"));
						 respuesta=gestorChequesDevueltos.cancelarCheque(querys,infoUsu,noCheque);
						EviarRespuestaTextoJS(request, response, String.valueOf(respuesta));
						if (respuesta) 
						{
							session.setAttribute("chequeCancelados", "chequeCancelado");
						}
						break;
				}
				break;
				
			case "Menu.html":
				LstMotivosCheDev(request, session);
				LstDatosCheques(request, session);
				RedireccionarVista(request, response);
				break;
			case "Menu2.html":
				switch (accion)
				{ 
					case "Eliminar":
						String chequeDevuelto=ChequeDevuelveDatos(request, response, session);
						session.setAttribute("mostrarAlertaAgregar", "1");
						String txtNumeroCheque = request.getParameter("txtNumeroCheque2");
						String txtFolioCorteCaja = request.getParameter("txtFolioCorteCaja");	
						String txtImporteCheque = request.getParameter("txtImporteCheque3");
						String txtBanco_Deposito = request.getParameter("bancoDeposito");
						boolean insertarChequeDevuelto = gestorChequesDevueltos.insertarChequeDevuelto(querys,infoUsu,new ChequesDevueltos(),chequeDevuelto,1,txtNumeroCheque,txtFolioCorteCaja,txtImporteCheque, txtBanco_Deposito );
						if (insertarChequeDevuelto) 
						{
							session.setAttribute("chequeCancelados", "chequeCancelados");
							LstMotivosCheDev(request, session);
							LstDatosCheques(request, session);
							RedireccionarVista(request, response);
						}
						else
						{
							LstMotivosCheDev(request, session);
							LstDatosCheques(request, session);
							RedireccionarVista(request, response);
						}
					break;
					case "Check":
						/*session.setAttribute("mostrarAlertaAgregar", "1");
						String checkbox []= request.getParameterValues("cbox2");
						String noCheque [] =request.getParameterValues("txtNumeroCheque");
						String importeCheque [] = request.getParameterValues("txtImporteCheque");
						String motivoCheque [] = request.getParameterValues("motivo2");
						String txtCveUsu = infoUsu.getCve_usuario();
						boolean insertVariosCheques=gestorChequesDevueltos.insertarVariosCheques(checkbox,noCheque,importeCheque,motivoCheque,txtCveUsu,querys, infoUsu);
						if (insertVariosCheques) 
						{
							session.setAttribute("chequeCancelados", "chequeCancelados");
							LstMotivosCheDev(request, session);
							LstDatosCheques(request, session);
							RedireccionarVista(request, response);
						}
						else
						{
							LstMotivosCheDev(request, session);
							LstDatosCheques(request, session);
							RedireccionarVista(request, response);
						}*/
					break;
					default:
					RedireccionarVista(request, response);
					break;
					}
				break;
			default:
				break;
			}
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
	public String aplicaFormatoFecha(String textoFecha)
	{
		String[] arrayFecha = textoFecha.split("/");
		String fecha = arrayFecha[2] + "-" + arrayFecha[1] + "-" + arrayFecha[0];
		return fecha;
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private String ChequeDevuelveDatos(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws ServletException, IOException {
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		int txtNumeroCheque = Integer.parseInt(request.getParameter("txtNumeroCheque2"));
		double txtImporteCheque = Double.parseDouble(request.getParameter("txtImporteCheque3"));
		String txtUname = request.getParameter("txtUname");
		String txtUnameBr = request.getParameter("txtUnameBr");
		String txtCveUsu = infoUsu.getCve_usuario();
		String txtFechaPro = request.getParameter("txtFechaPro");
		int txtFolioCorteCaja = Integer.parseInt(request.getParameter("txtFolioCorteCaja"));
		int txtSlcMotivo = Integer.parseInt(request.getParameter("motivo21"));
		int txtSlcBancoDeposito = Integer.parseInt(request.getParameter("bancoDeposito"));
		String DATOSCHEQUES="('"+txtUname+"','"+txtUnameBr+"','"+5+"',@folio+1,'"+txtNumeroCheque+"','"+txtImporteCheque+"','"+1+"','"+txtCveUsu+"','"+txtFolioCorteCaja+"','"+txtSlcMotivo+"','"+2+"',curdate(),curdate(),curtime(),'" + txtSlcBancoDeposito + "','0','CHEQUE DEVUELTO','0', '0')";
		return DATOSCHEQUES;
	}
	
	public static void LstMotivosCheDev(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List <MotivosChequesDevueltos> LstMotivosCheDev = gestorChequesDevueltos.ListarMotivos(querys,infoUsu);
		session.setAttribute("LstMotivosChqDev", LstMotivosCheDev);
	}

	public static void LstDatosCheques(HttpServletRequest request,HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		List<ChequesDevueltos> LstDatosCheques = gestorChequesDevueltos.ConsultarCheques(querys,infoUsu);
		session.setAttribute("LstDatosCheques", LstDatosCheques);
	}
	public static void RedireccionarVista(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		RequestDispatcher rdIndexxx = request.getRequestDispatcher("jsp/" + "ChequesDevueltos.jsp");			    	
		rdIndexxx.forward(request, response);
	}
}
