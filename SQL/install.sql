--TODO ajouter les commentaires de validation

CREATE SCHEMA gn_validation_col;

CREATE TABLE gn_validation_col.t_vote_validation (
    id_vote_validation serial PRIMARY KEY,
    uuid_attached_row uuid,
    id_validator int,
    id_nomenclature_valid_status int, --statut proposé
    date_vote timestamp
)


ALTER TABLE gn_validation_col.t_vote_validation ADD CONSTRAINT check_t_validations_valid_status 
    CHECK (ref_nomenclatures.check_nomenclature_type_by_mnemonique(id_nomenclature_valid_status, 'STATUT_VALID'::character varying)) NOT VALID;


--TRIGGER
CREATE OR REPLACE FUNCTION gn_validation_col.trg_insert_validation_vote()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
 DECLARE n_vote integer;
 DECLARE max_vote_same_statut integer;   
BEGIN
 SELECT INTO max_vote_same_statut max("count") FROM ( SELECT count(*) AS "count" FROM gn_validation_col.t_vote_validation WHERE uuid_attached_row=NEW.uuid_attached_row
 GROUP BY id_nomenclature_valid_status) AS a;
 IF (max_vote_same_statut >= 2 ) THEN --Vote fermées
    RAISE EXCEPTION 'Les votes sont fermés';
    RETURN NULL;
 END IF;
 SELECT INTO n_vote count(*) FROM gn_validation_col.t_vote_validation WHERE uuid_attached_row=NEW.uuid_attached_row AND id_nomenclature_valid_status=NEW.id_nomenclature_valid_status;
 IF (n_vote = 1 ) THEN --Le vote en cours et le seconde
    INSERT INTO gn_validation_col.t_validation_test ( uuid_attached_row, id_nomenclature_valid_status, validation_auto, validation_comment, validation_date ) --A REMPLACER PAR LA TABLE gn_commons.validations
    VALUES (NEW.uuid_attached_row, NEW.id_nomenclature_valid_status, false, 'validation collegiale', now() );
    RETURN NEW;
 END IF;
 IF (n_vote = 0 ) THEN --Aucun vote
    RETURN NEW;
 END IF;
END;
$function$
;

COMMENT ON FUNCTION gn_validation_col.trg_insert_validation_vote() IS 'Attribuer un statut si 2 validateurs ont voté pour le même statut';

CREATE TRIGGER tri_insert_validation_vote BEFORE INSERT ON gn_validation_col.t_vote_validation
    FOR EACH ROW EXECUTE PROCEDURE gn_validation_col.trg_insert_validation_vote();

--TODO CREER UNE FUNCTION HELPER "can_vote(uuid)" et can_vote(uuid,id_user)




