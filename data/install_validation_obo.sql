BEGIN;

CREATE SCHEMA gn_module_validation_obo;

---DEV----
        CREATE TABLE gn_module_validation_obo.t_validation_test (
	        id_validation serial PRIMARY KEY,
	        uuid_attached_row uuid NULL,
	        id_nomenclature_valid_status int4 NULL,
	        validation_auto bool NULL,
	        id_validator int4 NULL,
	        validation_comment text NULL,
	        validation_date timestamp NULL
        );
-------

CREATE TABLE gn_module_validation_obo.t_vote_validation (
    id_vote_validation serial PRIMARY KEY,
    uuid_attached_row uuid,
    id_validator int,
    id_nomenclature_valid_status int, --statut proposé
    date_vote timestamp DEFAULT now(),
	date_loaded timestamp NOT NULL DEFAULT now(),
    commentaire text
);

CREATE TABLE gn_module_validation_obo.cor_vote_validation (
    id_vote_validation integer REFERENCES gn_module_validation_obo.t_vote_validation(id_vote_validation),
    id_validation integer REFERENCES gn_module_validation_obo.t_validation_test(id_validation) --A REMPLACER PAR LA TABLE gn_commons.validations
);

ALTER TABLE gn_module_validation_obo.t_vote_validation ADD CONSTRAINT check_t_validations_valid_status 
    CHECK (ref_nomenclatures.check_nomenclature_type_by_mnemonique(id_nomenclature_valid_status, 'STATUT_VALID'::character varying)) NOT VALID;


--TRIGGER
CREATE OR REPLACE FUNCTION gn_module_validation_obo.trg_insert_validation_vote()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
 DECLARE n_vote integer;
 DECLARE max_vote_same_statut integer;   
BEGIN
 SELECT INTO max_vote_same_statut max("count") FROM ( SELECT count(*) AS "count" FROM gn_module_validation_obo.t_vote_validation WHERE uuid_attached_row=NEW.uuid_attached_row
 GROUP BY id_nomenclature_valid_status) AS a;
 IF (max_vote_same_statut >= 2 ) THEN --Vote fermées
    RAISE EXCEPTION 'Les votes sont fermés';
    RETURN NULL;
 END IF;
 SELECT INTO n_vote count(*) FROM gn_module_validation_obo.t_vote_validation WHERE uuid_attached_row=NEW.uuid_attached_row AND id_nomenclature_valid_status=NEW.id_nomenclature_valid_status;
 IF (n_vote = 1 ) THEN --Le vote en cours et le seconde
    INSERT INTO gn_module_validation_obo.t_validation_test ( uuid_attached_row, id_nomenclature_valid_status, validation_auto, validation_comment, validation_date ) --A REMPLACER PAR LA TABLE gn_commons.validations
    VALUES (NEW.uuid_attached_row, NEW.id_nomenclature_valid_status, false, 'validation collegiale', now() );
    RETURN NEW;
 END IF;
 IF (n_vote = 0 ) THEN --Aucun vote
    RETURN NEW;
 END IF;
END;
$function$
;

COMMENT ON FUNCTION gn_module_validation_obo.trg_insert_validation_vote() IS 'Attribuer un statut si 2 validateurs ont voté pour le même statut';

CREATE TRIGGER tri_insert_validation_vote BEFORE INSERT ON gn_module_validation_obo.t_vote_validation
    FOR EACH ROW EXECUTE PROCEDURE gn_module_validation_obo.trg_insert_validation_vote();

--TODO prevoir suppression/update de vote ?

--TODO CREER UNE FUNCTION HELPER "can_vote(uuid)" et can_vote(uuid,id_user)


--Priorisation de la validation
CREATE TABLE gn_module_validation_obo.t_validation_priority(
    uuid_attached_row uuid PRIMARY KEY,
    priority integer NOT NULL
);
COMMENT ON TABLE gn_module_validation_obo.t_validation_priority IS 'Cette table permet de soumettre manuellement certaines données en validation prioritaire';

--WIP initiatlisation de la liste de familles et ordres

INSERT INTO taxonomie.bib_listes (id_liste, nom_liste, desc_liste)
VALUES (600, 'Validation OneByOne','Taxons pouvant être choisie pour lancer la validation, généralement il s''agit d''ordre ou de familles');--TODO prendre l'id dans les parametres

INSERT INTO taxonomie.cor_nom_liste (id_nom, id_liste)
SELECT id_nom, 600 ----TODO prendre l'id_liste dans les parametres
FROM taxonomie.bib_noms bib_noms
JOIN taxonomie.taxref taxref ON bib_noms.cd_nom = taxref.cd_nom
WHERE taxref.id_rang IN ('CL','OR','FM');

COMMIT;


