import logging
from flask import Blueprint, current_app, request

from operator import itemgetter

import pdb

import re

from sqlalchemy import select, desc, cast, DATE, func
from sqlalchemy.exc import InternalError

import datetime

from geojson import FeatureCollection

from geonature.utils.utilssqlalchemy import json_resp

from geonature.core.gn_meta.models import TDatasets

from geonature.core.gn_synthese.models import (
    Synthese,
    SyntheseOneRecord,
    TSources,
    VMTaxonsSyntheseAutocomplete,
    VSyntheseForWebApp,
)

from geonature.core.gn_commons.models import BibTablesLocation

from .models import TValidationsCol

from geonature.utils.env import DB

from geonature.core.gn_permissions import decorators as permissions
from geonature.core.gn_commons.models import TValidations


# from geonature.core.gn_synthese.utils import query as synthese_query

from pypnnomenclature.models import TNomenclatures, BibNomenclaturesTypes

blueprint = Blueprint("validation_col", __name__)
log = logging.getLogger()

@blueprint.route("/", methods=["GET"])
def index():
    return 'hello'

@blueprint.route("/<id_synthese>", methods=["POST"])
@permissions.check_cruved_scope("C", True, module_code="VALIDATION_COL")
@json_resp
def post_status_vote(info_role, id_synthese):
    try :
        data = dict(request.get_json())
        id_validation_status = data["statut"]
        validation_comment = data["comment"]
        
        if id_validation_status == "":
            return "Aucun statut de validation n'est sélectionné", 400
        
        uuid = DB.session.query(Synthese.unique_id_sinp).filter(
            Synthese.id_synthese == int(id_synthese)
        )
        id_validator = info_role.id_role

        addValidation = TValidationsCol(
            uuid_attached_row = uuid,
            id_nomenclature_valid_status = id_validation_status,
            id_validator = id_validator
        )
        
        DB.session.add(addValidation)
        DB.session.commit()
        DB.session.close()
        
        return data
    except InternalError as e: #Se produit généralement si les votes sont fermés pour cette observation
        return ( 
            dict(error=str(e)),
            403
        )


"""
Lister les observations à valider
"""
@blueprint.route("/taxon/<cd_nom>", methods=["GET"])
@permissions.check_cruved_scope("C", True, module_code="VALIDATION_COL")
@json_resp
def get_synthese(info_role, cd_nom):
    sql="""
        SELECT id_synthese FROM gn_synthese.synthese WHERE cd_nom=(:cd_nom) AND id_nomenclature_valid_status=318 LIMIT 10
    """
    data=DB.session.execute(sql, dict(cd_nom=cd_nom))
    out=list()
    for e in data:
        out.append(e.id_synthese)
    #TODO filtrer les JDD non validables, utiliser ORM
    #TODO prendre les taxon childs
    #TODO filtrer les données auxquels les validateurs à accès
    return out

#Bibliotheque des niveaux de validation : api/nomenclatures/nomenclature/STATUT_VALID

"""
Prochaine observation à valider : la donnée la plus récente en attente de validation
"""
@blueprint.route("/taxon/<cd_nom>/next", methods=["GET"])
@permissions.check_cruved_scope("C", True, module_code="VALIDATION_COL")
@json_resp
def get_next_obs(info_role,cd_nom):
    id_validator = info_role.id_role
    sql="""
        WITH i as ( SELECT id_synthese FROM gn_synthese.synthese syn
	        LEFT JOIN gn_module_validation_col.t_vote_validation v ON v.uuid_attached_row = syn.unique_id_sinp
            WHERE 
                cd_nom in (SELECT * FROM taxonomie.find_all_taxons_children(:cd_nom) UNION SELECT :cd_nom )
                AND syn.id_nomenclature_valid_status=ref_nomenclatures.get_id_nomenclature('STATUT_VALID','0')
                AND coalesce(id_validator,-1)!=(:id_validator)
            ORDER BY date_max DESC LIMIT 10)
        SELECT 
            s.id_synthese,
            date_min,
            date_max,
            s.count_min,
            s.count_max,
            sd.type_count,
            sd.sex,
            s.cd_nom,
            COALESCE(bib_noms.nom_francais,taxref.nom_vern) AS nom_vern,
            taxref.lb_nom,
            s.observers
        FROM i
        JOIN gn_synthese.synthese s ON s.id_synthese = i.id_synthese
        LEFT JOIN gn_meta.t_datasets datasets ON datasets.id_dataset = s.id_dataset
        JOIN taxonomie.taxref taxref ON taxref.cd_nom=s.cd_nom
        LEFT JOIN taxonomie.bib_noms bib_noms ON bib_noms.cd_nom = taxref.cd_nom
        JOIN gn_synthese.v_synthese_decode_nomenclatures sd ON s.id_synthese = sd.id_synthese
        LEFT JOIN gn_module_validation_col.t_vote_validation v ON v.uuid_attached_row=s.unique_id_sinp
        ORDER BY random() LIMIT 1;
    """
    data=DB.session.execute(sql, dict(cd_nom=cd_nom, id_validator=id_validator))
    return dict(data.fetchone())
    """
    q = (
        DB.session.query(SyntheseOneRecord)
        .order_by(SyntheseOneRecord.date_max.desc())
        .filter(SyntheseOneRecord.cd_nom==cd_nom)
        .outerjoin( )
        .limit(1))
    return q.one().as_dict(True)
    """
    #TODO ajouter un random pour limiter les risques de conflit (= prendre 1 obs au hasard parmis les 100 dernière)
    #TODO utiliser ORM

