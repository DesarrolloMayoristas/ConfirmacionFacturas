package cdo.Datos;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Corte implements Serializable 
{
	private String uname;
	private String uname_br;
	private String ode;
	private String pedido;
	private String transporte;
	private String facturas;
	private String totalfacturas;
	private String importe;
	private String totalImporte;
	public Corte() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Corte(String uname, String uname_br, String ode, String pedido, String transporte, String facturas,
			String totalfacturas, String importe, String totalImporte) {
		super();
		this.uname = uname;
		this.uname_br = uname_br;
		this.ode = ode;
		this.pedido = pedido;
		this.transporte = transporte;
		this.facturas = facturas;
		this.totalfacturas = totalfacturas;
		this.importe = importe;
		this.totalImporte = totalImporte;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public String getUname_br() {
		return uname_br;
	}
	public void setUname_br(String uname_br) {
		this.uname_br = uname_br;
	}
	public String getOde() {
		return ode;
	}
	public void setOde(String ode) {
		this.ode = ode;
	}
	public String getPedido() {
		return pedido;
	}
	public void setPedido(String pedido) {
		this.pedido = pedido;
	}
	public String getTransporte() {
		return transporte;
	}
	public void setTransporte(String transporte) {
		this.transporte = transporte;
	}
	public String getFacturas() {
		return facturas;
	}
	public void setFacturas(String facturas) {
		this.facturas = facturas;
	}
	public String getTotalfacturas() {
		return totalfacturas;
	}
	public void setTotalfacturas(String totalfacturas) {
		this.totalfacturas = totalfacturas;
	}
	public String getImporte() {
		return importe;
	}
	public void setImporte(String importe) {
		this.importe = importe;
	}
	public String getTotalImporte() {
		return totalImporte;
	}
	public void setTotalImporte(String totalImporte) {
		this.totalImporte = totalImporte;
	}
	@Override
	public String toString() {
		return "Corte [uname=" + uname + ", uname_br=" + uname_br + ", ode=" + ode + ", pedido=" + pedido
				+ ", transporte=" + transporte + ", facturas=" + facturas + ", totalfacturas=" + totalfacturas
				+ ", importe=" + importe + ", totalImporte=" + totalImporte + "]";
	}
	
}
