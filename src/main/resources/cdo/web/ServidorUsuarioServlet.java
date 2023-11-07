package cdo.web;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.sql.ResultSet;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import cdo.Datos.Catalogo_Bancos;
import cdo.Datos.Catalogo_Formas_Pago;
import cdo.Datos.Catalogo_Otros_Ingresos;
import cdo.Datos.Catalogos_Listas;
import cdo.Datos.Log;
import cdo.Datos.Usuario;
import cdo.Datos.Querys;
import cdo.Persistencia.GestorDatosUsuario;
import cdo.util.Cls_Log;
import cdo.util.ServicioImpresion;

public class ServidorUsuarioServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String ArchivoConfiguracion = "C:/home/rama/ControlIngresos/configuracion.txt";
	GestorDatosUsuario gestorUsuario;
	Map<String,String> mapaCdos;
	List<Querys> querys;
       
    public ServidorUsuarioServlet() {
        super();
        gestorUsuario = new GestorDatosUsuario();
        this.mapaCdos = new TreeMap<>();
        this.querys = gestorUsuario.ConsultaTablaQuerysBD("cdf");
    }
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String vistaOrigen= String.valueOf(request.getParameter("vista"));	
		if(!vistaOrigen.equals("Encabezado.html"))
		{
			HttpSession anteriorSession = request.getSession(false);
	        if (anteriorSession != null)
	        	anteriorSession.invalidate();
		}
		HttpSession session = request.getSession(true);		
		VerificaPeticionOrigen(request,response,vistaOrigen, session);
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doGet(request, response);
	}
		
	/*** Metodo inicial para identificar el origen de la peticion ***/
	public void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, String vistaOrigen,HttpSession session)
	{		
		try
		{
			if(vistaOrigen.equals("Inicio.jsp"))
			{
				String vista = "";
				
				if(validaCredencialesDeUsuario(request, session))
				{
					Usuario infoUsuario = (Usuario) session.getAttribute("infoUsu");
					if(infoUsuario.getNivel_usuario() == 0 || infoUsuario.getNivel_usuario() == 2) //UsuarioCajaAdministrativa
					{
						vista="ConfirmaIngresosACaja.jsp";
					}
					else if(infoUsuario.getNivel_usuario() ==1) //UsuarioCreditoCobranza
					{
						vista="LineaBancaria.jsp";
					}
				}
				else
				{
					vista = "Inicio.jsp";
				}	 
				RedireccionarVista(request, response, vista);
			}
			else if(vistaOrigen.equals("SalirDelSistema.jsp"))
			{
				session.invalidate();
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
			else if(vistaOrigen.equals("Encabezado.html"))
			{
				String vista = actualizaInformacionDeSistema(session);
				RedireccionarVista(request, response, vista);
				return;
			}
			else
			{
				session.setAttribute("mapaCdos", this.mapaCdos);
				session.setAttribute("mensaje_respuesta", "");
				RedireccionarVista(request, response, "Inicio.jsp");
			}
		
		}
		catch(Exception ex)
		{
			System.out.println("Error al obtener la petición origen." + ex.getMessage().toString());
		}
	}
	
	/*** Obtiene Centro de archivo de configuracion ***/
	public void ObtieneCentros( HttpSession session, HttpServletRequest request)
	{
		try
		{
			this.mapaCdos = null;//this.gestorUsuario.ObtieneCentros(ArchivoConfiguracion);
		}
		catch(Exception ex)
		{
			System.out.println("Error al obtener los CDOs." + ex.getMessage().toString());
		}
		
		session.setAttribute("mapaCdos", this.mapaCdos);
		session.setAttribute("mensaje_respuesta", "");
	}
		
	/**** Reidrecciona a la pagina correspondiente ***/
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
		
	/*** Verifica si los datos de acceso del usuario son validos ***/
	public boolean validaCredencialesDeUsuario(HttpServletRequest request, HttpSession session)
	{
		 String mensajeRespuesta = "";
		 boolean credencialesCorrectas = false;
		
		 int valorIncorreto = validaDatosCapturados(request);	
		 if(valorIncorreto > 0)
			 mensajeRespuesta =  GeneraMsjRespuesta(valorIncorreto);
		 else
		 {			 
			 String cdo= request.getParameter("cdo_macro");			 
			 Usuario infoUsuario = gestorUsuario.consultaInformacionDeUsuarioBD(request.getParameter("usuario").toUpperCase(), request.getParameter("password"),cdo );
			 if(infoUsuario.getCve_usuario() != "" && infoUsuario.getCve_usuario() != null)
			 {
				 inicializaVariablesSession(infoUsuario, session, cdo);
				 return true;
			 }
			 else
			 {
				 mensajeRespuesta = GeneraMsjRespuesta(6);
			 }
		 }
		 
		 session.setAttribute("mensaje_respuesta", mensajeRespuesta);
		 return credencialesCorrectas;
	}
			
	public int validaDatosCapturados(HttpServletRequest request)
	{
		try
		{
			if(request.getParameter("usuario").toString().length() <= 0)
				return 1;
			
			if(request.getParameter("password").toString().length() <= 0)
				return 2;
			
			if(request.getParameter("cdo_macro").toString().length() <= 0)
				return 3;
			
			if(request.getParameter("proceso_web").toString().length() <= 0)
			return 4;
		}
		catch(NullPointerException exa)
		{
			System.out.println("Datos Incorrectos: " + exa.getMessage());
			return 5;
		}
		return 0;
	}
				
	public String GeneraMsjRespuesta(int valor)
	{
		String msg = "";
		
		switch(valor)
		{
			case 1:
				msg = "El usuario no puede quedar vacío.";
				break;
			case 2:
				msg = "La contraseña no puede quedar vacía.";
				break;
			case 3:
				msg = "Selecciona un CDO valido.";
				break;
			case 4:
				msg = "Indicar el número de proceso del sistema.";
				break;				
			case 5:
				msg = "Los datos ingresados son incorrectos.";
				break;
			case 6:
				msg = "El usuario o contraseña no validos.";
				break;
				
			case 7:
				msg = "La ultima poliza no fue generada, debes solicitarla con el Gerente General.";
				break;
		}
		return msg;
	}
	
	/******* Consulta informacion inicial para al menu del sistema *******/		
	public void inicializaVariablesSession(Usuario infoUsu,  HttpSession session, String cdo)
	{
		 Catalogos_Listas catalogos= gestorUsuario.ObtieneInfoInicialDelSistema(this.querys, infoUsu);
		 		 
		 session.setAttribute("querys", this.querys);
		 session.setAttribute("infoUsu", infoUsu);
		 session.setAttribute("CDOconnBD", infoUsu.getUname());
		 session.setAttribute("listaOtrosIngresos", catalogos.getListaOtrosIngresos());
		 session.setAttribute("listaFormas_Pago", catalogos.getListaFormas_Pago());
		 session.setAttribute("listaBancos", catalogos.getListaBancos());
		 session.setAttribute("listaMotivosCancelacion", catalogos.getListaMotivosCancelacion());
		 session.setAttribute("listaUsuariosCredito", catalogos.getListaUsuariosCredito());
		 session.setAttribute("listaCdos", catalogos.getListaCdos());
		 session.setAttribute("listaEstatus", catalogos.getListaEstatus());
		 session.setAttribute("listaImpresoras", catalogos.getListaImpresoras());
		 session.setAttribute("msjRespuestaHojaRuta", "");
		 session.setAttribute("listaEstatusLinea", catalogos.getListaEstatusLinea());
		 session.setAttribute("listaTiposLinea", catalogos.getListaTiposLinea());
		 session.setAttribute("listaAgentes", catalogos.getListaAgentes());
		 session.setAttribute("IdsContadosModificados", "0/");
		 session.setAttribute("listaEstatusNominativo", catalogos.getListaEstatusNominativo());
		 Cls_Log.insertaLog(infoUsu, "", "", "Inicia session en el sistema");	
	}
	
	public String  actualizaInformacionDeSistema(HttpSession session)	
	{
		 String vista="";
		 Usuario infoUsuario = (Usuario) session.getAttribute("infoUsu");
		 String cdo= infoUsuario.getUname();			 
		 inicializaVariablesSession(infoUsuario, session, cdo);
		 
		 if(infoUsuario.getNivel_usuario() == 0 || infoUsuario.getNivel_usuario() == 2) //UsuarioCajaAdministrativa
		 {
			vista="ConfirmaIngresosACaja.jsp";
		 }
		 else if(infoUsuario.getNivel_usuario() ==1 ) //UsuarioCreditoCobranza
		 {
			vista="LineaBancaria.jsp";
		 }
		 return vista;
	}
	



}
