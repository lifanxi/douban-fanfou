<%@ language=vbscript %>
<%Response.Expires = -1 %>
<%
  set objdb=Server.createobject("ADODB.Connection")
  objdb.open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.Mappath("count.mdb") 
  set rs = objdb.execute ("select js from jsq where id=1")
  response.write rs("js")
  set rs=nothing
  objdb.close
  set objdb=nothing

%>

