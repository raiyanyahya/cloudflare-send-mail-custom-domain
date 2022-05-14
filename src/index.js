addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let content = "";
  for( var i of request.headers.entries() ) {
      content += i[0] + ": " + i[1] + "\n";
  }
  let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
      "method": "POST",
      "headers": {
          "content-type": "application/json",
      },
      "body": JSON.stringify({
          "personalizations": [
              { "to": [ {"email": "raiyanyahyadeveloper@gmail.com",
                      "name": "Test Recipient"}]}
          ],
          "from": {
              "email": "raiyan@upskaler.com",
              "name": "upskaler notification",
          },
          "subject": "You have a new notification",
          "content": [{
              "type": "text/plain",
              "value": "This qualifies as a proper email."
          }],
      }),
  });

  let respContent = "";
  // only send the mail on "POST", to avoid spiders, etc.
  if( request.method == "POST" ) {
      const resp = await fetch(send_request);
      const respText = await resp.text();

      respContent = resp.status + " " + resp.statusText + "\n\n" + respText;

  }

  let htmlContent = "<html><head></head><body><pre>" +
      "</pre><p>Click to send message: <form method=\"post\"><input type=\"submit\" value=\"Send\"/></form></p>" +
      "<pre>" + respContent + "</pre>" +
      "</body></html>";
  return new Response(htmlContent, {
      headers: { "content-type": "text/html" },
  })
}
