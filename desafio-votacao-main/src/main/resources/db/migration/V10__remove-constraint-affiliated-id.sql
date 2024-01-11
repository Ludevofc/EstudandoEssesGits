ALTER TABLE vote DROP CONSTRAINT affiliated_id;
ALTER TABLE vote DROP CONSTRAINT vote_affiliated_id_fkey;

ALTER TABLE vote DROP COLUMN affiliated_id;