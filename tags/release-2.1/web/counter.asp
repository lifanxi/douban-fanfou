<%@ language=vbscript %>
<%Response.Expires = -1 %>
<%
  set objdb=Server.createobject("ADODB.Connection")
  objdb.open "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" & Server.Mappath("count.mdb") 
  objdb.execute "update jsq set js=js+1"
  objdb.close
  set objdb=nothing
  response.redirect "vxs.png"
%>

