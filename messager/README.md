Messenger
=========

Basic SQS messenger, with a writer and reader. Reads and writes from and to files.

Try it out
----------

- Get python 3.6+
- `$ pip install requirements.txt`, preferably in a virtualenv.
- Generate sample data by running `$ maker.py`.
- Run `$ docker-compose up` and then in other terminal sessions run `$ reader.py` and `$ writer.py`.

Assumptions
-----------

- The order of the messages is not important.
- The volume of messages is small, so scaling is of little concern.

Missing Bits
------------

- Make the queue configurable, so it can use actual SQS, instead of a fake one.
- Actual logging rather than printing would not hurt.
