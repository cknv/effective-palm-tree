import factory


def main():
    """Just a main function, everything starts here."""
    queue = factory.create_queue()

    for message in queue.receive_messages(WaitTimeSeconds=10, MaxNumberOfMessages=4):
        print(message)
        print(message.delete())


if __name__ == '__main__':
    main()
