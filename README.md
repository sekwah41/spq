apq (Advanced Promise Queue)
================

This project was made because of an issue I had with too many Promises triggering 
at once due to file detection and not wanting to rewrite the code to fix it.
This allows you to create queues and just replace the normal `new Promise` with
whatever you choose to split processes into queues.

## PromiseQueue


Example uses coming soon.

Events planned for the queue.

'empty' The queued tasks are done

'paused' Somewhere code has paused the queue

'resumed' queue.resume(); has been called when the queue was paused
