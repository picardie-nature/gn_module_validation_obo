import logging
from flask import Blueprint, current_app, request

from operator import itemgetter

import pdb

import re

from sqlalchemy import select, desc, cast, DATE, func
from sqlalchemy.exc import InternalError

import datetime
from random import shuffle

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

from .models import TValidationsCol , RecordValidation

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
        
        obs = RecordValidation(id_synthese)
        obs.vote(data['statut'],id_validator = info_role.id_role)
        
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
        SELECT id_synthese FROM gn_synthese.synthese syn
	        LEFT JOIN gn_module_validation_col.t_vote_validation v ON v.uuid_attached_row = syn.unique_id_sinp
            WHERE 
                cd_nom in (SELECT * FROM taxonomie.find_all_taxons_children(:cd_nom) UNION SELECT :cd_nom )
                AND syn.id_nomenclature_valid_status=ref_nomenclatures.get_id_nomenclature('STATUT_VALID','0')
                AND coalesce(id_validator,-1)!=(:id_validator)
            ORDER BY date_max DESC LIMIT 10"""
    #TODO ORM
    result = DB.session.execute(sql, dict(cd_nom=cd_nom, id_validator=id_validator))
    potential_reccord =  [r[0] for r in result]
    shuffle(potential_reccord)  
    
    obs = RecordValidation(potential_reccord[0])
    
    return obs.record
    #TODO utiliser ORM ?

