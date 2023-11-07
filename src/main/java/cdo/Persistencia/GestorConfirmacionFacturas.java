package cdo.Persistencia;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.util.Cls_Querys;
import cdo.util.ConexionBD;
import cdo.util.EjecutaQuerysBD;

public class GestorConfirmacionFacturas 
{
	List<HashMap<String,String>> facturasEscaneadas = new ArrayList<HashMap<String,String>>();
	
	public List<HashMap<String, String>> consultarFacturasEscaneadas(Usuario infoUsu, List<Querys> listaQuerys) 
	{
			PreparedStatement pstmt = null;
			ResultSet rs = null;
			String[] querys = new String[25];
			Connection connBD = null;
			querys = Cls_Querys.LimpiaListaQuerys(querys);  
//			querys = Cls_Querys.ObtieneQuerys(1, listaQuerys, querys, infoUsu);
			System.out.println(querys[0]);
			connBD =  ConexionBD.AbrirConexionBD(infoUsu.getUname().toLowerCase());
			try
			{
				
				pstmt = connBD.prepareStatement("{call " + infoUsu.getUname().toUpperCase() + ".usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");	
				rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1], querys[2], querys[3], querys[4], querys[5], querys[6], querys[7], querys[8], querys[9], querys[10], querys[11], querys[12], querys[13], querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], querys[21], querys[22], querys[23], querys[24], "", pstmt, connBD);
				ResultSetMetaData md = rs.getMetaData();
				int columns = md.getColumnCount();
				List<HashMap<String,String>> list = new ArrayList<HashMap<String,String>>();
				while (rs.next()) 
				{
					HashMap<String,String> row = new HashMap<String, String>(columns);
					for(int i=1; i<=columns; ++i) 
					{
						row.put(md.getColumnName(i),rs.getString(i));
					}
					list.add(row);
				}
				facturasEscaneadas = list;
				if (list.size()==0) 
				{ 
					System.out.println("No se ecnontraron registros al obtener facturas escaneadas");
				}
				
			}
			catch (Exception e) 
			{
				System.out.println("Error al obtener facturas escaneadas gestor: "+e.getMessage().toString());
			}
			finally   
			{
				try 
				{
					pstmt.close();
					connBD.close();
				} catch (Exception e) 
				{				
					System.out.println("Error al cerrar finally consultaFacturas");    
				}
		}
		System.out.println(facturasEscaneadas);
		return facturasEscaneadas;
	}

}
