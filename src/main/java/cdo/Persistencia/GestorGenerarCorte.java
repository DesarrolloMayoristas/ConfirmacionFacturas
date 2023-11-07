package cdo.Persistencia;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import cdo.Datos.Corte;
import cdo.Datos.LogAlmacen;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.util.Cls_Querys;
import cdo.util.ConexionBD;
import cdo.util.EjecutaQuerysBD;
import cdo.util.GenerarCorte;
import cdo.util.InsertarLogAlamacen;

public class GestorGenerarCorte 
{
	public String consultarDetalle(HttpServletRequest request, HttpSession session, String fecha, Usuario infoUsu,List<Querys> ListaQuerys, String cdo) 
	{
		session.setAttribute("corte", "");
		String rsp = "No se pudo generar el corte";
		Connection connBD = null;
		PreparedStatement pstm = null;
		connBD = ConexionBD.AbrirConexionBD(infoUsu.getUname().toUpperCase());
		List<Corte> lstPedidos = new ArrayList<Corte>();
		List<Corte> lstPedidos2 = new ArrayList<Corte>();
		GenerarCorte c = new GenerarCorte();
		int aux = 0;
		try 
		{
			String [] querys = new String [25];
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(33, ListaQuerys, querys);
			String qry = "";
			querys = InicializaQueryNumero33(querys, infoUsu,fecha,cdo);
			for (String string : querys) 
			{
				qry += string+",";
			}
			pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			ResultSet rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Consulta datos para generar corte. Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
			if (rs != null) 
			{
				lstPedidos = llenarCorte(rs,infoUsu,lstPedidos,session);
			}
			if (lstPedidos.size()>0)
			{
				
				aux++;
			}
			
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(34, ListaQuerys, querys);
			querys = InicializaQueryNumero33(querys, infoUsu,fecha,cdo);
			qry = "";
			for (String string : querys) 
			{
				qry += string+",";
			}
			pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			 rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Consulta datos para generar corte. Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
			
			if (rs != null) 
			{
				lstPedidos2 = llenarCorte2(rs,infoUsu,lstPedidos2,session);
			}
			if (lstPedidos2.size()>0)
			{
				
				aux++;
			}
			String updateFacCorte = "";
			String folioCorte="";
			try {
			qry = "";
			querys = Cls_Querys.LimpiaListaQuerys(querys);
			querys = Cls_Querys.ObtieneQuerys(38, ListaQuerys, querys);
			querys = InicializaQueryNumero38(querys, infoUsu,fecha,cdo);
			pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
			 rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
					 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
					 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
					 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Consulta consecutivo corte. Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
			
			if (rs != null) 
			{
				while (rs.next()) 
				{
					folioCorte = rs.getString("folio_corte");
				}
			}
			}
			catch (Exception e) 
			{
				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error consultar consecutivo corte. DETALLE: "+Error(e)+". Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
			}
			
			if (!folioCorte.equals("")) 
			{
				
				try { 
					qry = "";
				querys = Cls_Querys.LimpiaListaQuerys(querys);
				querys = Cls_Querys.ObtieneQuerys(39, ListaQuerys, querys);
				querys = InicializaQueryNumero39(querys, infoUsu,folioCorte,fecha);
				pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
				 rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
						 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
						 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
						 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Actualiza facturas corte generado. Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
				}
				catch (Exception e) 
				{
					InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error actualizar facturas corte generado. DETALLE: "+Error(e)+". Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
				}
				try 
				{
					folioCorte = String.valueOf((Integer.parseInt(folioCorte)+1));
					querys = Cls_Querys.LimpiaListaQuerys(querys);
					querys = Cls_Querys.ObtieneQuerys(40, ListaQuerys, querys);
					querys = InicializaQueryNumero40(querys,infoUsu,folioCorte);
					pstm = connBD.prepareStatement("{call " + "ALMACEN.usp_EXECUTE_QUERY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
					 rs = EjecutaQuerysBD.EjecutarQuery(querys[0], querys[1],querys[2], querys[3], querys[4], querys[5], querys[6],
							 querys[7], querys[8], querys[9],querys[10], querys[11], querys[12], querys[13], 
							 querys[14], querys[15], querys[16], querys[17], querys[18], querys[19], querys[20], 
							 querys[21], querys[22], querys[23], querys[24], infoUsu.getUname(),pstm, connBD);
						InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Actualizar folio consecutivo corte a: "+folioCorte+". Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
				}
				catch (Exception e)
				{
					InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al actualizar folio consecutivo corte  a: "+folioCorte+". DETALLE: "+Error(e)+".  Qry["+Qry(seprado(querys))+"]"+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
				}
				
			}
			session.setAttribute("corte", "");
			rsp = c.crearArchivoTxtDelTicket(lstPedidos,infoUsu,session.getAttribute("impresora").toString(),fecha,"0",String.valueOf((Integer.parseInt(folioCorte)-1)),session);
			rsp = c.crearArchivoTxtDelTicket(lstPedidos2,infoUsu,session.getAttribute("impresora").toString(),fecha,"1",String.valueOf((Integer.parseInt(folioCorte)-1)),session);
			
		} 
		catch (Exception e) 
		{
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error en consulta para generar corte. DETALLE: "+Error(e)+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
		}
		finally 
		{
			try 
			{
				connBD.close();
				pstm.close();
			} catch (Exception e2)
			{
				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al cerrar conexion y pstm corte. DETALLE: "+Error(e2)+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
			}
		}
		
		
		if (aux == 0) 
		{
			rsp = "No hay informacion con esa fecha";
		}		
		
		return rsp;
	}


private String[] InicializaQueryNumero33(String[] ListaQuerys, Usuario infoUsu, String fecha, String cdo) 
{
	String where = "";
	  
//	if (infoUsu.getNivel_usuario() == 1)
//	{
//		if (!cdo.equals("")) 
//		{
//			if (!cdo.contains("*")) 
//			{
//				where = " and a.uname = '"+cdo+"'  ";
//			}
//			else
//			{
//				where = " and a.uname_br = '"+cdo.substring(0,cdo.length()-1)+"'  ";
//			}
//		}
//		else
//		{
//			where = " and a.uname_br = '"+infoUsu.getUname_br()+"' ";
//		}
//	}
//	else
//	{
		where = " and a.uname_br = '"+infoUsu.getUname_br()+"' ";
//	}
	
	
	for (int i=0;i <ListaQuerys.length; i++)
	{	
		ListaQuerys[i]= ListaQuerys[i].replace("{FECHA}",fecha);
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_CDO_}",infoUsu.getUname().toUpperCase());
		ListaQuerys[i]= ListaQuerys[i].replace("{USUARIO}",infoUsu.getCve_usuario());
		ListaQuerys[i]= ListaQuerys[i].replace("{COMPLEMENTO_UNAME}",where);
		
		
	}
	return ListaQuerys;
}

private String[] InicializaQueryNumero38(String[] ListaQuerys, Usuario infoUsu, String fecha, String cdo) {
	for (int i=0;i <ListaQuerys.length; i++)
	{	
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_CDO_}",infoUsu.getUname());
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_BR_}",infoUsu.getUname_br());
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_}",infoUsu.getUname().toUpperCase());
		ListaQuerys[i]= ListaQuerys[i].replace("{USUARIO}",infoUsu.getCve_usuario());
		
	}
	return ListaQuerys;
}


private String[] InicializaQueryNumero39(String[] ListaQuerys, Usuario infoUsu, String folioCorte, String fecha) {
	for (int i=0;i <ListaQuerys.length; i++)
	{	
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_CDO_}",infoUsu.getUname());
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_BR_}",infoUsu.getUname_br());
		ListaQuerys[i]= ListaQuerys[i].replace("{FOLIO}",folioCorte);
		ListaQuerys[i]= ListaQuerys[i].replace("{FECHA}",fecha);
		ListaQuerys[i]= ListaQuerys[i].replace("{USUARIO}",infoUsu.getCve_usuario());
		
	}
	return ListaQuerys;
}



private String[] InicializaQueryNumero40(String[] ListaQuerys, Usuario infoUsu, String folioCorte) {
	for (int i=0;i <ListaQuerys.length; i++)
	{	
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_CDO_}",infoUsu.getUname());
		ListaQuerys[i]= ListaQuerys[i].replace("{UNAME_BR_}",infoUsu.getUname_br());
		ListaQuerys[i]= ListaQuerys[i].replace("{USUARIO}",infoUsu.getCve_usuario());
		ListaQuerys[i]= ListaQuerys[i].replace("{FOLIO}",folioCorte);
		
	}
	return ListaQuerys;
}

private String Error(Exception e) 
{
	return e.toString().replace("'", "´");
}
private String Qry(String qry) 
{
	return qry.toString().replace("'","´");
}
private String seprado(String[] querys) 
{
	String qry = " \n \n";
	
	for (String string : querys) 
	{
		if (!string.equals("")) 
		{
			qry = qry + string + "\n";
		}
		
	}
	qry = qry +" \n \n";
	return qry;
}

private List<Corte> llenarCorte2(ResultSet rs, Usuario infoUsu, List<Corte> lstPedidos, HttpSession session) 
{
	try
	{
		while (rs.next())
		{
			
			Corte t = new Corte();
			t.setUname(rs.getString("uname"));
			t.setUname_br(rs.getString("uname_br"));
			t.setPedido(rs.getString("pedido"));
			t.setOde(rs.getString("ode"));
			t.setTransporte(rs.getString("transporte"));
			t.setFacturas(rs.getString("facturas"));
			t.setImporte(formatearImporte(rs.getString("importe")));
			t.setTotalfacturas(rs.getString("facturaTotal"));
			t.setTotalImporte(formatearImporte(rs.getString("importeTotal")));
			lstPedidos.add(t);
		}
	}
	catch (Exception e) 
	{
		InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al llenar datos de generar corte2. DETALLE: "+Error(e)+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
	}
	
	return lstPedidos;
}


private static String formatearImporte(String importe) 
{
	 DecimalFormat formateador = new DecimalFormat("###,###.##");
	 String result = "";
	 if (importe.contains(","))
	 {
		String[] split = importe.split(",");
		String imp = "";
		for (String i : split) 
		{
			imp = imp+formateador.format (Double.parseDouble(i))+",";
		}
		imp = imp.substring(0, imp.length()-1);
		result = imp;
	 }
	 else if (!importe.equals("")) 
	 {
		 result = formateador.format (Double.parseDouble(importe));
	 } 
		return result;
}
private List<Corte> llenarCorte(ResultSet rs, Usuario infoUsu, List<Corte> lstPedidos, HttpSession session) {
	try
	{
		while (rs.next())
		{
			
			Corte t = new Corte();
			t.setUname(rs.getString("uname"));
			t.setUname_br(rs.getString("uname_br"));
			t.setPedido(rs.getString("pedido"));
			t.setOde(rs.getString("ode"));
			t.setTransporte(rs.getString("transporte"));
			t.setFacturas(rs.getString("facturas"));
			t.setImporte(formatearImporte(rs.getString("importe")));
			t.setTotalfacturas(rs.getString("facturaTotal"));
			t.setTotalImporte(formatearImporte(rs.getString("importeTotal")));
			lstPedidos.add(t);
		}
	}
	catch (Exception e) 
	{
		InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al llenar datos de generar corte. DETALLE: "+Error(e)+". Usuario: "+infoUsu.getCve_usuario(),infoUsu.getCve_usuario());
	}
	
	
	return lstPedidos;
}

}
