package cdo.Datos;

import java.io.Serializable;

@SuppressWarnings("serial")
public class PedidosConsulta implements Serializable
{
	private String	ruta;
	private String consecutivo;
	private String	fecha_ods;
	private String	fecha_factura;
	private String	fecha_corta;
	private String factura_larga;
	private String	ods;
	private String	pedido;
	private String	ode;
	private String	oder;
	private String	factura;
	private String	cte;
	private String	consignatario;
	private String	direccion;
	private String	nombre_razon_social;
	private String	transporte;
	private String 	id_trayecto;
	private String 	programada;
	private String	no;
	private String	nor;
	private String 	importe;
	private String	direccion_cte;
	private String	nombre_razon_social_cte;
	private String	condicion;
	private String uname;
	private String uname_entrega;
	private String uname_br_entrega;
	private String repeticion;
	private int cc = 2;
	private String id_estatus;
	private String facturasTotales;
	public PedidosConsulta() {
		super();
		// TODO Auto-generated constructor stub
	}
	public PedidosConsulta(String ruta, String consecutivo, String fecha_ods, String fecha_factura, String fecha_corta,
			String factura_larga, String ods, String pedido, String ode, String oder, String factura, String cte,
			String consignatario, String direccion, String nombre_razon_social, String transporte, String id_trayecto,
			String programada, String no, String nor, String importe, String direccion_cte,
			String nombre_razon_social_cte, String condicion, String uname, String uname_entrega,
			String uname_br_entrega, String repeticion, int cc, String id_estatus, String facturasTotales) {
		super();
		this.ruta = ruta;
		this.consecutivo = consecutivo;
		this.fecha_ods = fecha_ods;
		this.fecha_factura = fecha_factura;
		this.fecha_corta = fecha_corta;
		this.factura_larga = factura_larga;
		this.ods = ods;
		this.pedido = pedido;
		this.ode = ode;
		this.oder = oder;
		this.factura = factura;
		this.cte = cte;
		this.consignatario = consignatario;
		this.direccion = direccion;
		this.nombre_razon_social = nombre_razon_social;
		this.transporte = transporte;
		this.id_trayecto = id_trayecto;
		this.programada = programada;
		this.no = no;
		this.nor = nor;
		this.importe = importe;
		this.direccion_cte = direccion_cte;
		this.nombre_razon_social_cte = nombre_razon_social_cte;
		this.condicion = condicion;
		this.uname = uname;
		this.uname_entrega = uname_entrega;
		this.uname_br_entrega = uname_br_entrega;
		this.repeticion = repeticion;
		this.cc = cc;
		this.id_estatus = id_estatus;
		this.facturasTotales = facturasTotales;
	}
	public String getRuta() {
		return ruta;
	}
	public void setRuta(String ruta) {
		this.ruta = ruta;
	}
	public String getConsecutivo() {
		return consecutivo;
	}
	public void setConsecutivo(String consecutivo) {
		this.consecutivo = consecutivo;
	}
	public String getFecha_ods() {
		return fecha_ods;
	}
	public void setFecha_ods(String fecha_ods) {
		this.fecha_ods = fecha_ods;
	}
	public String getFecha_factura() {
		return fecha_factura;
	}
	public void setFecha_factura(String fecha_factura) {
		this.fecha_factura = fecha_factura;
	}
	public String getFecha_corta() {
		return fecha_corta;
	}
	public void setFecha_corta(String fecha_corta) {
		this.fecha_corta = fecha_corta;
	}
	public String getFactura_larga() {
		return factura_larga;
	}
	public void setFactura_larga(String factura_larga) {
		this.factura_larga = factura_larga;
	}
	public String getOds() {
		return ods;
	}
	public void setOds(String ods) {
		this.ods = ods;
	}
	public String getPedido() {
		return pedido;
	}
	public void setPedido(String pedido) {
		this.pedido = pedido;
	}
	public String getOde() {
		return ode;
	}
	public void setOde(String ode) {
		this.ode = ode;
	}
	public String getOder() {
		return oder;
	}
	public void setOder(String oder) {
		this.oder = oder;
	}
	public String getFactura() {
		return factura;
	}
	public void setFactura(String factura) {
		this.factura = factura;
	}
	public String getCte() {
		return cte;
	}
	public void setCte(String cte) {
		this.cte = cte;
	}
	public String getConsignatario() {
		return consignatario;
	}
	public void setConsignatario(String consignatario) {
		this.consignatario = consignatario;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public String getNombre_razon_social() {
		return nombre_razon_social;
	}
	public void setNombre_razon_social(String nombre_razon_social) {
		this.nombre_razon_social = nombre_razon_social;
	}
	public String getTransporte() {
		return transporte;
	}
	public void setTransporte(String transporte) {
		this.transporte = transporte;
	}
	public String getId_trayecto() {
		return id_trayecto;
	}
	public void setId_trayecto(String id_trayecto) {
		this.id_trayecto = id_trayecto;
	}
	public String getProgramada() {
		return programada;
	}
	public void setProgramada(String programada) {
		this.programada = programada;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public String getNor() {
		return nor;
	}
	public void setNor(String nor) {
		this.nor = nor;
	}
	public String getImporte() {
		return importe;
	}
	public void setImporte(String importe) {
		this.importe = importe;
	}
	public String getDireccion_cte() {
		return direccion_cte;
	}
	public void setDireccion_cte(String direccion_cte) {
		this.direccion_cte = direccion_cte;
	}
	public String getNombre_razon_social_cte() {
		return nombre_razon_social_cte;
	}
	public void setNombre_razon_social_cte(String nombre_razon_social_cte) {
		this.nombre_razon_social_cte = nombre_razon_social_cte;
	}
	public String getCondicion() {
		return condicion;
	}
	public void setCondicion(String condicion) {
		this.condicion = condicion;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getUname_entrega() {
		return uname_entrega;
	}
	public void setUname_entrega(String uname_entrega) {
		this.uname_entrega = uname_entrega;
	}
	public String getUname_br_entrega() {
		return uname_br_entrega;
	}
	public void setUname_br_entrega(String uname_br_entrega) {
		this.uname_br_entrega = uname_br_entrega;
	}
	public String getRepeticion() {
		return repeticion;
	}
	public void setRepeticion(String repeticion) {
		this.repeticion = repeticion;
	}
	public int getCc() {
		return cc;
	}
	public void setCc(int cc) {
		this.cc = cc;
	}
	public String getId_estatus() {
		return id_estatus;
	}
	public void setId_estatus(String id_estatus) {
		this.id_estatus = id_estatus;
	}
	public String getFacturasTotales() {
		return facturasTotales;
	}
	public void setFacturasTotales(String facturasTotales) {
		this.facturasTotales = facturasTotales;
	}
	@Override
	public String toString() {
		return "PedidosConsulta [ruta=" + ruta + ", consecutivo=" + consecutivo + ", fecha_ods=" + fecha_ods
				+ ", fecha_factura=" + fecha_factura + ", fecha_corta=" + fecha_corta + ", factura_larga="
				+ factura_larga + ", ods=" + ods + ", pedido=" + pedido + ", ode=" + ode + ", oder=" + oder
				+ ", factura=" + factura + ", cte=" + cte + ", consignatario=" + consignatario + ", direccion="
				+ direccion + ", nombre_razon_social=" + nombre_razon_social + ", transporte=" + transporte
				+ ", id_trayecto=" + id_trayecto + ", programada=" + programada + ", no=" + no + ", nor=" + nor
				+ ", importe=" + importe + ", direccion_cte=" + direccion_cte + ", nombre_razon_social_cte="
				+ nombre_razon_social_cte + ", condicion=" + condicion + ", uname=" + uname + ", uname_entrega="
				+ uname_entrega + ", uname_br_entrega=" + uname_br_entrega + ", repeticion=" + repeticion + ", cc=" + cc
				+ ", id_estatus=" + id_estatus + ", facturasTotales=" + facturasTotales + "]";
	}
	
	
	
	
}
