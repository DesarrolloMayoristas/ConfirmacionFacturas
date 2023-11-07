
package cdo.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class ConexionBD {
	
	//static final private String USUARIO_BD = "admin.ingresos";
	//static final private String PASSWORD_BD = "1ngr3s0sc4ja";
	
	static final private String USUARIO_BD = "proc_automaticos";
	static final private String PASSWORD_BD = "1210procaut";


	public static Connection AbrirConexionBD(String cdo)
	{	
		Connection conexionBD=null;
        String  nombreServidorBD = "jdbc:mysql://" +"des" + cdo.toLowerCase() + ":3306/CDF";
//		String  nombreServidorBD = "jdbc:mysql://" + cdo.toUpperCase() + ":3306/CTRL_INGRESOS";
		//System.out.println("conexion: "+nombreServidorBD); 
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			conexionBD = DriverManager.getConnection(nombreServidorBD,USUARIO_BD,PASSWORD_BD); 
		}
		catch(Exception ex)
		{
			System.out.println("Error al abrir la conexión a la BD." + ex.getMessage().toString());
		}
		return conexionBD;
	}
	
}
