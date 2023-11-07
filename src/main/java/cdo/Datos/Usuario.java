package cdo.Datos;

import java.io.Serializable;

public class Usuario implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String cve_usuario;	
	private String nombre;
	private int cve_departamento;
	private String departamento;
	private int nivel_usuario;
	private int dato_numerico;
	private String dato_alfanumerico;
	private String uname;
	private String uname_nombre;
	private String uname_br;
	private String uname_br_nombre;
	private String descripcion;
	public Usuario() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Usuario(String cve_usuario, String nombre, int cve_departamento, String departamento, int nivel_usuario,
			int dato_numerico, String dato_alfanumerico, String uname, String uname_nombre, String uname_br,
			String uname_br_nombre, String descripcion) {
		super();
		this.cve_usuario = cve_usuario;
		this.nombre = nombre;
		this.cve_departamento = cve_departamento;
		this.departamento = departamento;
		this.nivel_usuario = nivel_usuario;
		this.dato_numerico = dato_numerico;
		this.dato_alfanumerico = dato_alfanumerico;
		this.uname = uname;
		this.uname_nombre = uname_nombre;
		this.uname_br = uname_br;
		this.uname_br_nombre = uname_br_nombre;
		this.descripcion = descripcion;
	}
	public String getCve_usuario() {
		return cve_usuario;
	}
	public void setCve_usuario(String cve_usuario) {
		this.cve_usuario = cve_usuario;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public int getCve_departamento() {
		return cve_departamento;
	}
	public void setCve_departamento(int cve_departamento) {
		this.cve_departamento = cve_departamento;
	}
	public String getDepartamento() {
		return departamento;
	}
	public void setDepartamento(String departamento) {
		this.departamento = departamento;
	}
	public int getNivel_usuario() {
		return nivel_usuario;
	}
	public void setNivel_usuario(int nivel_usuario) {
		this.nivel_usuario = nivel_usuario;
	}
	public int getDato_numerico() {
		return dato_numerico;
	}
	public void setDato_numerico(int dato_numerico) {
		this.dato_numerico = dato_numerico;
	}
	public String getDato_alfanumerico() {
		return dato_alfanumerico;
	}
	public void setDato_alfanumerico(String dato_alfanumerico) {
		this.dato_alfanumerico = dato_alfanumerico;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getUname_nombre() {
		return uname_nombre;
	}
	public void setUname_nombre(String uname_nombre) {
		this.uname_nombre = uname_nombre;
	}
	public String getUname_br() {
		return uname_br;
	}
	public void setUname_br(String uname_br) {
		this.uname_br = uname_br;
	}
	public String getUname_br_nombre() {
		return uname_br_nombre;
	}
	public void setUname_br_nombre(String uname_br_nombre) {
		this.uname_br_nombre = uname_br_nombre;
	}
	public String getDescripcion() {
		return descripcion;
	}
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@Override
	public String toString() {
		return "Usuario [cve_usuario=" + cve_usuario + ", nombre=" + nombre + ", cve_departamento=" + cve_departamento
				+ ", departamento=" + departamento + ", nivel_usuario=" + nivel_usuario + ", dato_numerico="
				+ dato_numerico + ", dato_alfanumerico=" + dato_alfanumerico + ", uname=" + uname + ", uname_nombre="
				+ uname_nombre + ", uname_br=" + uname_br + ", uname_br_nombre=" + uname_br_nombre + ", descripcion="
				+ descripcion + "]";
	}
	
	
	
}
