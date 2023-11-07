package cdo.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.util.EjecucionBD;

@WebServlet(name = "Execute", urlPatterns = {"/Execute"} )  
@MultipartConfig
public class ExecutionServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;   
	private static EjecucionBD gQuery;
	private Gson gson;
    public ExecutionServlet() 
    {
    	super();
    	gQuery = new EjecucionBD();
    	gson = new Gson();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession session = request.getSession(true);
		if(session!=null)
		{  
			try 
			{
				Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
				VerificaPeticionOrigen(request,response, session);
			} catch (Exception e) 
			{
				e.printStackTrace();
			}			
	    }  
		else
		{  
			if(session == null)
			{
				RequestDispatcher rdIndex = request.getRequestDispatcher("/index.jsp");			    	
				rdIndex.forward(request, response);
				return;
			}
		}
	}

	private void VerificaPeticionOrigen(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception
	{
		
		String accion = request.getParameter("accion");
		switch (accion) 
		{
			case "execute":
				executeBD(request,response,session);
				break;
		}
	}


	private void executeBD(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws JsonParseException, JsonMappingException, IOException
	{
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
		HashMap<String, String> valores = new HashMap<>();
		valores = new ObjectMapper().readValue(String.valueOf(request.getParameter("valores")), HashMap.class);
		valores.put("USUARIO", infoUsu.getCve_usuario());
		List<Querys> querys = null;
		if (session.getAttribute("querys") == null) 
		{
			querys = 	gQuery.ConsultaTablaQuerysBD(String.valueOf(infoUsu.getUname()),Integer.parseInt(obtenerValorJson("proceso", valores)));
		}
		else
		{
			querys = (List<Querys>) session.getAttribute("querys");	
		}
		Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		String s2 = gson.toJson(gQuery.ejecucionBD(String.valueOf(infoUsu.getUname()), querys, Integer.parseInt(obtenerValorJson("query", valores)),valores , obtenerValorJson("operacion", valores), obtenerValorJson("tipo", valores)));
		EviarRespuestaJsonJS(request,response, s2);
		
	}

	public String  obtenerValorJson(String key, HashMap<String, String> valores)
	{
		Map<String, String> map = (Map<String, String>) valores;
		for (Map.Entry<String, String> entry : map.entrySet()) 
		{
			if (entry.getKey().equals(key)) 
			{
				return entry.getValue();
			}
		}
		return "";
	}
	
	private String obtenerUsuario(HttpSession session, String cve_usuario) 
	{
		
		try
		{
			if (session.getAttribute("usuarioSurtido") != null) 
			{
			cve_usuario = String.valueOf(session.getAttribute("usuarioSurtido"));
			}
		}
		catch (Exception e) 
		{
			System.out.println("Error al obtener usuario surtido. "+e.getMessage().toString());
			cve_usuario = "";
		}
		return cve_usuario;
	}
	
	public  void EviarRespuestaJsonJS(HttpServletRequest request, HttpServletResponse response, String resp)
	{
		try
		{
			response.setContentType("application/json");
			PrintWriter out = response.getWriter();
			out.write(resp);	
		}
		catch(Exception ex)
		{
			System.out.println("Error al re-direccionar vista." + ex.getMessage().toString());
		}
	}
	

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void RedireccionarVista(HttpServletRequest request,HttpServletResponse response,String seveap) throws ServletException, IOException {
		RequestDispatcher rdIndexxx = request.getRequestDispatcher("jsp/" + seveap);			    	
		rdIndexxx.forward(request, response);
	}
	
	
}
