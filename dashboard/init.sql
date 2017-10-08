CREATE TABLE calls(
	deviceId UUID NOT NULL,
	createdAt BIGINT NOT NULL,
	predictionTime SMALLINT NOT NULL,
	predictionCardiacArrest BOOLEAN NOT NULL
);

CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
  PERFORM pg_notify('watchers', TG_TABLE_NAME);
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER watched_table_trigger AFTER INSERT ON calls
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
