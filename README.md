# KoLog

This is the source code for a simple trace log monitoring server that allows users to monitor in real-time their app logs directly from a web page (or console).

<b>=The future belongs to the MAD=</b>
  
* Use \start to get an ID and start using KoLog
* Send the trace logs to  the server using a POST request to \logs\:id
* The POST body should be \{message: STRING, traceLevel: STRING\}
* Monitor the trace logs from the web using a GET request to \logs\:id
* Adding ?h=1 to the GET request will request the history for that ID

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)
