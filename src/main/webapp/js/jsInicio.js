/********** FUNCION PARA VALIDAR CONTRASEÑA **********/
function validaPsw(psw) 
{
	if(psw.value != null && psw.value != '')
		sha1(psw);
	else
	{
		alert('Ingresar una contraseña.');
		return false;
	}
}

/********** FUNCION PARA ENCRIPTAR CONTRASEÑA EN FORMATO SHA1 **********/
function sha1(psw) 
{	
	psw.value = rstr2hex(rstr_sha1(psw.value));
}