import factory


def main():
    """Just a main function, everything starts here."""
    queue = factory.create_queue()

    while True:
        messages = queue.receive_messages(WaitTimeSeconds=5, MaxNumberOfMessages=25)

        if not messages:
            print('waiting...')
            continue

        with open('output_file', 'a') as fout:
            for message in messages:
                fout.write(message.body + '\n')
                message.delete()

        print(f'processed {len(messages)} messages')


if __name__ == '__main__':
    main()
