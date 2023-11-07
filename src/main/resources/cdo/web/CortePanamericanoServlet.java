package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.text.DecimalFormat;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import cdo.Datos.CorteDeCaja;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorControlIngresos;
import cdo.Persistencia.GestorCortePanamericano;


public class CortePanamericanoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static List<Querys>  querys = null;
	private static GestorCortePanamericano gestorPanamericano;
   
    public CortePanamericanoServlet() {
        super();
        gestorPanamericano=new GestorCortePanamericano();
    }

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
				System.out.println("Corte Panamericano Ingresos: Session no valida ");
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
		Gson gson = new Gson();
		List<CorteDeCaja> listaCorteDeCaja2  = (List<CorteDeCaja>) request.getAttribute("data");
		
		switch(vista)
		{
			case "Menu.html":
				String pagina = String.valueOf(request.getParameter("pagina"));	
				request.setAttribute("data", null);
				redireccionarVista(request, response,pagina);
			break;
			
			case "CortePanamericano.jsp":
				switch (operacion) 
				{
					case "ConsultaCortesDeCaja":
						List<CorteDeCaja> listaCorteDeCaja = buscaCortesDeCajaEnBD(request, session);
						String listaJson = gson.toJson(listaCorteDeCaja);
						enviarRespuestaJsonJS(request,response, listaJson);
						break;
						
					case "GeneraCortePanamericano":
						String importeECorte = generaCortePanamericano(request, session);
						enviarRespuestaTextoJS(request,response, importeECorte);
						break;
				}
			break;
		}
	}
	
	
	/***  GENERA CORTE PANAMERICANO  ***/
	private String generaCortePanamericano(HttpServletRequest request, HttpSession session)
	{		
		String importeECorte ="";
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
		String NumPlomo = request.getParameter("NumPlomo");
		String NumPapeleta = request.getParameter("NumPapeleta");
		String importe = request.getParameter("importe").replace(",", "");
		String strJsonCortesCaja = request.getParameter("jsonCortesCaja");
		String fechaPolizaRecValores = request.getParameter("fechaPolizaRecValores");
		boolean generoCortePanamericano = gestorPanamericano.generaCortePanamericano(infoUsu, this.querys, importe, NumPlomo, NumPapeleta, strJsonCortesCaja, fechaPolizaRecValores);
		if(generoCortePanamericano)
		{
			importeECorte = crearVariableSessionParaFichaBancaria(session, importe);
		}
		
		return importeECorte;
	}
	
	public String crearVariableSessionParaFichaBancaria(HttpSession session, String importeECorte)
	{
		DecimalFormat formatoDecimal = new DecimalFormat("#,###.00");
		double importeCP = Double.parseDouble(importeECorte);
		importeECorte = formatoDecimal.format(importeCP);
		
		String listaImporteEfectivo = "";
		String importeEfectivo = importeECorte;
		importeEfectivo= importeEfectivo.replace("$", "").replace(" ", "");
		for(String numero : importeEfectivo.split(""))
		    listaImporteEfectivo += numero + "/" ;
	
		listaImporteEfectivo = listaImporteEfectivo.substring(0, listaImporteEfectivo.length()-1);
		return listaImporteEfectivo;
	}
	
	
	/***  CONSULTA CORTES DE CAJA X FECHA / ESTATUS  ***/
	private List<CorteDeCaja> buscaCortesDeCajaEnBD(HttpServletRequest request, HttpSession session)
	{
		List<CorteDeCaja> listaCorteDeCaja = null;
		try
		{
			Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
			listaCorteDeCaja = gestorPanamericano.consultarCortesDeCajaEnBD(infoUsu, this.querys,
																			request.getParameter("fecha_ini").toString(),
																			request.getParameter("fecha_fin").toString(),
																			request.getParameter("IdEstatus").toString(),
																			request.getParameter("origen").toString(),
																			request.getParameter("papeleta").toString(),
																			request.getParameter("plomo").toString(),
																			request.getParameter("folio_corte").toString(),
																			request.getParameter("folio_panamericano").toString());
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return listaCorteDeCaja;
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
