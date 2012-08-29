# summary

Minimalistic web clipboard based on files.

Server-side endpoint in PHP. Can be easily ported to other languages.

WARNING: **There were no concerns whatsoever with OS protection XSS, etc. Use at your own risk.**



# purpose

I got fed up with sending URIs to mobile devices.

Wanted a REALLY simple solution for posting URIs and text content to paste on them.



# how it works

* hash tags serve as ids for documents.
* if no hash is given, a new one is randomized for you.
* by default you get the document slightly parsed (uris become A elements, \ns become BR elements).
* if one clicks edit a textarea appears, when one clicks save the server stores a file with its contents.



# setup

i. the current directorymust be served by a PHP-capable webserver such as Apache 2.


ii. in it create a directory named pastes

    mkdir pastes


iiia. its ownership to the apache user

    chown www-data pastes


iiib. (alternative) add permission for everyone to write in it

    chmod a+w pastes
