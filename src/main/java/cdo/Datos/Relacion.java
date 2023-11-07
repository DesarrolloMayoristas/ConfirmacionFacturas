package cdo.Datos;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Relacion implements Serializable 
{
	private String factura;
	private String cliente;
	private String agente;
	private String importe;
	private String fecha;
	public Relacion() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Relacion(String factura, String cliente, String agente, String importe, String fecha) {
		super();
		this.factura = factura;
		this.cliente = cliente;
		this.agente = agente;
		this.importe = importe;
		this.fecha = fecha;
	}
	public String getFactura() {
		return factura;
	}
	public void setFactura(String factura) {
		this.factura = factura;
	}
	public String getCliente() {
		return cliente;
	}
	public void setCliente(String cliente) {
		this.cliente = cliente;
	}
	public String getAgente() {
		return agente;
	}
	public void setAgente(String agente) {
		this.agente = agente;
	}
	public String getImporte() {
		return importe;
	}
	public void setImporte(String importe) {
		this.importe = importe;
	}
	public String getFecha() {
		return fecha;
	}
	public void setFecha(String fecha) {
		this.fecha = fecha;
	}
	@Override
	public String toString() {
		return "Relacion [factura=" + factura + ", cliente=" + cliente + ", agente=" + agente + ", importe=" + importe
				+ ", fecha=" + fecha + "]";
	}
	
	
	

}
