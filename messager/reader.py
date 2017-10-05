import factory


def main():
    """Just a main function, everything starts here."""
    queue = factory.create_queue()

    while True:
        for message in queue.receive_messages(WaitTimeSeconds=5, MaxNumberOfMessages=25):
            print(message)
            print(message.delete())

        print('waiting...')


if __name__ == '__main__':
    main()
