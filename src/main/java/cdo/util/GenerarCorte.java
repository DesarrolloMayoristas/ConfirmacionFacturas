

package cdo.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import cdo.Datos.Corte;
import cdo.Datos.LogAlmacen;
import cdo.Datos.PedidosConsulta;
import cdo.Datos.Usuario;

public class GenerarCorte 
{
	
	public String crearArchivoTxtDelTicket(List<Corte> lstPedidos, Usuario infoUsu, String impresora, String fecha,String tipo, String corte, HttpSession session)
	{
		String respuesta = "NO SE PUDO IMPRIMIR";
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");  
		LocalDateTime now = LocalDateTime.now();
		String[] fechaHora;
		fechaHora=dtf.format(now).split(" ");
		try
		{
			
//				String rutaNombreArchivo = "/tmp/" + "Ticket_Corte_"+tipo+"_"+fechaHora[1].replace(":","_")+".txt";
				String rutaNombreArchivo = "C:\\Workspace's\\workSpaceAndres\\" + "Ticket_Corte_"+tipo+"_"+fechaHora[1].replace(":","_")+".txt";
	            File archivoDeTicket = new File(rutaNombreArchivo);
	            archivoDeTicket=validaSiExisteArchivoTxtDelTicket(archivoDeTicket,infoUsu,corte);
	            respuesta = creaCuerpoDelArchivoTxtDelTicketC(archivoDeTicket,dtf.format(now), rutaNombreArchivo,infoUsu,impresora,fecha,lstPedidos,tipo,corte,session);
	            InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Impresion correcta Ticket corte, FOLIO: "+corte+", ",infoUsu.getCve_usuario());
            
        } 
		catch (Exception e)
		{
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error en metodo principal generar corte, FOLIO: "+corte+". DETALLE: "+Error(e),infoUsu.getCve_usuario());
        }
		return respuesta;
	}
	
	private String creaCuerpoDelArchivoTxtDelTicketC(File archivoDeTicket, String fecha_hora, String rutaNombreArchivo, Usuario infoUsu, String impresora, String fecha, List<Corte> lstPedidos, String tipo, String corte, HttpSession session) 
	{
		String respuesta = "NO SE PUDO IMPRIMIR";
		try
		{
			FileWriter fw = new FileWriter(archivoDeTicket);
	        BufferedWriter bw = new BufferedWriter(fw);
	        
	        bw = crearSeccionDatosEmpresaParaTicket(bw,infoUsu,fecha_hora,infoUsu,lstPedidos,fecha,tipo,corte,session);
	        bw.close();
	       
//	        respuesta = imprimirTicket(rutaNombreArchivo,impresora,infoUsu,session);
		}
		catch(Exception ex)
		{
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error en crear cuerpo del ticket, creacion de ticket corte FOLIO: "+corte+". DETALLE: "+Error(ex),infoUsu.getCve_usuario());
		}
		return respuesta;
	}


		
	
	public static BufferedWriter crearSeccionDatosEmpresaParaTicket(BufferedWriter bw,Usuario infoUsu, String fecha_hora, Usuario infoUsu2, List<Corte> lstPedidos, String fecha, String tipo, String corte, HttpSession session)
	{
		String r = " ";
		try 
		{
			String totalImporte = "0";
			String totalFacturas = "0";
			
				try
				{	
					String[] fechaHora;
					fechaHora=fecha_hora.split(" ");
					bw.newLine();
					if (tipo.equals("0"))
					{
						bw.write("*********  CORTE DEL DIA CREDITO  ***********");
						r = r + " *********  CORTE DEL DIA CREDITO  *********** \n";
					}
					
					else
					{
						bw.write("***********  CORTE DEL DIA COD  ************");
						r = r + " ***********  CORTE DEL DIA COD  ************ \n";
						
					}
					
					bw.newLine();
					bw.write("--------------------------------------------");
					r = r + " -------------------------------------------- \n";
					bw.newLine();
					bw.write("                "+obtenerNombre(infoUsu.getUname_br()));
					bw.newLine();
					bw.write("********************************************");
					r = r + " ******************************************** \n";
					bw.newLine();
					bw.write("  "+String.format("%-32s", "FECHA:")+fechaHora[0]); 
					r = r + "   "+String.format("%-32s", "FECHA:")+fechaHora[0]+" \n";
					if (!corte.equals(""))
					{
						bw.newLine();
						bw.write("  FOLIO CORTE: "+corte);	
						r = r + "   FOLIO CORTE: "+corte+" \n";
					}
					
					bw.newLine();
					bw.newLine();
					bw.write("  TOTAL DE DOCUMENTOS ENTREGADOS A CLIENTES");
					r = r + "   TOTAL DE DOCUMENTOS ENTREGADOS A CLIENTES"+" \n";
					bw.newLine();
					bw.write("--------------------------------------------");
					r = r + " -------------------------------------------- \n";
					bw.newLine(); 
					bw.newLine();
					if (!fecha.equals(""))
					{
						bw.write("  "+String.format("%-32s", "FECHA CORTE:")+fecha);	
						r = r + "   "+String.format("%-32s", "FECHA CORTE:")+fecha+" \n";
					}
					else {
						bw.write("  REIMPRESION DE CORTE");
						r = r + "   REIMPRESION DE CORTE \n";
					}
					bw.newLine();
					bw.write("  "+infoUsu.getCve_usuario()+" "+infoUsu.getNombre());
					r = r + "   "+infoUsu.getCve_usuario()+" "+infoUsu.getNombre()+" \n";
					bw.newLine();
					bw.newLine();
					bw.write("--------------------------------------------");
					r = r + " -------------------------------------------- \n";
					bw.newLine();
					bw.newLine();
					bw.write("  TRANSPORTE             DOCTO       IMPORTE");
					r = r + "   TRANSPORTE             DOCTO       IMPORTE"+" \n";
					bw.newLine();
					bw.newLine();
					if (lstPedidos.size()>0) 
					{
						for (Corte c : lstPedidos) 
						{
							totalFacturas = c.getTotalfacturas(); totalImporte = c.getTotalImporte();
							int espacio = 0;
							if (c.getTransporte().length()>23){espacio = 23;}else {espacio = c.getTransporte().length();}
							String espTer="  "+String.format("%-"+25+"s", ""+c.getTransporte().substring(0,espacio)+"")+String.format("%-"+(17-c.getImporte().length())+"s", ""+c.getFacturas()+"")+c.getImporte();
							bw.write(espTer);
							r = r + " "+espTer+" \n";
							bw.newLine();
						}
					}
					bw.write("--------------------------------------------");
					r = r + " -------------------------------------------- \n";
					bw.newLine();
					bw.write("  "+String.format("%-25s", "TOTAL DOCUMENTOS:")+String.format("%-"+(17-totalImporte.length())+"s", ""+totalFacturas+"")+totalImporte);
					r = r + "   "+String.format("%-25s", "TOTAL DOCUMENTOS:")+String.format("%-"+(17-totalImporte.length())+"s", ""+totalFacturas+"")+totalImporte+" \n";
					bw.newLine();
					bw.newLine();
					bw.newLine();
					bw.newLine();
					bw.newLine();
					bw.write("   __________________    _________________  ");
					r = r + "    __________________    _________________  "+" \n";
					bw.newLine();
					bw.write("         "+String.format("%-21s", "ENVIOS")+"CREDITO");
					r = r + "          "+String.format("%-21s", "ENVIOS")+"CREDITO"+" \n";
					bw.newLine();
					bw.write("********************************************");
					r = r + " ******************************************** \n";
	
			}
			catch(Exception e)
			{
				InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error al hacer el llenado del ticket corte crearSeccionDatosEmpresaParaTicket. DETALLE: "+Error(e),infoUsu.getCve_usuario());
			}
		}
		catch (Exception e) 
		{
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error en metodo para crear cuerpo de ticket corte  crearSeccionDatosEmpresaParaTicket. DETALLE: "+Error(e),infoUsu.getCve_usuario());
		}
		session.setAttribute("corte", session.getAttribute("corte")+" () "+r);
		return bw;
	}
	private static String obtenerNombre(String uname_br) 
	{
		switch (uname_br) 
		{
		case "cdf":
			uname_br = "CDO CDMX";
			break;
		case "cd2":
			uname_br = "CDO PUEBLA";
			break;
		case "cdl":
			uname_br = "CDO LEON";
			break;
		case "cdm":
			uname_br = "CDO MONTERREY";
			break;
		case "ac2":
			uname_br = "REGIONAL ACAPULCO";
			break;
		case "cto":
			uname_br = "REGIONAL TOLUCA";
			break;
		case "gdl":
			uname_br = "REGIONAL GUDADALAJARA";
			break;
		case "que":
			uname_br = "REGIONAL QUERETARO";
			break;
		case "mor":
			uname_br = "REGIONAL MORELOS";
			break;
		case "pc2":
			uname_br = "REGIONAL PACHUCA";
			break;
		case "tug":
			uname_br = "REGIONAL TUXTLA";
			break;
		case "oa2":
			uname_br = "REGIONAL OAXACA";
			break;
		case "za2":
			uname_br = "REGIONAL ZAMORA";
			break;
		case "slp":
			uname_br = "REGIONAL SAN LUIS";
			break;
		case "dur":
			uname_br = "REGIONAL DURANGO";
			break;

		
		}
		return uname_br;
	}

	private static String Error(Exception e) 
	{
		return e.toString().replace("'", "´");
	}
	 private static String ponerCero(String imp) 
	 {
		 imp = ponerDecimales(imp);
		 String splitIm[] = imp.split("\\.");
			if (splitIm[1].length() == 1) 
			{
				imp = splitIm[0]+"."+splitIm[1]+"0";
			}
			return imp;
	}

	private static String ponerDecimales(String imp) 
	{
		if (!imp.contains(".")) 
		{
			imp = imp+".00";
		}
		return imp;
	}

	private static String formatearImporte(Double importe) 
	 {
		String rsp = "";
		DecimalFormat formateador = new DecimalFormat("###,###.##");
		rsp = formateador.format (importe);
		
		return rsp;
	 }

	private static String formatearFecha(String fecha_corta) 
	 {
		fecha_corta = fecha_corta.replace("-", "/"); 
		String fecha [] = fecha_corta.split("/");
		fecha_corta = fecha[2]+"/"+fecha[1]+"/"+fecha[0];
		return fecha_corta;
	}

	public String imprimirTicket(String rutaNombreArchivo,String impresora,Usuario infoUsu, HttpSession session)
	{
		 String respuesta = "NO SE PUDO IMPRIMIR";
	    try
	    {            
	    	String[] comandoImprimir = {"sh","-c","cat " +rutaNombreArchivo+ " | lp -s -o cpi=17 -o lpi=6.5 -d"+impresora};
	    	final Process procesoImprimir = Runtime.getRuntime().exec(comandoImprimir);
	    	String[] commandEliminarArchivo = {"sh","-c","rm " +rutaNombreArchivo};
	    	final Process processEliminar = Runtime.getRuntime().exec(commandEliminarArchivo);
			respuesta = "SE HA MANDADO A IMPRIMIR CORRECTAMENTE";
			respuesta = respuesta +" () "+ session.getAttribute("corte");
	    } 
	    catch (Throwable t)
	    {
	    	InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error en imprimir Ticket imprimirTicket corte. DETALLE: "+t,infoUsu.getCve_usuario());
	      t.printStackTrace();
	    }
	    return respuesta ;
	}

	 
	private static File validaSiExisteArchivoTxtDelTicket(File archivoDeTicket, Usuario infoUsu, String corte)
	{
		try
		{
			if (!archivoDeTicket.exists()) 
			{
				archivoDeTicket.createNewFile();
			}
			else {
				archivoDeTicket.delete();
				archivoDeTicket.createNewFile();
				
			}
		}
		catch(Exception ex)
		{
			InsertarLogAlamacen.insertarLog(new LogAlmacen("","",""),infoUsu.getUname(),infoUsu.getUname_br(),"Error validaSiExisteArchivoTxtDelTicket, creacion de ticket FOLIO: "+corte+". CORTE . DETALLE: "+Error(ex),infoUsu.getCve_usuario());
		}
		return archivoDeTicket;
	} 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
	 
}
