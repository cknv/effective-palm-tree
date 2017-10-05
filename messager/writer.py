import factory


def spool(sequence, size=50):
    """Spool an iterable into smaller chunks, without slicing.

    Args:
        sequence (iterable): An iterable sequence, such as a list.

    Keyword Arguments:
        size (int): The size of the chunks to yield.

    Yields:
        list: A chunk of the spooled data.
    """
    current = []
    for each in sequence:
        current.append(each)

        if len(current) >= size:
            yield current
            current = []

    if current:
        yield current


def main():
    """Just a main function, everything starts here."""
    queue = factory.create_queue()

    with open('input_file') as fin:
        cleaned_lines = (
            line.strip()
            for line in fin
            if line
        )

        chunks = spool(cleaned_lines)

        for chunk in chunks:
            result = queue.send_messages(
                Entries=[
                    {
                        'Id': str(i),
                        'MessageBody': payload,

                    }
                    for i, payload in enumerate(chunk)
                ]
            )

            successfulls = {
                int(each['Id'])
                for each in result['Successful']
            }

            to_retry = (
                each
                for i, each in enumerate(chunk)
                if i not in successfulls
            )

            print(list(to_retry))


if __name__ == '__main__':
    main()
