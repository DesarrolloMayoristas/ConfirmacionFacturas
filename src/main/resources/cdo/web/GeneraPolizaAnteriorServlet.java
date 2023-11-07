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

import cdo.Datos.PolizaCompleta;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorGeneraPolizaAnterior;


public class GeneraPolizaAnteriorServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static List<Querys> querys =null;
	private static GestorGeneraPolizaAnterior gestorPolizaAnterior;
          
    public GeneraPolizaAnteriorServlet() {
        super();
        gestorPolizaAnterior = new GestorGeneraPolizaAnterior();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession(false);
		if(session != null)
		{
			this.querys = (List<Querys>) session.getAttribute("querys");
			verificaPeticionOrigen(request, response, session);
		}
		else
		{
			if(session == null)
			{
				System.out.println(" Poliza Anterior: Session no valida");
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
		String  vista = String.valueOf(request.getParameter("vista"));
		String operacion = String.valueOf(request.getParameter("operacion"));
		String pagina = "";
		Gson gson = new Gson();
		session.setAttribute("mostrarCorteDePolizaAnterior", "NO");
		session.setAttribute("mostrarMsjDePolizaAnterior", "NO");
		switch (vista) 
		{
			case "Menu.html":
				 pagina ="GeneraPolizaAnterior.jsp"; 
				 session.setAttribute("mostrarCorteDePolizaAnterior", "");
				 redireccionarVista(request, response, pagina);
			break;
			
			case "GeneraPolizaAnterior.jsp":
				switch (operacion) 
				{
					case "ConsultaPolizaDiaAnterior":
						pagina ="GeneraPolizaAnterior.jsp";
						PolizaCompleta polizaCompleta = consultaPolizaDiaAnterior(request, session);
						redireccionarVista(request, response, pagina);
						//String jsonPolAnterior =gson.toJson(polizaCompleta);
						//enviarRespuestaJsonJS(request,response, jsonPolAnterior);
					break;
				}
				
			break;
		}
	}
	
	private PolizaCompleta consultaPolizaDiaAnterior(HttpServletRequest request, HttpSession session)
	{
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		PolizaCompleta polizaCompleta=new PolizaCompleta();
		String fechaPoliza=request.getParameter("fechaPolizaAnterior").toString();
		String existePolizaDelDia = gestorPolizaAnterior.validarSiExistenPolizaDelDiaGenerada(infoUsu, this.querys, fechaPoliza);
		
		if(existePolizaDelDia.equals(""))
		{
			polizaCompleta= gestorPolizaAnterior.consultaPolizaDelDiaAnterior(infoUsu, this.querys,  session,fechaPoliza);
			session.setAttribute("polizaDiaXTipoIngreso", polizaCompleta.getListaPolDiaTipoIngreso());
			session.setAttribute("polizaDiaXBancoIngreso", polizaCompleta.getListaPolDiaBancoIngresos());
			session.setAttribute("polizaDiaXTipoEgreso", polizaCompleta.getListaPolDiaTipoEgreso());
			session.setAttribute("polizaDiaXOtrosIngresos", polizaCompleta.getListaPolDiaOtrosIngresos());
			session.setAttribute("polizaDiaXRecoleccionValores", polizaCompleta.getListaRecoleccionValores());
			session.setAttribute("polizaCompleta", polizaCompleta);
			session.setAttribute("polizaFichasBancarias", polizaCompleta.getListafichasBancarias());
			session.setAttribute("polizaFichasBancariasEgresos", polizaCompleta.getListafichasBancariasEgresos());
			/*Poliza Contable*/
			session.setAttribute("polizaContable", polizaCompleta.getPolizaContable());
			String totalPoliza= gestorPolizaAnterior.obtieneTotalDePolizanteriorAnterior(polizaCompleta.getListaPolDiaTipoIngreso(), polizaCompleta.getListaPolDiaTipoEgreso());	
			
			if(totalPoliza.equals("0"))
			{
				session.setAttribute("mostrarCorteDePolizaAnterior", "¡No Existe informacion en el sistema para generar la Poliza del dia  " + fechaPoliza + "!");
				session.setAttribute("mostrarMsjDePolizaAnterior", "SI");
			}
			else 
			{
				session.setAttribute("mostrarCorteDePolizaAnterior",  "SI");
				session.setAttribute("mostrarMsjDePolizaAnterior", "NO");
			}
		}
		else
		{
			session.setAttribute("mostrarCorteDePolizaAnterior", "¡Ya fue generada la poliza del dia " + fechaPoliza  +"!");
			session.setAttribute("mostrarMsjDePolizaAnterior", "SI");
		}	
		return polizaCompleta;
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
