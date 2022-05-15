# Send email from Cloudflare Workers via MailChannels

Cloudflare [announced](https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/) a partnership with [MailChannels](https://mailchannels.com/) that allows you to send free email via workers.

The example code that MailChannels supplied wasn't working so I fixed it here to make testing easy.

1. Add `include:relay.mailchannels.net` to your domain's [SPF record](https://mailchannels.zendesk.com/hc/en-us/articles/200262610-Set-up-SPF-Records).
2. Update the code below with your email addresses
3. Create worker, paste code, save and deploy and test

Follow [Adam Sculthorpe](https://twitter.com/AdamSculthorpe) on Twitter if you have questions or found this useful.

```
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
                { "to": [ {"email": "receive@yourdomain.com",
                        "name": "Test Recipient"}]}
            ],
            "from": {
                "email": "send@yourdomain.com",
                "name": "Test Sender",
            },
            "subject": "Test Subject",
            "content": [{
                "type": "text/plain",
                "value": "Test message content\n\n" + content,
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

    let htmlContent = "<html><head></head><body><pre>" + "</pre><p>Click to send message: <form method='post'><input type='submit' value='Send'/></form></p>" + "<pre>" + respContent + "</pre>" + "</body></html>";
    return new Response(htmlContent, {
        headers: { "content-type": "text/html" },
    })
}
``` 