package cdo.Persistencia;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import cdo.Datos.LogAlmacen;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.util.Cls_Querys;
import cdo.util.ConexionBD;
import cdo.util.EjecutaQuerysBD;
import cdo.util.InsertarLogAlamacen;

public class GestorDatosUsuario 
{

	public GestorDatosUsuario()
	{
	}
		
	/*** Obtiene Centro de archivo de configuracion ***/
	public static Map<String,String> ObtieneCentros(String ArchivoConfiguracion)
	{
		Map<String, String> mapaCdos= new TreeMap<>();
		
		try
		{
			FileReader fr= new FileReader(ArchivoConfiguracion);
			BufferedReader br=new BufferedReader(fr);
			String linea="";
			
			mapaCdos.put("cdf", "CDMX");
			mapaCdos.put("cd2", "PUEBLA");
			mapaCdos.put("cdl", "LEON");
			mapaCdos.put("cdm", "MONTERREY");
			
		}
		catch(Exception ex)
		{
			System.out.println("Error al obtener centros.");
		}
		return mapaCdos;
	}
	
	/*** Obtiene la lista de querys del proceso 68 (Caja Administrativa) ***/
	public static List<Querys> ConsultaTablaQuerysBD(String cdo)
	{
		Connection connBD = null;
		PreparedStatement pstmt =null;
		ResultSet rs=null;
		List<Querys> querys= new ArrayList<>();
		try
		{
			String qry = ObtieneQuery(2, "", "", cdo);
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
		catch(Exception ex)
		{
			System.out.println("Error al consultar tabla de Querys: " + ex.getMessage().toString());
		}
		finally 
		{
			try {pstmt.close();} catch (SQLException e) {e.printStackTrace();}
			try {connBD.close();} catch (SQLException e) {e.printStackTrace();}
		}
		return querys;
	}
		
	/*** Valida y Obtiene informacion del usuario de la BD ***/
	public static Usuario consultaInformacionDeUsuarioBD(String usuario, String password, String cdo)
	{
		Usuario infoUsuario = new Usuario();
		Connection connBD = null;
		PreparedStatement pstmt =null;
		ResultSet rs=null;
		
		try 
		{
			String qry = ObtieneQuery(1, usuario, password,cdo);
			connBD = ConexionBD.AbrirConexionBD(cdo);
			pstmt = connBD.prepareStatement(qry);
			rs = pstmt.executeQuery();
			if(rs != null)
			{
				if(rs.next())
				{
					if(rs.getString("cve_usu") != "")
					{
						infoUsuario.setCve_usuario(rs.getString("cve_usu"));
						infoUsuario.setNombre(rs.getString("nombre"));
						infoUsuario.setCve_departamento(rs.getInt("depto"));
						infoUsuario.setDepartamento(rs.getString("nombre_depto"));
						infoUsuario.setNivel_usuario(rs.getInt("nivel_usuario"));
						infoUsuario.setDato_numerico(rs.getInt("dato_numerico1"));
						infoUsuario.setDato_alfanumerico(rs.getString("dato_alfanumerico1"));
						infoUsuario.setUname(rs.getString("cdo_macro"));
						infoUsuario.setUname_nombre(rs.getString("cdo_macro_nombre").toUpperCase());	
						String uname_br = (rs.getString("cdo_br").toString().equals("")) ? rs.getString("cdo_macro") : rs.getString("cdo_br");						
						infoUsuario.setUname_br(uname_br);
						String nombre_uname_br = (rs.getString("cdo_br").toString().equals("")) ? rs.getString("cdo_macro_nombre") : rs.getString("cdo_br_nombre");	
						infoUsuario.setUname_br_nombre(nombre_uname_br.toUpperCase());
						infoUsuario.setDescripcion(rs.getString("descripcion"));
						 
					}
				}
			}
		}
		catch(Exception ex)
		{
			System.out.println("Error al consultar Usuario. Detalle:" + ex.getMessage().toString());
		}
		finally 
		{
			try {pstmt.close();} catch (SQLException e) {e.printStackTrace();}
			try {connBD.close();} catch (SQLException e) {e.printStackTrace();}
		} 
		return infoUsuario;
	}
		
		/*** Genera la sintaxis de los querys iniciales ***/ 
	public static String ObtieneQuery( int numQuery, String usuario, String password, String cdo)
	{
		String qry="";
		switch(numQuery)
		{
			case 1:
				qry=	"SELECT 	A.cve_usu,  "+
									"A.nombre,   "+
									"A.depto,   "+
									"B.nombre_depto,  "+
									"C.nivel_usuario,  "+
									"C.dato_numerico1,  "+
									"C.dato_alfanumerico1,  "+
									"D.uname AS cdo_macro,  "+
									"D.nombre_corto AS cdo_macro_nombre,   "+
									"IFNULL(E.uname, '') AS cdo_br,  "+
									"E.nombre_corto AS  cdo_br_nombre  ,"
									+ " ifnull(DU.descripcion,DU2.descripcion)  as descripcion  "+
						"FROM 		" + cdo.toUpperCase() +".USUARIOS AS A  "+
									"INNER JOIN " + cdo.toUpperCase() +".DEPARTAMENTOS AS B ON A.depto = B.departamento   "+
									"INNER JOIN " + cdo.toUpperCase() +".USU_PROC_WEB AS C ON  A.cve_usu = C.cve_usu    "+
									"INNER JOIN CECOM.UNAME AS D ON D.uname= '" + cdo.toLowerCase() + "'" +
									"LEFT  JOIN CECOM.UNAME AS E ON E.num_cte = A.num_cli_bod   "
									+ "	left join ALMACEN.tc_DESCRIPCION_UNAME as DU on E.uname = DU.uname_br  "+
									" left join ALMACEN.tc_DESCRIPCION_UNAME as DU2 on D.uname = DU2.uname_br "+
					    "WHERE  	 A.cve_usu = '"+ usuario.toUpperCase() +"'  AND password= '" + password + "' AND C.proc_web= '181'";
			break;
				
			case 2:
				qry=  "SELECT 		DISTINCT proc_web AS proceso, "+
									"indice_query, "+
									"sub_indice_query, "+
									"descripcion, "+
									"estructura AS query "+
						"  FROM 	"+cdo.toUpperCase()+ ".QUERYS where proc_web = '181' " +
						"  ORDER BY indice_query ASC, " +
									"sub_indice_query ASC;";
				break;
		}
		return qry;
	}
	private String[] InicializaQueryNumero14(String[] ListaQuerys, Usuario infoUsu)
	{
		for (int i=0;i <ListaQuerys.length; i++)
		{	
			ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_CDO_}",infoUsu.getUname_br());
			ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_}",infoUsu.getUname().toUpperCase());
		}
		return ListaQuerys;
	}
	
	private String Error(Exception e) 
	{
		return e.toString().replace("'", "´");
	}
	public String obtenerImpresora(List<Querys> ListaQuerys, Usuario infoUsu) 
	{
		
		String impresora = "";
		Connection connBD = null;
		PreparedStatement pstm = null;
		connBD = ConexionBD.AbrirConexionBD(infoUsu.getUname());
		String [] querys = new String [25];
			try 
			{
				querys = Cls_Querys.LimpiaListaQuerys(querys);
				querys = Cls_Querys.ObtieneQuerys(20, ListaQuerys, querys);
				querys = InicializaQueryNumero14(querys, infoUsu);
				pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
				ResultSet rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
						 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
						 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
						 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
				while (rs.next())
				{
					impresora = rs.getString("impresora");
				}
//				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"CONSULTA IMPRESORAS  Qry["+querys[0].toString().replace("'","´")+"]",infoUsu.getCve_usuario());
				
			}
			catch (Exception e)
			{
				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al obtener impresora. DETALLE: "+e.toString().replace("'", "´")+"  Qry["+querys[0].toString().replace("'","´")+"]",infoUsu.getCve_usuario());
			}
			finally 
			{
				try 
				{
					connBD.close();
					pstm.close();
				} catch (Exception e2)
				{
					InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al cerrar conexion y pstm impresora. DETALLE: "+e2.toString().replace("'", "´"),infoUsu.getCve_usuario());
				}
			}

		return impresora;
		
	}
	
}
