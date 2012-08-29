# summary

Minimalistic web clipboard based on files.

Server-side endpoint in PHP. Can be easily ported to other languages.



# purpose

I got fed up with sending URIs to mobile devices.

Wanted a REALLY simple solution for posting URIs and text content to paste on them.



# how it works

* hash tags serve as ids for documents.
* if no hash is given, a new one is randomized for you.
* by default you get the document slightly parsed (uris become A elements, \ns become BR elements).
* if one clicks edit a textarea appears, when one clicks save the server stores a file with its contents.