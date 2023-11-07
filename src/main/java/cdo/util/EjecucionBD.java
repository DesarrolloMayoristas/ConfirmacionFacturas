package cdo.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cdo.Datos.Querys;
import cdo.Datos.Relacion;

public class EjecucionBD 
{
	public String ejecucionBD(String cdo, List<Querys> ListaQuerys, int noQuery, HashMap<String,String> valores, String operacion, String tipo) 
	{
		System.out.println("tip: "+tipo);
		List<HashMap<String,String>> lst = new ArrayList<HashMap<String,String>>();
		Connection connBD = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String[] querys = new String[25];
		
		try
		{
			connBD = ConexionBD.AbrirConexionBD(cdo);
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(noQuery, ListaQuerys, querys);	
			querys = InicializaQuery(querys,cdo.toUpperCase(),valores);
			pstmt = connBD.prepareStatement("{call " + cdo.toUpperCase() +".usp_EXECUTE_QUERY_ALMACEN(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					querys[21], querys[22], querys[23], querys[24], cdo,pstmt, connBD);
			if (tipo.equals("select")) 
			{
				ResultSetMetaData md = rs.getMetaData();
				int columns = md.getColumnCount();
				List<HashMap<String,String>> list = new ArrayList<HashMap<String,String>>();
				while (rs.next()) 
				{	
					HashMap<String,String> row = new HashMap<String, String>(columns);
					for(int i=1; i<=columns; ++i) 
					{
						row.put("\""+md.getColumnLabel(i)+"\"","\""+rs.getString(i)+"\"");
					}
					list.add(row);
				}
				lst = list;
			}
			else
			{
				List<HashMap<String,String>> list = new ArrayList<HashMap<String,String>>();
				HashMap<String,String> row = new HashMap<String, String>(1);
				row.put("\"insert\"", "\"correcto\"");
				list.add(row);
				lst = list;
			}
			
			
		}
		catch(Exception e)
		{
			System.out.println("Error en ejecucionBD en operacion "+operacion+": "+e.getMessage().toString());
		}
		finally 
		{
			try 
			{
				if (connBD != null) 
				{
					connBD.close();
				}
				if (pstmt != null) 
				{
					pstmt.close();
				}
			} 
			catch (Exception e) 
			{
				System.out.println("Error al cerrar la conexion en try finnaly ejecucionBD en proceso "+operacion+"");
			}
		}
		System.out.println("LISTA: "+lst);
		return String.valueOf(lst);
	}
	
	
	
	
	public List<Relacion> consultaRelacion(String cdo, List<Querys> ListaQuerys, int noQuery, HashMap<String,String> valores, String operacion, String tipo) 
	{
		System.out.println("tip: "+tipo);
		Connection connBD = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String[] querys = new String[25];
		List<Relacion> lst= new ArrayList<>();
		try
		{
			connBD = ConexionBD.AbrirConexionBD(cdo);
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(noQuery, ListaQuerys, querys);	
			querys = InicializaQuery(querys,cdo.toUpperCase(),valores);
			pstmt = connBD.prepareStatement("{call " + cdo.toUpperCase() +".usp_EXECUTE_QUERY_ALMACEN(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					querys[21], querys[22], querys[23], querys[24], cdo,pstmt, connBD);
			if (rs != null)
	        {
		        while (rs.next())
		        {
		        	Relacion r= new Relacion();
		        	r.setAgente(rs.getString("agente"));
		        	r.setFactura(rs.getString("ode"));
	        		lst.add(r);
		        }
	        }
			
			
		}
		catch(Exception e)
		{
			System.out.println("Error en ejecucionBD en operacion "+operacion+": "+e.getMessage().toString());
		}
		finally 
		{
			try 
			{
				if (connBD != null) 
				{
					connBD.close();
				}
				if (pstmt != null) 
				{
					pstmt.close();
				}
			} 
			catch (Exception e) 
			{
				System.out.println("Error al cerrar la conexion en try finnaly ejecucionBD en proceso "+operacion+"");
			}
		}
		System.out.println("LISTA: "+lst);
		return lst;
	}
	
	public String consultaConsecutivo(String cdo, List<Querys> ListaQuerys, int noQuery, HashMap<String,String> valores, String operacion, String tipo) 
	{
		
		Connection connBD = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		String[] querys = new String[25];
		List<Relacion> lst= new ArrayList<>();
		String consecutivo = "0";
		try
		{
			connBD = ConexionBD.AbrirConexionBD(cdo);
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(noQuery, ListaQuerys, querys);	
			querys = InicializaQuery(querys,cdo.toUpperCase(),valores);
			pstmt = connBD.prepareStatement("{call " + cdo.toUpperCase() +".usp_EXECUTE_QUERY_ALMACEN(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					querys[21], querys[22], querys[23], querys[24], cdo,pstmt, connBD);
			if (rs != null)
	        {
		        while (rs.next())
		        {
		        	consecutivo = rs.getString("consecutivo");
		        }
	        }
			
			
		}
		catch(Exception e)
		{
			System.out.println("Error en ejecucionBD en operacion "+operacion+": "+e.getMessage().toString());
		}
		finally 
		{
			try 
			{
				if (connBD != null) 
				{
					connBD.close();
				}
				if (pstmt != null) 
				{
					pstmt.close();
				}
			} 
			catch (Exception e) 
			{
				System.out.println("Error al cerrar la conexion en try finnaly ejecucionBD en proceso "+operacion+"");
			}
		}
		return consecutivo;
	}
	
	
	
	
	
	
	
	
	private String[] InicializaQuery(String[] ListaQuerys,String cdo,HashMap<String, String> valores) 
	{
		
		for (int i=0;i <ListaQuerys.length; i++)
		{			
			ListaQuerys[i]= ListaQuerys[i].replace("{CDO}",cdo);
			ListaQuerys[i]= ListaQuerys[i].replace("{UNAME}",cdo.toLowerCase());
			if (valores.size()>0) 
			{
				Map<String, String> map = (Map<String, String>) valores;
				for (Map.Entry<String, String> entry : map.entrySet()) 
				{
					ListaQuerys[i]= ListaQuerys[i].replace("{"+entry.getKey().toUpperCase()+"}",entry.getValue());
				}	
			}
		}
		return ListaQuerys;
	}
	
	public static List<Querys> ConsultaTablaQuerysBD(String cdo, int proceso)
	{
		Connection connBD = null;
		PreparedStatement pstmt =null;
		ResultSet rs=null;
		List<Querys> querys= new ArrayList<>();
		
		try
		{
			String qry = ObtieneQuery(cdo, proceso);
			connBD = ConexionBD.AbrirConexionBD(cdo);
			pstmt = connBD.prepareStatement(qry);
			rs = pstmt.executeQuery();
						
			if (rs != null)
	        {
		        while (rs.next())
		        	
		        {
		        	Querys query= new Querys();
		        	query.setProceso(rs.getInt("proceso"));
		        	query.setIndice_query(rs.getInt("indice_query"));
		        	query.setSub_indice_query(rs.getInt("sub_indice_query"));
		        	query.setDescripcion(rs.getString("descripcion"));
		        	query.setQuery(rs.getString("query"));	  
	        		querys.add(query);
	        	}
	        }
			
		}
			catch(Exception e)
		{
				System.out.println("Error al obtener querys getQuerys execute: "+e.getMessage().toString());
//				InsertarLogAlamacen.insertarLog(new LogAlmacen(0, "Error al obtener tabla de querys. DETALLE: "+Error(e)+".","t"), cdo);
		}
		finally 
		{
			try 
			{
				connBD.close();
				pstmt.close();
			} 
			catch (Exception e) 
			{
				System.out.println("Error al cerrar conexxion y pstm getQuerys execute: "+e.getMessage().toString());
			}
		}

		return querys;
	}
	public static String ObtieneQuery(String cdo, int proceso)
	{
		String qry=  "SELECT 		DISTINCT proc_web AS proceso, "+
					"indice_query, "+
					"sub_indice_query, "+
					"descripcion, "+
					"estructura AS query "+
		"  FROM 	"+cdo.toUpperCase()+ ".QUERYS where proc_web = '"+proceso+"' " +
		"  ORDER BY indice_query ASC, " +
		"sub_indice_query ASC;";

		return qry;
	}
	
}
