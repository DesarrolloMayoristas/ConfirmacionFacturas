package cdo.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.print.attribute.standard.DateTimeAtCompleted;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;



import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.commons.fileupload.*;

import cdo.Datos.Linea_Bancaria_Layouts;
import cdo.Datos.Querys;
import cdo.Datos.Usuario;
import cdo.Persistencia.GestorLineaBancaria;
import cdo.util.Extenciones;

public class LineaBancariaUploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	/*  Definicion de tamaño de archivos  */
	private static final int MEMORY_THRESHOLD   = 1024 * 1024 * 3;  // 3MB
    private static final int MAX_FILE_SIZE      = 1024 * 1024 * 40; // 40MB
    private static final int MAX_REQUEST_SIZE   = 1024 * 1024 * 50; // 50MB
    //private static final String RUTA_ARCHIVO  =  "c:/FTP/ticket/";
    private static final String RUTA_ARCHIVO  =  "/tmp/";
    SimpleDateFormat FORMATO_FECHA = new SimpleDateFormat("dd-MM-yyyy");
   
           
    private File ARCHIVO;
    boolean SUBIO_ARCHIVO = false;
    
    public LineaBancariaUploadFile() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		HttpSession session = request.getSession(false);
		
		if(session!=null)
		{
			procesarArchivoSeleccionado(request, response,session);
		}  
		else
		{  
			if(session == null)
			{
				System.out.println("UploadFile: Session no valida.");
				request.getRequestDispatcher("/index.jsp").forward(request, response);
				return;
			}
		}  
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	private void procesarArchivoSeleccionado(HttpServletRequest request, HttpServletResponse response, HttpSession session)
	{
		try 
		{
			Usuario infoUsu = (Usuario) session.getAttribute("infoUsu");
			String nombreArchivo = subirArchivoAlServidor(request, response);
			String banco = session.getAttribute("bancoLineaBancaria").toString();
			Linea_Bancaria_Layouts layoutLineaBancaria = obtieneLayoutDeBancoSeleccionado(session, banco);
			session.setAttribute("mensajeError", " El archivo no se guardó correctamente.");
			session.setAttribute("mensajeExito", "");
			
			if(validaEstructuraDelArchivo(nombreArchivo,banco,session,layoutLineaBancaria))
			{
				String sentenciaDelete = generaSentenciaDeleteLineaBancariaExistente(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
				String sentenciaInsert = lecturaArchivoArchivoSeleccionado(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
				
				if(!sentenciaDelete.equals("") && !sentenciaInsert.equals(""))
				{
					boolean procesoFileCorrectamente = guardaArchivoEnTablasDeBD(infoUsu, session,sentenciaDelete, sentenciaInsert,banco);
					if(procesoFileCorrectamente)
					{
						session.setAttribute("mensajeError", "");
						session.setAttribute("mensajeExito", "El archivo se guardó en  ");
					}
				}
			}
			else
			{
				session.setAttribute("mensajeError", " La  estructura de archivo no es correcta.");
			}
			redireccionarVista(request, response,"LineaBancaria.jsp");
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
	}
	
	private Linea_Bancaria_Layouts obtieneLayoutDeBancoSeleccionado(HttpSession session,  String banco)
	{
		List<Linea_Bancaria_Layouts>  layoutsLineasBancarias = (List<Linea_Bancaria_Layouts>) session.getAttribute("layoutsLineasBancarias");
		
		Linea_Bancaria_Layouts layoutLineaBancaria = new Linea_Bancaria_Layouts();
		
		for(int i=0; i<= layoutsLineasBancarias.size(); i++)
		{
			if(String.valueOf(layoutsLineasBancarias.get(i).getCve_banco()).equals(banco))
		    {
				layoutLineaBancaria = layoutsLineasBancarias.get(i);
				break;
			}
		}
		return layoutLineaBancaria;
	}
	
	
	
	/** 1.  Subir archivo seleccionado al servidor locar **/
	private String subirArchivoAlServidor(HttpServletRequest request, HttpServletResponse response) 
	{
		String nombreArchivo = "";
		try
		{
			// Valida que el archivo seleccionado este en el request
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			
			if (isMultipart) 
			{	
				try 
				{
					//1. Crear una fábrica para elementos de archivo basados ​​en disco
					DiskFileItemFactory factory = new DiskFileItemFactory();
					
					//2.crea un espacio en memoria para los archivos
					factory.setSizeThreshold(MEMORY_THRESHOLD);
					
					//3.Coloca temporalmente el archivo en el servidor 
					factory.setRepository(new File(RUTA_ARCHIVO));
					
					//4.Crear un nuevo controlador de carga de archivos
					ServletFileUpload upload = new ServletFileUpload(factory);
					
					//5.Establece el tamaño máximo del archivo de carga
					upload.setFileSizeMax(MAX_FILE_SIZE);
					
					//6.Establece el tamaño máximo de la solicitud (incluye archivo + datos del formulario)
					upload.setSizeMax(MAX_REQUEST_SIZE);
					response.setContentType("text/html");
					
					PrintWriter out = response.getWriter( );
					
					//7. Analiza el contenido de la solicitud para extraer datos del archivo
					List<FileItem> fileItems = upload.parseRequest(request);
					
					if (fileItems != null && fileItems.size() > 0) 
					{
						//8.Recorre los items del archivo
						for (FileItem item : fileItems) 
						{
							//9.Procesa cada uno de los items
							if (!item.isFormField()) 
							{					
								nombreArchivo = new File(item.getName()).getName();							
								ARCHIVO = new File(RUTA_ARCHIVO.concat(nombreArchivo));								
								item.write( ARCHIVO );		
							}
						}
					}
				} 
				catch(Exception ex)
				{
					ex.printStackTrace();
					throw new ServletException();
				}
			}
			else 
			{
				throw new Exception();
			}
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return nombreArchivo;
	}

	
	/** 2. Valida la estrutura del archivo seleccionado  **/
	private boolean validaEstructuraDelArchivo(String nombreArchivo, String banco,  HttpSession session, Linea_Bancaria_Layouts layoutLineaBancaria)
	{
		boolean estructuraCorrecta= false;
		try
		{
			switch(banco)
			{
				case "16"://HSBC
					estructuraCorrecta = validaEstructuraLayoutExcel(nombreArchivo, layoutLineaBancaria);	
					break;
				
				case "5"://AZTECA
					estructuraCorrecta = validaEstructuraLayoutExcel(nombreArchivo, layoutLineaBancaria);	
					break;
					
				case "12"://BANORTE
					estructuraCorrecta = validaEstructuraLayoutExcel(nombreArchivo, layoutLineaBancaria);	
					break;
					
				case "4"://BANCOMER
					estructuraCorrecta = validaEstructuraLayoutExcel(nombreArchivo, layoutLineaBancaria);	
					break;
					
				case "10"://BANAMEX
					estructuraCorrecta = true;
					break;
			}
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return estructuraCorrecta;
	}
	
	private boolean  validaEstructuraLayoutExcel(String nombreArchivo,Linea_Bancaria_Layouts layoutLineaBancaria)
	{
		boolean estructuraCorrecta = true;
		try
		{
			String columnasLayout[]= layoutLineaBancaria.getLayout_archivo().replace("[", "").replace("]", "").split(",");
			
			Workbook libroExcel = WorkbookFactory.create(new File(RUTA_ARCHIVO + nombreArchivo));
			Sheet hojaExcel = libroExcel.getSheetAt(0);
			DataFormatter dataFormatter = new DataFormatter();
			int numFila = 0;
			int numColumna= 0;
			
			for (Row fila: hojaExcel) 
			{
				if(numFila == 0)
				{
					numFila++;
		            for(Cell celda: fila) 
		            {
		                String valorCelda = dataFormatter.formatCellValue(celda);		                
		                if(valorCelda.equals(columnasLayout[numColumna]))
		                {
		                	 numColumna++;
		                }
		                else
		                {
		                	 estructuraCorrecta = false;
		                	 break;
		                }
		            }
				}
				else
				{
					break;
				}
	        }
			libroExcel.close();			
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
			System.out.println("Error al validar estructura de archivo de linea bancaria Excel: " + sError);
		}
		return estructuraCorrecta;
	}
		
	private void lecturaArchivoExcel(String nombreArchivo, String banco)
	{
		try
		{
			Workbook workbook = WorkbookFactory.create(new File(RUTA_ARCHIVO + nombreArchivo));
			Iterator<Sheet> sheetIterator = workbook.sheetIterator();
			Sheet sheet = workbook.getSheetAt(0);
			DataFormatter dataFormatter = new DataFormatter();
	
			for (Row row: sheet) 
			{
	            for(Cell cell: row) 
	            {
	                String cellValue = dataFormatter.formatCellValue(cell);
	                System.out.print(cellValue + "\t");
	            }
	        }
		    workbook.close();
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
	}
		
	
	/** 3. Lectura  archivo seleccionado  **/
	private String lecturaArchivoArchivoSeleccionado(String nombreArchivo,String banco, HttpSession session,Linea_Bancaria_Layouts layoutLineaBancaria,Usuario infoUsu)
	{
		String sentenciaInsert= "";
		try
		{
			switch(banco)
			{
				case "16"://HSBC
					sentenciaInsert = generaSentenciaInsertConInfoArchivoExcel(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
					break;
				
				case "5"://AZTECA
					sentenciaInsert = generaSentenciaInsertConInfoArchivoExcel(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
					break;
					
				case "12"://BANORTE
					sentenciaInsert = generaSentenciaInsertConInfoArchivoExcel(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);	
					break;
					
				case "4"://BANCOMER
					sentenciaInsert = generaSentenciaInsertConInfoArchivoExcel(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
					break;
					
				case "10"://BANAMEX
					sentenciaInsert = generaSentenciaInsertConInfoArchivoTxt(nombreArchivo,banco,session,layoutLineaBancaria,infoUsu);
					break;
			}
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return sentenciaInsert;
	}
		
	/** 4. Genera sentencia Delete de linea bancaria existente  **/
	private String generaSentenciaDeleteLineaBancariaExistente(String nombreArchivo,String banco, HttpSession session,Linea_Bancaria_Layouts layoutLineaBancaria,Usuario infoUsu)
	{
		String sentenciaDelete = "";
		try
		{
			sentenciaDelete = " DELETE FROM CTRL_INGRESOS." + layoutLineaBancaria.getNombre_tabla_bd() + " WHERE uname = '" + infoUsu.getUname() + "' " + " AND  fecha_pro = CURDATE(); ";  
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return sentenciaDelete;
	}
		
	/** 5.  Creacion de insert del archivo seleccionado  **/
	private String  generaSentenciaInsertConInfoArchivoExcel(String nombreArchivo,String banco, HttpSession session,Linea_Bancaria_Layouts layoutLineaBancaria,Usuario infoUsu)
	{
		String sentenciaInsert = "";
		try
		{
			String arrayColumnasTablaBD[] = layoutLineaBancaria.getColumnas_tabla_bd().replace("[", "").replace("]", "").split(",");
			String arrayColumnasExcel[] = layoutLineaBancaria.getColumnas_excel().replace("[", "").replace("]", "").split(",");
			String sentenciaValues = " VALUES ";
			String sentenciaColumnas = " (uname, cve_banco, cve_usu, fecha_pro, hora_pro, ";
			
			for(int i=0; i < arrayColumnasTablaBD.length; i++)
			{
				sentenciaColumnas += arrayColumnasTablaBD[i] + ",";
			}
			sentenciaColumnas = sentenciaColumnas + "id_estatus,";
			sentenciaColumnas =  sentenciaColumnas.substring(0, sentenciaColumnas.length()- 1) + ")";
						
			Workbook libroExcel = WorkbookFactory.create(new File(RUTA_ARCHIVO + nombreArchivo));
			Sheet hojaExcel = libroExcel.getSheetAt(0);
			DataFormatter dataFormatter = new DataFormatter();
			int numFila = 0;
						
			for (Row fila: hojaExcel) 
			{
				if(numFila == 0)
				{
					numFila++;
				}
				else
				{
					String sentencia = "";
					sentenciaValues += "('" + infoUsu.getUname()+ "', '" +  banco   + "', '" + infoUsu.getCve_usuario() + "', CURDATE(), CURTIME(),";
					for(int i=0; i < arrayColumnasExcel.length; i++)
					{
						Cell cell = fila.getCell(Integer.parseInt(arrayColumnasExcel[i]));
						String valorCelda = dataFormatter.formatCellValue(fila.getCell(Integer.parseInt(arrayColumnasExcel[i])));
						valorCelda= valorCelda.replace("'", "").replace(",", "").replace("$", "").replace("-", "");
						
						valorCelda = (validaSiEsFecha(valorCelda)) ? FORMATO_FECHA.format(cell.getDateCellValue()) : valorCelda;
						valorCelda= (validaSiEsNumero(valorCelda)) ? quitarComasAlNumero(valorCelda): valorCelda;
						valorCelda= (valorCelda.equals(""))? "0": valorCelda;
						sentencia += "'" + valorCelda + "'," ;
					}
					sentencia += "0,";
					sentenciaValues += sentencia.substring(0, sentencia.length()- 1) + "),";
					
				}
			}
			sentenciaValues = sentenciaValues.substring(0, sentenciaValues.length()- 1) + ";";
			sentenciaInsert = "INSERT INTO CTRL_INGRESOS." + layoutLineaBancaria.getNombre_tabla_bd() + sentenciaColumnas +  sentenciaValues;
			
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
			System.out.println("Error al generar sentencia insert de linea bancaria: " + sError);
		}
		return sentenciaInsert;
	}
	
	private String  generaSentenciaInsertConInfoArchivoTxt(String nombreArchivo,String banco, HttpSession session,Linea_Bancaria_Layouts layoutLineaBancaria,Usuario infoUsu)
	{
		String sentenciaInsert = "";
		try
		{
			String arrayColumnasTablaBD[] = layoutLineaBancaria.getColumnas_tabla_bd().replace("[", "").replace("]", "").split(",");
			String arrayColumnasTxt[] = layoutLineaBancaria.getColumnas_excel().replace("[", "").replace("]", "").split(",");
			String sentenciaValues = " VALUES ";
			String sentenciaColumnas = " (uname, cve_banco, cve_usu, fecha_pro, hora_pro, numero_cuenta_int,";
			String numero_cuenta_interno = "";
			
			for(int i=0; i < arrayColumnasTablaBD.length; i++)
			{
				sentenciaColumnas += arrayColumnasTablaBD[i] + ",";
			}
			sentenciaColumnas = sentenciaColumnas + "id_estatus,";
			sentenciaColumnas =  sentenciaColumnas.substring(0, sentenciaColumnas.length()- 1) + ")";
			
			String fila;
			int numeroFila=0;
			FileReader archivo = new FileReader(RUTA_ARCHIVO + nombreArchivo);
			BufferedReader buffer = new BufferedReader(archivo);
			while((fila = buffer.readLine())!=null) 
			{
				
				String sentencia = "";
				String arraytxt[]= fila.replace("|", "#").split("#");
				
				if(numeroFila == 0)
				{
					numero_cuenta_interno = arraytxt[8];
					numeroFila++;
				}
				else
				{
					sentenciaValues += "('" + infoUsu.getUname()+ "', '" +  banco   + "', '" + infoUsu.getCve_usuario() + "', CURDATE(), CURTIME()," + numero_cuenta_interno+ ",";
					String  importeBanamex = "";
					String estatusBanamex = "0";
					for(int i=0; i < arrayColumnasTxt.length; i++)
					{
						String valorCelda= arraytxt[Integer.parseInt(arrayColumnasTxt[i])];
						valorCelda= valorCelda.replace("'", "").replace(",", "").replace("$", "").replace("-", "");
						valorCelda= (validaSiEsNumero(valorCelda)) ? quitarComasAlNumero(valorCelda): valorCelda;
						valorCelda= (valorCelda.equals(""))? "0": valorCelda;
						if(i == 7)
						{
							importeBanamex = valorCelda;
						}
						sentencia += "'" + valorCelda + "'," ;
					}
					estatusBanamex= (importeBanamex.equals("0.00")) ? "5" : "0";
					
					sentencia +=  estatusBanamex +",";
					sentenciaValues += sentencia.substring(0, sentencia.length()- 1) + "),";
				}
			}
			buffer.close();
			sentenciaValues = sentenciaValues.substring(0, sentenciaValues.length()- 1) + ";";
			sentenciaInsert = "INSERT INTO CTRL_INGRESOS." + layoutLineaBancaria.getNombre_tabla_bd() + sentenciaColumnas +  sentenciaValues;
			
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
			System.out.println("Error al leer archivo txt");
		}
		return sentenciaInsert;
	}
	
	private boolean validaSiEsNumero(String dato)
	{
		boolean esNumero = false;
		try
		{
			double numero= Double.parseDouble(dato.replace(",", ""));
			esNumero = true;
		}
		catch(Exception ex)
		{
			String sError= ex.getMessage().toString();
		}
		return esNumero;
	}
		
	private String quitarComasAlNumero(String dato)
	{
		dato= dato.replace(",", "");
		return dato;
	}
				
	private boolean validaSiEsFecha(String dato)
	{
		boolean esFecha = false;
		 SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		 try
		 {
			 //dateFormat.parse(dato);
			 if(dato.split("/").length > 2)
			 {
				 esFecha=true;
			 }
		 }
		 catch(Exception ex)
		 {
			 String sErro= ex.getMessage().toString();
		 }
		 return esFecha;
	}
			
	/** 6. Guarda informacion del  archivo en la Base de Datos  **/
	private boolean guardaArchivoEnTablasDeBD(Usuario infoUsu, HttpSession session,String sentenciaDelete, String sentenciaInsert, String banco)
	{
		GestorLineaBancaria gestorLinea = new GestorLineaBancaria();
		boolean procesoFileCorrectamente = gestorLinea.insertaInformacionLineaBancaria(infoUsu, sentenciaDelete, sentenciaInsert, banco);
		return procesoFileCorrectamente;
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
		
	
	/*** CODIGO PARA VALIDAR LINEAS BANCARIAS EN 0  (No se elimina codigo temporalmente)***/
	/*String referenciaOriginalBanamex="";
	String referenciaNuevaBanamex="";
	String importeBanamex="";
	if(i == 6)
	{
		referenciaOriginalBanamex = valorCelda; 
		System.out.println("6-referenciaOriginalBanamex: " + referenciaOriginalBanamex); 
		System.out.println("6-importe: " + arraytxt[Integer.parseInt(arrayColumnasTxt[7])]); 
		if(arraytxt[Integer.parseInt(arrayColumnasTxt[7])].equals("0.00"))
		{
			valorCelda = "";
		}
		else
		{
			valorCelda = referenciaOriginalBanamex;
		}
		System.out.println("6-valorCelda: " + valorCelda); 
	}
	if(i == 7)
	{
		if(valorCelda.equals("0.00"))
		{
			valorCelda = referenciaOriginalBanamex;
			System.out.println("7- valorCelda: " + valorCelda);
		}
	}*/
	
}
