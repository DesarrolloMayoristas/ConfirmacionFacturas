<html>
<body>
    <%
          RequestDispatcher dispatcher = request.getServletContext().getRequestDispatcher("/ServidorUsuario?vista=index");
		  dispatcher.forward(request, response);
	%>
</body>
</html>
