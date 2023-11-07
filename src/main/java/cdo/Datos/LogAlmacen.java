package cdo.Datos;


public class LogAlmacen 
{
 	
	private String uname;
	private String accion;
	private String cve_usu;
	public LogAlmacen(String cdo, String string, String cve_usu2) {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getAccion() {
		return accion;
	}
	public void setAccion(String accion) {
		this.accion = accion;
	}
	public String getCve_usu() {
		return cve_usu;
	}
	public void setCve_usu(String cve_usu) {
		this.cve_usu = cve_usu;
	}
	@Override
	public String toString() {
		return "LogAlmacen [uname=" + uname + ", accion=" + accion + ", cve_usu=" + cve_usu + "]";
	}
	
}
