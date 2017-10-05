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


def write_to_queue(queue, message_payloads):
    """Write payloads to a queue.

    Chains on itself, when messages fail to be written, which is a concern when
    it comes to further scaling.

    Args:
        queue (sqs.Queue): The queue to write to.
        message_payloads (list): The payloads to write.
    """
    result = queue.send_messages(
        Entries=[
            {
                'Id': str(i),
                'MessageBody': payload,

            }
            for i, payload in enumerate(message_payloads)
        ],
    )

    # I have not actually gotten it to fail yet, so I assume that anything that
    # did not succeed, probably failed.
    successfulls = {
        int(each['Id'])
        for each in result['Successful']
    }

    failed_messages = [
        each
        for i, each in enumerate(message_payloads)
        if i not in successfulls
    ]

    if failed_messages:
        write_to_queue(queue, failed_messages)


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
            write_to_queue(queue, chunk)
            print(f'wrote chunk of {len(chunk)} items')


if __name__ == '__main__':
    main()
