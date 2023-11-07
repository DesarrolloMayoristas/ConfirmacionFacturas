package cdo.util;

import java.util.List;

import cdo.Datos.Querys;
import cdo.Datos.Usuario;

public class Cls_Querys {
	
	public static String[] ObtieneQuerys(int noQuery, List<Querys> ListaTodosQuerys, String[] ListaQuerys)
	{
		String[] querys = ListaQuerys;
		int cont = 0;
		String qry="";
		
		for(int item = 0; item < ListaTodosQuerys.size(); item++)
		{
			if(ListaTodosQuerys.get(item).getIndice_query() == noQuery)
			{
				qry= ListaTodosQuerys.get(item).getQuery().toString();
				querys[cont] = qry;
				cont++;
			}
		}
		return querys;
	}
	
	public static String[] ObtieneQuerysAnidados(int noQuery,int noQuery2,int noQuery3, List<Querys> ListaTodosQuerys, String[] ListaQuerys, Usuario infoUsu)
	{
		String[] querys = ListaQuerys;
		int cont = 0;
		String qry="";
		
		for(int item = 0; item < ListaTodosQuerys.size(); item++)
		{
			if(ListaTodosQuerys.get(item).getIndice_query() == noQuery)
			{
				qry= ListaTodosQuerys.get(item).getQuery().toString();
				qry= qry.replace("{CDO}",infoUsu.getUname().toUpperCase());
				qry= qry.replace("{UNAME}",infoUsu.getUname_br().toLowerCase());
				qry= qry.replace("{CDO_MACRO}",infoUsu.getUname().toLowerCase());
				querys[cont] = qry;
				cont++;
			}
		}
		
		for(int item = 0; item < ListaTodosQuerys.size(); item++)
		{
			if(ListaTodosQuerys.get(item).getIndice_query() == noQuery2)
			{
				qry= ListaTodosQuerys.get(item).getQuery().toString();
				qry= qry.replace("{CDO}",infoUsu.getUname().toUpperCase());
				qry= qry.replace("{UNAME}",infoUsu.getUname_br().toLowerCase());
				qry= qry.replace("{CDO_MACRO}",infoUsu.getUname().toLowerCase());
				querys[cont] = qry;
				cont++;
			}
		}
		
		for(int item = 0; item < ListaTodosQuerys.size(); item++)
		{
			if(ListaTodosQuerys.get(item).getIndice_query() == noQuery3)
			{
				qry= ListaTodosQuerys.get(item).getQuery().toString();
				qry= qry.replace("{CDO}",infoUsu.getUname().toUpperCase());
				qry= qry.replace("{UNAME}",infoUsu.getUname_br().toLowerCase());
				qry= qry.replace("{CDO_MACRO}",infoUsu.getUname().toLowerCase());
				querys[cont] = qry;
				cont++;
			}
		}
		return querys;
	}
	
		
	public static String[] LimpiaListaQuerys(String[] listaQuerys)
	{
		String[] querys = listaQuerys;
		for (int i = 0; i < querys.length ;i++) 
		{						
			querys[i] = "";
		}		
		return querys;				
	}

}
