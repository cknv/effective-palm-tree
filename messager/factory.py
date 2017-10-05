import boto3


def create_queue():
    """Return a consistent SQS queue."""
    sqs = boto3.resource(
        'sqs',
        endpoint_url='http://localhost:9324',
        region_name='testing',
        aws_access_key_id='',
        aws_secret_access_key='',
    )
    queue = sqs.get_queue_by_name(
        QueueName='default',
    )

    return queue
