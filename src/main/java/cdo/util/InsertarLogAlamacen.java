package cdo.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import cdo.Datos.LogAlmacen;
import cdo.Datos.Querys;

public class InsertarLogAlamacen 
{
	public static void insertarLog(LogAlmacen log, String cdo,String uname,String accion,String usuario)
	{

	Connection connBD = null;
	PreparedStatement pstmt = null;
	String qry = "";
	try
	{
		 qry = "INSERT INTO ALMACEN.tc_LOG "+
							 "(uname, "+
							  "cve_usu, "+
							  "accion, " +
							  "fecha_pro, "+
							  "hora_pro) "+
					  "VALUES " +
							"('" + uname + "'," +
								"'"+usuario+"', " +
							 "'"+accion+". V 19.07.21', " +
							 "CURDATE(), " +
							 "CURTIME()); ";
		// System.out.println("qry log almacen: "+qry);
		connBD = ConexionBD.AbrirConexionBD(cdo);
//		System.out.println(qry);
		pstmt = connBD.prepareStatement(qry);
		pstmt.executeUpdate();
	}
	catch(Exception ex)
	{
	}
	finally 
	{
		try 
		{
			connBD.close();
			pstmt.close();
		} 
		catch (SQLException e) {e.printStackTrace();}
	}
	}
	public static String Qry(String qry) 
	{
		return qry.toString().replace("'","´");
	}
}
