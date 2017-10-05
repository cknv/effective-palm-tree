import factory


def main():
    """Just a main function, everything starts here."""
    queue = factory.create_queue()

    while True:
        messages = queue.receive_messages(WaitTimeSeconds=5, MaxNumberOfMessages=25)

        if not messages:
            print('waiting...')
            continue

        for message in messages:
            print(message.body)
            message.delete()


if __name__ == '__main__':
    main()
