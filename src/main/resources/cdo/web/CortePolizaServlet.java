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

import cdo.Datos.CorteDeCaja;
import cdo.Datos.PolizaCompleta;
import cdo.Datos.PrevioCorteCaja;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorCorteCaja;
import cdo.Persistencia.GestorCortePoliza;


public class CortePolizaServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;
	private static List<Querys> querys =null;
	private static GestorCortePoliza gestorPoliza;

    public CortePolizaServlet() 
    {
        super();
        gestorPoliza= new GestorCortePoliza();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession session = request.getSession(false);
		if(session!=null)
		{
			this.querys = (List<Querys>) session.getAttribute("querys");
			verificaPeticionOrigen(request, response,session );		
		}  
		else
		{  
			if(session == null)
			{
				System.out.println("Corte de Poliza: Session no valida ");
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
		session.setAttribute("mostrarCorteDePoliza", "NO");
		session.setAttribute("mostrarCorteDePolizaAdvertencia", "NO");
		
		switch(vista)
		{
			case "Menu.html":
				pagina = "CortePoliza.jsp";
				PolizaCompleta polizaCompleta= consultaPolizaDiaActual(request, session);
				redireccionarVista(request, response,pagina);
			break;
			
			case "CorteDePoliza.jsp":				
				switch (operacion) 
				{	
					case "GeneraPolizaDelDia":
						String generoPolizaBD = generaPolizaDiaEnBD(request, session);
						enviarRespuestaTextoJS(request,response, generoPolizaBD);
					break;
				}
			break;
		}
	}
	
	private String generaPolizaDiaEnBD(HttpServletRequest request, HttpSession session)
	{
		String generoPolizaBD = "La poliza  no se pudo generar";
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");				
		String fechasPolizaValidas= gestorPoliza.validaIngresosEgresosConFechaPolMenor(infoUsu, this.querys);
		
		if(fechasPolizaValidas.equals(""))
		{
			PolizaCompleta polizaCompleta = (PolizaCompleta) session.getAttribute("polizaCompleta");
			boolean generoPoliza = gestorPoliza.generaPolizaDelDiaBD(infoUsu, this.querys, polizaCompleta);
			if(generoPoliza)
			{
				generoPolizaBD="true";
				//session.setAttribute("mostrarCorteDePoliza", "¡Se genero Poliza Del Dia en el sistema correctamente.!");
				/*Poliza Contable*/
				if(infoUsu.getUname().equals(infoUsu.getUname_br()))
				{
					boolean generoPolizaContable = gestorPoliza.generaPolizaContable(infoUsu, this.querys, polizaCompleta);
					if(generoPolizaContable)
					{
						session.setAttribute("mostrarCorteDePoliza", "¡Se genero Poliza Del Dia y Contable en el sistema correctamente.!");
					}
					else
					{
						session.setAttribute("mostrarCorteDePoliza", "¡Se genero Poliza Del Dia en el sistema correctamente, pero no se genero la Poliza Contable!");
					}
				}
				else
				{
					session.setAttribute("mostrarCorteDePoliza", "¡Se genero Poliza Del Dia en el sistema correctamente.!");
				}
			}
			else 
			{
				generoPolizaBD="false";
				session.setAttribute("mostrarCorteDePoliza", "SI");			
			}
		}
		else
		{
			generoPolizaBD=fechasPolizaValidas;
			session.setAttribute("mostrarCorteDePoliza", "SI");	
		}
		return generoPolizaBD;		
	}
		
	private PolizaCompleta consultaPolizaDiaActual(HttpServletRequest request, HttpSession session)
	{
		
		Usuario infoUsu= (Usuario) session.getAttribute("infoUsu");
		PolizaCompleta polizaCompleta=new PolizaCompleta();
		
		String existePolizaDelDia = gestorPoliza.validarSiExistenPolizaDelDiaGenerada(infoUsu, this.querys);
		session.setAttribute("mostrarCorteDePolizaAdvertencia", "NO");
		
		if(existePolizaDelDia.equals("") || existePolizaDelDia.equals("EGRESO_SIN_TRANS"))
		{
			if(existePolizaDelDia.equals("EGRESO_SIN_TRANS"))
			{
				session.setAttribute("mostrarCorteDePolizaAdvertencia", "SI");
			}
			
			polizaCompleta= gestorPoliza.consultaPolizaDelDiaActual(infoUsu, this.querys,  session);
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
			
			String totalPoliza= gestorPoliza.obtieneTotalDePoliza(polizaCompleta.getListaPolDiaTipoIngreso(), polizaCompleta.getListaPolDiaTipoEgreso());	
			if(totalPoliza.equals("0"))
			{
				session.setAttribute("mostrarCorteDePoliza", "¡No Existe informacion en el sistema para la Poliza Del Dia!");
			}
			else 
			{
				session.setAttribute("mostrarCorteDePoliza", "SI");			
			}
		}
		else
		{
			session.setAttribute("mostrarCorteDePoliza", existePolizaDelDia);
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
