package cdo.Datos;

import java.io.Serializable;

public class Querys implements Serializable{

	private static final long serialVersionUID = 1L;
	
	private int proceso;
	private int indice_query;
	private int sub_indice_query;
	private  String descripcion;
	private String query;
	 
	 
	public Querys() {
		super();
	}

	public Querys(int proceso, int indice_query, int sub_indice_query, String descripcion, String query) {
		super();
		this.proceso = proceso;
		this.indice_query = indice_query;
		this.sub_indice_query = sub_indice_query;
		this.descripcion = descripcion;
		this.query = query;
	}

	public int getProceso() {
		return proceso;
	}


	public void setProceso(int proceso) {
		this.proceso = proceso;
	}


	public int getIndice_query() {
		return indice_query;
	}


	public void setIndice_query(int indice_query) {
		this.indice_query = indice_query;
	}


	public int getSub_indice_query() {
		return sub_indice_query;
	}


	public void setSub_indice_query(int sub_indice_query) {
		this.sub_indice_query = sub_indice_query;
	}


	public String getDescripcion() {
		return descripcion;
	}


	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}


	public String getQuery() {
		return query;
	}


	public void setQuery(String query) {
		this.query = query;
	}


	@Override
	public String toString() {
		return "Querys [proceso=" + proceso + ", indice_query=" + indice_query + ", sub_indice_query="
				+ sub_indice_query + ", descripcion=" + descripcion + ", query=" + query + "]";
	}
	 
}
