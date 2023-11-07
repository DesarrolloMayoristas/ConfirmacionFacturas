package cdo.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.json.JsonArray;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import cdo.Datos.Querys;
import cdo.Datos.Relacion;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorConfirmacionFacturas;
import cdo.Persistencia.GestorGenerarCorte;
import cdo.util.EjecucionBD;


public class ConfirmacionFacturasServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;
	@SuppressWarnings("unused")
	
	private static GestorConfirmacionFacturas gFacturas;
	private static EjecucionBD gQuery;
	private Gson gson;
    public ConfirmacionFacturasServlet() 
    {
    	super();
    	gFacturas = new GestorConfirmacionFacturas();
    	gQuery = new EjecucionBD();
    	gson = new Gson();
    }
    

    @SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		HttpSession session = request.getSession(true);
		if(session!=null)
		{  
			try 
			{
				VerificaPeticionOrigen(request,response, session);
			}
			catch (Exception e) 
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
		
		String cve_usuario  = "";
		Usuario infoUsu = (Usuario) session.getAttribute("infoUsu"); 
		HashMap<String, String> valores = new HashMap<>();
		valores = new ObjectMapper().readValue(String.valueOf(request.getParameter("valores")), HashMap.class);
		valores.put("USUARIO", infoUsu.getCve_usuario());
		List<Querys> querys = (List<Querys>) session.getAttribute("querys");
		
		String accion = obtenerValorJson("accion", valores);
		System.out.println("asc; "+accion);
		switch (accion) 
		{
			case "insertarFacturaAlmacen":
				insertarFacturaAlmacen(querys,infoUsu,request,response,session,valores);
				break;
			case "updateFacturas":  
				enviarFacturas(querys,infoUsu,request,response,session,valores);
				break;
			case "generarRelacion":  
				generarRelacion(querys,infoUsu,request,response,session,valores);
				break;
		}
	}

	private void generarRelacion(List<Querys> querys, Usuario infoUsu, HttpServletRequest request,HttpServletResponse response, HttpSession session, HashMap<String, String> valores) throws JsonParseException, JsonMappingException, IOException 
	{
		Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		String s2 = gson.toJson("SI");
			List<Relacion> list =   gQuery.consultaRelacion(String.valueOf(infoUsu.getUname()), querys, Integer.parseInt(obtenerValorJson("query", valores)),valores , obtenerValorJson("operacion", valores), obtenerValorJson("tipo", valores));
		
		
		for (int i = 0; i < list.size(); i++) 
		{
			valores.put("ODESS",list.get(i).getFactura() );
			String folio = gQuery.consultaConsecutivo(String.valueOf(infoUsu.getUname()), querys,27,valores , obtenerValorJson("operacion", valores), obtenerValorJson("tipo", valores));
			try
			{
				String relacion = "http://desweb:8080/wsRelacionCobranza/ws/proceso/xml?cdo="+infoUsu.getUname().toLowerCase()+"&usuario="+infoUsu.getCve_usuario()+"&folio="+folio+"";
				System.out.println(relacion);
				StringBuilder resultado = new StringBuilder();
				URL url = new URL(relacion);
				HttpURLConnection conexion = (HttpURLConnection) url.openConnection();
				conexion.setRequestMethod("GET");
				BufferedReader rd = new BufferedReader(new InputStreamReader(conexion.getInputStream()));
				String linea;
				
			while ((linea = rd.readLine()) != null)
			{
				System.out.println("REPSUESTA: "+resultado.append(linea));
			}
			rd.close();
			} catch (Exception e) 
			{
	        	System.out.println(e.getMessage().toString());
	        }
			
			
		}
	        
		EviarRespuestaJsonJS(request,response, s2); 
	}
	

	private void enviarFacturas(List<Querys> querys, Usuario infoUsu, HttpServletRequest request,HttpServletResponse response, HttpSession session, HashMap<String, String> valores) throws JsonParseException, JsonMappingException, IOException 
	{
		Gson gson = new GsonBuilder().disableHtmlEscaping().create();
		String s2 = gson.toJson(gQuery.ejecucionBD(String.valueOf(infoUsu.getUname()), querys, Integer.parseInt(obtenerValorJson("query", valores)),valores , obtenerValorJson("operacion", valores), obtenerValorJson("tipo", valores)));
		if (Integer.parseInt(obtenerValorJson("query", valores)) == 10) 
		{ 
			GestorGenerarCorte g = new GestorGenerarCorte();
			g.consultarDetalle(request, session, obtenerValorJson("fechacorte", valores), infoUsu, querys, String.valueOf(infoUsu.getUname()));	
		}
		
		EviarRespuestaJsonJS(request,response, s2); 
	}
	private void insertarFacturaAlmacen(List<Querys> querys, Usuario infoUsu, HttpServletRequest request,HttpServletResponse response, HttpSession session, HashMap<String, String> valores) throws JsonParseException, JsonMappingException, IOException 
	{
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
	
	private void EviarRespuestaTextoJS(HttpServletRequest request, HttpServletResponse response, String respuesta)
	{
		try
		{
			response.setContentType("text/plain");
			PrintWriter out = response.getWriter();
			out.write(respuesta);	
		}
		catch(Exception ex)
		{
			System.out.println("ProcesosAlmacen. Error al re-direccionar vista." + ex.getMessage().toString());
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
